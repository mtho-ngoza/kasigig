'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { usePayment } from '@/contexts/PaymentContext'
import { PaymentHistory as PaymentHistoryType } from '@/types/payment'
import { PaymentService } from '@/lib/services/paymentService'
import { useAuth } from '@/contexts/AuthContext'

interface PaymentHistoryProps {
  limit?: number
  showHeader?: boolean
}

export default function PaymentHistory({ limit, showHeader = true }: PaymentHistoryProps) {
  const { user } = useAuth()
  const { formatCurrency } = usePayment()
  const [history, setHistory] = useState<PaymentHistoryType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'earnings' | 'payments' | 'refunds'>('all')

  useEffect(() => {
    loadHistory()
  }, [user])

  const loadHistory = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const paymentHistory = await PaymentService.getUserPaymentHistory(user.id, limit || 50)
      setHistory(paymentHistory)
    } catch (error) {
      console.error('Error loading payment history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredHistory = filter === 'all'
    ? history
    : history.filter(item => item.type === filter)

  const getTypeIcon = (type: PaymentHistoryType['type']) => {
    switch (type) {
      case 'earnings':
        return '💰'
      case 'payments':
        return '💸'
      case 'refunds':
        return '🔄'
      case 'fees':
        return '📊'
      default:
        return '💳'
    }
  }

  const getTypeLabel = (type: PaymentHistoryType['type']) => {
    switch (type) {
      case 'earnings':
        return 'Earnings'
      case 'payments':
        return 'Payment'
      case 'refunds':
        return 'Refund'
      case 'fees':
        return 'Fee'
      default:
        return 'Transaction'
    }
  }

  const getStatusColor = (status: PaymentHistoryType['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-orange-600 bg-orange-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const groupByDate = (items: PaymentHistoryType[]) => {
    const groups: Record<string, PaymentHistoryType[]> = {}

    items.forEach(item => {
      const dateKey = item.createdAt.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(item)
    })

    return groups
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-gray-600">Loading transaction history...</p>
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Transaction History
          </h3>
          <p className="text-gray-600">
            Your payment transactions will appear here once you start earning or making payments.
          </p>
        </CardContent>
      </Card>
    )
  }

  const groupedHistory = groupByDate(filteredHistory)

  return (
    <div className="space-y-4">
      {showHeader && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle>Payment History</CardTitle>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'earnings', label: 'Earnings' },
                  { value: 'payments', label: 'Payments' },
                  { value: 'refunds', label: 'Refunds' }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={filter === option.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(option.value as 'all' | 'earnings' | 'payments' | 'refunds')}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Transaction Groups by Date */}
      {Object.entries(groupedHistory)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([dateKey, items]) => (
          <Card key={dateKey}>
            <CardHeader className="pb-3">
              <h3 className="text-sm font-medium text-gray-900">
                {new Date(dateKey).toLocaleDateString('en-ZA', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {items
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                  .map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getTypeIcon(item.type)}</div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {getTypeLabel(item.type)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(item.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-lg font-semibold ${
                          item.type === 'earnings' ? 'text-green-600' :
                          item.type === 'payments' ? 'text-red-600' :
                          'text-gray-900'
                        }`}>
                          {item.type === 'payments' && item.amount > 0 ? '-' : '+'}
                          {formatCurrency(Math.abs(item.amount))}
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}

      {/* Load More Button */}
      {!limit && filteredHistory.length > 0 && (
        <div className="text-center">
          <Button variant="outline" onClick={loadHistory}>
            Refresh History
          </Button>
        </div>
      )}

      {/* Summary Card */}
      {filteredHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Period Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    filteredHistory
                      .filter(item => item.type === 'earnings' && item.status === 'completed')
                      .reduce((sum, item) => sum + item.amount, 0)
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    Math.abs(filteredHistory
                      .filter(item => item.type === 'payments' && item.status === 'completed')
                      .reduce((sum, item) => sum + item.amount, 0))
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredHistory.filter(item => item.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {filteredHistory.length}
                </div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}