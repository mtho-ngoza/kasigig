import { MessagingService } from '@/lib/database/messagingService'
import { FirestoreService } from '@/lib/database/firestore'
import { Conversation, Message, ConversationPreview } from '@/types/messaging'
import { writeBatch, doc } from 'firebase/firestore'

// Mock FirestoreService and Firebase
jest.mock('@/lib/database/firestore')
jest.mock('firebase/firestore', () => ({
  writeBatch: jest.fn(),
  doc: jest.fn()
}))
jest.mock('@/lib/firebase', () => ({
  db: {}
}))

describe('MessagingService - Additional Coverage', () => {
  const mockUserId1 = 'user-1'
  const mockUserId2 = 'user-2'
  const mockConversationId = 'conversation-123'
  const mockMessageId = 'message-456'

  const mockConversation: Conversation = {
    id: mockConversationId,
    participants: [
      {
        userId: mockUserId1,
        userName: 'User One',
        userType: 'job-seeker',
        joinedAt: new Date()
      },
      {
        userId: mockUserId2,
        userName: 'User Two',
        userType: 'employer',
        joinedAt: new Date()
      }
    ],
    participantIds: [mockUserId1, mockUserId2],
    gigId: undefined,
    gigTitle: undefined,
    lastMessageAt: new Date(),
    unreadCount: { [mockUserId1]: 2, [mockUserId2]: 0 },
    status: 'active',
    createdAt: new Date()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUserConversations', () => {
    describe('given user has multiple conversations', () => {
      describe('when getting conversations without archived', () => {
        it('then returns only active conversations', async () => {
          // Given
          const activeConv: Conversation = { ...mockConversation }
          const archivedConv: Conversation = {
            ...mockConversation,
            id: 'conv-archived',
            status: 'archived'
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([activeConv, archivedConv])

          // When
          const result = await MessagingService.getUserConversations(mockUserId1, false)

          // Then
          expect(result).toHaveLength(1)
          expect(result[0].id).toBe(mockConversationId)
          expect(result[0].status).toBe('active')
        })
      })

      describe('when getting conversations with archived', () => {
        it('then returns all conversations including archived', async () => {
          // Given
          const activeConv: Conversation = { ...mockConversation }
          const archivedConv: Conversation = {
            ...mockConversation,
            id: 'conv-archived',
            status: 'archived'
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([activeConv, archivedConv])

          // When
          const result = await MessagingService.getUserConversations(mockUserId1, true)

          // Then
          expect(result).toHaveLength(2)
          expect(result.some(c => c.status === 'archived')).toBe(true)
        })
      })
    })

    describe('given conversation has last message', () => {
      describe('when getting conversations', () => {
        it('then includes last message preview', async () => {
          // Given
          const lastMessage: Message = {
            id: mockMessageId,
            conversationId: mockConversationId,
            senderId: mockUserId2,
            senderName: 'User Two',
            senderType: 'employer',
            content: 'Hello there!',
            type: 'text',
            isRead: false,
            createdAt: new Date()
          }
          const convWithMessage: Conversation = {
            ...mockConversation,
            lastMessage
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([convWithMessage])

          // When
          const result = await MessagingService.getUserConversations(mockUserId1)

          // Then
          expect(result[0].lastMessage).toBeDefined()
          expect(result[0].lastMessage?.content).toBe('Hello there!')
          expect(result[0].lastMessage?.senderId).toBe(mockUserId2)
        })
      })
    })

    describe('given conversation has no last message', () => {
      describe('when getting conversations', () => {
        it('then lastMessage is undefined', async () => {
          // Given
          const convWithoutMessage: Conversation = {
            ...mockConversation,
            lastMessage: undefined
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([convWithoutMessage])

          // When
          const result = await MessagingService.getUserConversations(mockUserId1)

          // Then
          expect(result[0].lastMessage).toBeUndefined()
        })
      })
    })

    describe('given conversation has unread count', () => {
      describe('when getting conversations', () => {
        it('then includes correct unread count for user', async () => {
          // Given
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([mockConversation])

          // When
          const result = await MessagingService.getUserConversations(mockUserId1)

          // Then
          expect(result[0].unreadCount).toBe(2)
        })
      })
    })

    describe('given user has no unread count in conversation', () => {
      describe('when getting conversations', () => {
        it('then defaults to 0', async () => {
          // Given
          const convWithoutUnread: Conversation = {
            ...mockConversation,
            unreadCount: {}
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([convWithoutUnread])

          // When
          const result = await MessagingService.getUserConversations(mockUserId1)

          // Then
          expect(result[0].unreadCount).toBe(0)
        })
      })
    })

    describe('given other participant data', () => {
      describe('when getting conversations', () => {
        it('then returns other participant info', async () => {
          // Given
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([mockConversation])

          // When
          const result = await MessagingService.getUserConversations(mockUserId1)

          // Then
          expect(result[0].otherParticipant.userId).toBe(mockUserId2)
          expect(result[0].otherParticipant.userName).toBe('User Two')
          expect(result[0].otherParticipant.userType).toBe('employer')
        })
      })
    })

    describe('given conversation with gig title', () => {
      describe('when getting conversations', () => {
        it('then includes gig title', async () => {
          // Given
          const convWithGig: Conversation = {
            ...mockConversation,
            gigId: 'gig-123',
            gigTitle: 'Web Development Project'
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([convWithGig])

          // When
          const result = await MessagingService.getUserConversations(mockUserId1)

          // Then
          expect(result[0].gigTitle).toBe('Web Development Project')
        })
      })
    })

    describe('given Firestore error', () => {
      describe('when getting conversations', () => {
        it('then throws error with message', async () => {
          // Given
          const errorMessage = 'Firestore connection failed'
          jest.mocked(FirestoreService.getWhere).mockRejectedValue(new Error(errorMessage))

          // When & Then
          await expect(
            MessagingService.getUserConversations(mockUserId1)
          ).rejects.toThrow(`Error getting user conversations: ${errorMessage}`)
        })
      })
    })
  })

  describe('getConversationById', () => {
    describe('given valid conversation ID', () => {
      describe('when getting conversation', () => {
        it('then returns conversation', async () => {
          // Given
          jest.mocked(FirestoreService.getById).mockResolvedValue(mockConversation)

          // When
          const result = await MessagingService.getConversationById(mockConversationId)

          // Then
          expect(result).toEqual(mockConversation)
          expect(FirestoreService.getById).toHaveBeenCalledWith('conversations', mockConversationId)
        })
      })
    })

    describe('given conversation not found', () => {
      describe('when getting conversation', () => {
        it('then returns null', async () => {
          // Given
          jest.mocked(FirestoreService.getById).mockResolvedValue(null)

          // When
          const result = await MessagingService.getConversationById('non-existent')

          // Then
          expect(result).toBeNull()
        })
      })
    })

    describe('given Firestore error', () => {
      describe('when getting conversation', () => {
        it('then throws error with message', async () => {
          // Given
          const errorMessage = 'Database error'
          jest.mocked(FirestoreService.getById).mockRejectedValue(new Error(errorMessage))

          // When & Then
          await expect(
            MessagingService.getConversationById(mockConversationId)
          ).rejects.toThrow(`Error getting conversation: ${errorMessage}`)
        })
      })
    })
  })

  describe('getConversationMessages', () => {
    const mockMessage: Message = {
      id: mockMessageId,
      conversationId: mockConversationId,
      senderId: mockUserId1,
      senderName: 'User One',
      senderType: 'job-seeker',
      content: 'Test message',
      type: 'text',
      isRead: false,
      createdAt: new Date()
    }

    describe('given valid conversation ID', () => {
      describe('when getting messages with default limit', () => {
        it('then returns messages ordered by createdAt desc', async () => {
          // Given
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([mockMessage])

          // When
          const result = await MessagingService.getConversationMessages(mockConversationId)

          // Then
          expect(result).toEqual([mockMessage])
          expect(FirestoreService.getWhere).toHaveBeenCalledWith(
            'messages',
            'conversationId',
            '==',
            mockConversationId,
            'createdAt',
            'desc',
            50
          )
        })
      })

      describe('when getting messages with custom limit', () => {
        it('then applies the custom limit', async () => {
          // Given
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([mockMessage])

          // When
          await MessagingService.getConversationMessages(mockConversationId, 100)

          // Then
          expect(FirestoreService.getWhere).toHaveBeenCalledWith(
            'messages',
            'conversationId',
            '==',
            mockConversationId,
            'createdAt',
            'desc',
            100
          )
        })
      })
    })

    describe('given Firestore error', () => {
      describe('when getting messages', () => {
        it('then throws error with message', async () => {
          // Given
          const errorMessage = 'Query failed'
          jest.mocked(FirestoreService.getWhere).mockRejectedValue(new Error(errorMessage))

          // When & Then
          await expect(
            MessagingService.getConversationMessages(mockConversationId)
          ).rejects.toThrow(`Error getting messages: ${errorMessage}`)
        })
      })
    })
  })

  describe('markMessagesAsRead', () => {
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        conversationId: mockConversationId,
        senderId: mockUserId2,
        senderName: 'User Two',
        senderType: 'employer',
        content: 'Unread message 1',
        type: 'text',
        isRead: false,
        createdAt: new Date()
      },
      {
        id: 'msg-2',
        conversationId: mockConversationId,
        senderId: mockUserId2,
        senderName: 'User Two',
        senderType: 'employer',
        content: 'Unread message 2',
        type: 'text',
        isRead: false,
        createdAt: new Date()
      },
      {
        id: 'msg-3',
        conversationId: mockConversationId,
        senderId: mockUserId1,
        senderName: 'User One',
        senderType: 'job-seeker',
        content: 'Own message',
        type: 'text',
        isRead: false,
        createdAt: new Date()
      }
    ]

    describe('given unread messages from other user', () => {
      describe('when marking messages as read', () => {
        it('then updates messages and resets unread count', async () => {
          // Given
          const mockBatch = {
            update: jest.fn(),
            commit: jest.fn().mockResolvedValue(undefined)
          }
          ;(writeBatch as jest.Mock).mockReturnValue(mockBatch)
          ;(doc as jest.Mock).mockReturnValue({})

          jest.mocked(FirestoreService.getWhere).mockResolvedValue(mockMessages)
          jest.mocked(FirestoreService.getById).mockResolvedValue(mockConversation)

          // When
          await MessagingService.markMessagesAsRead(mockConversationId, mockUserId1)

          // Then
          // Should update 2 messages (excluding own message)
          expect(mockBatch.update).toHaveBeenCalledTimes(3) // 2 messages + 1 conversation
          expect(mockBatch.commit).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('given all messages already read', () => {
      describe('when marking messages as read', () => {
        it('then still resets unread count', async () => {
          // Given
          const readMessages: Message[] = mockMessages.map(m => ({ ...m, isRead: true }))
          const mockBatch = {
            update: jest.fn(),
            commit: jest.fn().mockResolvedValue(undefined)
          }
          ;(writeBatch as jest.Mock).mockReturnValue(mockBatch)
          ;(doc as jest.Mock).mockReturnValue({})

          jest.mocked(FirestoreService.getWhere).mockResolvedValue(readMessages)
          jest.mocked(FirestoreService.getById).mockResolvedValue(mockConversation)

          // When
          await MessagingService.markMessagesAsRead(mockConversationId, mockUserId1)

          // Then
          // Should only update conversation (no messages to mark as read)
          expect(mockBatch.update).toHaveBeenCalledTimes(1) // Only conversation update
          expect(mockBatch.commit).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('given conversation not found', () => {
      describe('when marking messages as read', () => {
        it('then commits batch without conversation update', async () => {
          // Given
          const mockBatch = {
            update: jest.fn(),
            commit: jest.fn().mockResolvedValue(undefined)
          }
          ;(writeBatch as jest.Mock).mockReturnValue(mockBatch)
          ;(doc as jest.Mock).mockReturnValue({})

          jest.mocked(FirestoreService.getWhere).mockResolvedValue(mockMessages)
          jest.mocked(FirestoreService.getById).mockResolvedValue(null)

          // When
          await MessagingService.markMessagesAsRead(mockConversationId, mockUserId1)

          // Then
          // Should only update messages (no conversation update)
          expect(mockBatch.update).toHaveBeenCalledTimes(2) // 2 messages only
          expect(mockBatch.commit).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('given batch commit fails', () => {
      describe('when marking messages as read', () => {
        it('then throws error with message', async () => {
          // Given
          const errorMessage = 'Batch commit failed'
          const mockBatch = {
            update: jest.fn(),
            commit: jest.fn().mockRejectedValue(new Error(errorMessage))
          }
          ;(writeBatch as jest.Mock).mockReturnValue(mockBatch)
          ;(doc as jest.Mock).mockReturnValue({})

          jest.mocked(FirestoreService.getWhere).mockResolvedValue(mockMessages)
          jest.mocked(FirestoreService.getById).mockResolvedValue(mockConversation)

          // When & Then
          await expect(
            MessagingService.markMessagesAsRead(mockConversationId, mockUserId1)
          ).rejects.toThrow(`Error marking messages as read: ${errorMessage}`)
        })
      })
    })
  })

  describe('getArchivedConversations', () => {
    describe('given user has archived conversations', () => {
      describe('when getting archived conversations', () => {
        it('then returns only archived conversations', async () => {
          // Given
          const activeConv: Conversation = { ...mockConversation }
          const archivedConv: Conversation = {
            ...mockConversation,
            id: 'conv-archived',
            status: 'archived'
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([activeConv, archivedConv])

          // When
          const result = await MessagingService.getArchivedConversations(mockUserId1)

          // Then
          expect(result).toHaveLength(1)
          expect(result[0].id).toBe('conv-archived')
          expect(result[0].status).toBe('archived')
        })
      })
    })

    describe('given user has no archived conversations', () => {
      describe('when getting archived conversations', () => {
        it('then returns empty array', async () => {
          // Given
          const activeConv: Conversation = { ...mockConversation }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([activeConv])

          // When
          const result = await MessagingService.getArchivedConversations(mockUserId1)

          // Then
          expect(result).toHaveLength(0)
        })
      })
    })
  })

  describe('getTotalUnreadCount', () => {
    describe('given user has conversations with unread messages', () => {
      describe('when getting total unread count', () => {
        it('then returns sum of all unread counts', async () => {
          // Given
          const conv1: Conversation = {
            ...mockConversation,
            unreadCount: { [mockUserId1]: 3, [mockUserId2]: 0 }
          }
          const conv2: Conversation = {
            ...mockConversation,
            id: 'conv-2',
            unreadCount: { [mockUserId1]: 5, [mockUserId2]: 2 }
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([conv1, conv2])

          // When
          const result = await MessagingService.getTotalUnreadCount(mockUserId1)

          // Then
          expect(result).toBe(8) // 3 + 5
        })
      })
    })

    describe('given user has no unread messages', () => {
      describe('when getting total unread count', () => {
        it('then returns 0', async () => {
          // Given
          const conv: Conversation = {
            ...mockConversation,
            unreadCount: { [mockUserId1]: 0, [mockUserId2]: 5 }
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([conv])

          // When
          const result = await MessagingService.getTotalUnreadCount(mockUserId1)

          // Then
          expect(result).toBe(0)
        })
      })
    })

    describe('given Firestore error', () => {
      describe('when getting total unread count', () => {
        it('then throws error with message', async () => {
          // Given
          const errorMessage = 'Query failed'
          jest.mocked(FirestoreService.getWhere).mockRejectedValue(new Error(errorMessage))

          // When & Then
          await expect(
            MessagingService.getTotalUnreadCount(mockUserId1)
          ).rejects.toThrow('Error getting total unread count: Error getting user conversations: Query failed')
        })
      })
    })
  })

  describe('archiveConversation', () => {
    describe('given valid conversation ID', () => {
      describe('when archiving conversation', () => {
        it('then updates status to archived', async () => {
          // Given
          jest.mocked(FirestoreService.update).mockResolvedValue()

          // When
          await MessagingService.archiveConversation(mockConversationId)

          // Then
          expect(FirestoreService.update).toHaveBeenCalledWith(
            'conversations',
            mockConversationId,
            { status: 'archived' }
          )
        })
      })
    })

    describe('given Firestore error', () => {
      describe('when archiving conversation', () => {
        it('then throws error with message', async () => {
          // Given
          const errorMessage = 'Update failed'
          jest.mocked(FirestoreService.update).mockRejectedValue(new Error(errorMessage))

          // When & Then
          await expect(
            MessagingService.archiveConversation(mockConversationId)
          ).rejects.toThrow(`Error archiving conversation: ${errorMessage}`)
        })
      })
    })
  })

  describe('blockConversation', () => {
    describe('given valid conversation ID', () => {
      describe('when blocking conversation', () => {
        it('then updates status to blocked', async () => {
          // Given
          jest.mocked(FirestoreService.update).mockResolvedValue()

          // When
          await MessagingService.blockConversation(mockConversationId)

          // Then
          expect(FirestoreService.update).toHaveBeenCalledWith(
            'conversations',
            mockConversationId,
            { status: 'blocked' }
          )
        })
      })
    })

    describe('given Firestore error', () => {
      describe('when blocking conversation', () => {
        it('then throws error with message', async () => {
          // Given
          const errorMessage = 'Update failed'
          jest.mocked(FirestoreService.update).mockRejectedValue(new Error(errorMessage))

          // When & Then
          await expect(
            MessagingService.blockConversation(mockConversationId)
          ).rejects.toThrow(`Error blocking conversation: ${errorMessage}`)
        })
      })
    })
  })

  describe('unarchiveConversation', () => {
    describe('given valid conversation ID', () => {
      describe('when unarchiving conversation', () => {
        it('then updates status to active', async () => {
          // Given
          jest.mocked(FirestoreService.update).mockResolvedValue()

          // When
          await MessagingService.unarchiveConversation(mockConversationId)

          // Then
          expect(FirestoreService.update).toHaveBeenCalledWith(
            'conversations',
            mockConversationId,
            { status: 'active' }
          )
        })
      })
    })

    describe('given Firestore error', () => {
      describe('when unarchiving conversation', () => {
        it('then throws error with message', async () => {
          // Given
          const errorMessage = 'Update failed'
          jest.mocked(FirestoreService.update).mockRejectedValue(new Error(errorMessage))

          // When & Then
          await expect(
            MessagingService.unarchiveConversation(mockConversationId)
          ).rejects.toThrow(`Error unarchiving conversation: ${errorMessage}`)
        })
      })
    })
  })
})
