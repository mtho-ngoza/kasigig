# GigSA - South African Gig Economy Platform

A modern, responsive web platform connecting job seekers with employers in South Africa's growing gig economy.

## 🚀 Current Status

**✅ MVP Complete & Functional!**
- Authentication system working with Firebase
- Public gig browsing implemented with demo data
- Role-based dashboards for job seekers and employers
- Responsive design with Tailwind CSS v4
- Error handling and loading states

## 🎯 Features

### ✅ **Implemented Features**
- **🔐 User Authentication**: Firebase-powered registration and login
- **👥 Role-based Access**: Separate experiences for job seekers and employers
- **🌐 Public Gig Browser**: Browse gigs without authentication required
- **📱 Responsive Design**: Mobile-first, works on all devices
- **🎨 Modern UI**: Professional design with Tailwind CSS v4
- **🔄 Smooth Navigation**: Seamless transitions between pages
- **💾 Demo Data**: 5 realistic South African gigs for testing
- **⚡ Error Handling**: Graceful error boundaries and fallbacks
- **🔍 Search & Filter**: Filter gigs by category and search terms

### 🚧 **Planned Features** (Next Development Phase)
- **📝 Gig Posting**: Employers can create and manage job postings
- **📋 Application System**: Job seekers can apply and track applications
- **👤 Profile Management**: Detailed user profiles with skills and portfolio
- **💬 Messaging System**: Direct communication between users
- **💳 Payment Integration**: Secure payment processing for completed work
- **⭐ Review System**: Rating and feedback system
- **🔍 Advanced Search**: Enhanced filtering and search capabilities
- **📊 Analytics Dashboard**: Insights for employers and job seekers
- **🔔 Notifications**: Real-time updates and alerts
- **📧 Email Integration**: Automated email notifications

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with TypeScript & App Router
- **Styling**: Tailwind CSS v4 with custom theme configuration
- **Authentication**: Firebase Auth with Firestore user profiles
- **Database**: Cloud Firestore for scalable data storage
- **State Management**: React Context API
- **Error Handling**: React Error Boundaries
- **Development**: Hot reload, TypeScript checking, ESLint

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd gig-sa-claude-code
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication → Email/Password provider
   - Enable Firestore Database
   - Add your domain to authorized domains in Authentication settings

4. **Set up environment variables**
Copy `.env.local.example` to `.env.local` and add your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
├── app/                           # Next.js 15 app directory
│   ├── globals.css               # Tailwind CSS v4 + custom theme
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page with routing logic
├── components/                    # React components
│   ├── auth/                     # Authentication UI
│   │   ├── AuthPage.tsx          # Login/signup page
│   │   ├── LoginForm.tsx         # Login form component
│   │   └── RegisterForm.tsx      # Registration form
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx            # Custom button component
│   │   ├── Card.tsx              # Card layout component
│   │   ├── Input.tsx             # Form input component
│   │   └── Loading.tsx           # Loading spinner component
│   ├── Dashboard.tsx             # User dashboard (role-based)
│   ├── PublicGigBrowser.tsx      # Public gig browsing interface
│   └── ErrorBoundary.tsx         # Error boundary component
├── contexts/                      # React contexts
│   └── AuthContext.tsx           # Authentication state management
├── lib/                          # Core business logic
│   ├── auth/                     # Authentication services
│   │   └── firebase.ts           # Firebase auth integration
│   ├── database/                 # Database operations
│   │   ├── firestore.ts          # Generic Firestore service
│   │   └── gigService.ts         # Gig-specific operations
│   └── firebase.ts               # Firebase configuration
└── types/                        # TypeScript definitions
    ├── auth.ts                   # Auth-related types
    └── gig.ts                    # Gig-related types
```

## 🎨 Key Design Decisions

### Authentication Flow
- **Public-first approach**: Browse gigs without signup required
- **Role-based registration**: Job seekers vs employers get different dashboards
- **Seamless navigation**: Easy switching between public browsing and authenticated features

### Technical Architecture
- **Tailwind CSS v4**: Latest version with `@theme` configuration in CSS
- **Firebase integration**: Authentication + Firestore for scalable data management
- **TypeScript throughout**: Type safety for robust development
- **Error boundaries**: Graceful handling of runtime errors
- **Demo data fallback**: Functional experience even without Firebase setup

## 🧪 Testing the Application

1. **Public browsing**: Visit homepage to see demo gigs
2. **User registration**: Click "Sign Up" to create job seeker/employer account
3. **Role-based dashboards**: Login to see different interfaces based on user type
4. **Navigation flow**: Test seamless transitions between browsing, auth, and dashboard
5. **Search functionality**: Try filtering gigs by category and search terms

## 🔧 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment

Ready for deployment to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Firebase Hosting**

Ensure environment variables are configured in your deployment platform.

## 📋 Remaining TODOs

### High Priority
- [ ] **Gig posting interface** for employers
- [ ] **Application submission system** for job seekers
- [ ] **Profile management** pages (skills, experience, portfolio)
- [ ] **Real-time messaging** between users
- [ ] **Firestore security rules** implementation

### Medium Priority
- [ ] **Payment integration** (Stripe/PayFast for South Africa)
- [ ] **Review and rating system** for completed gigs
- [ ] **Email notifications** for applications and updates
- [ ] **Advanced search filters** (location, salary range, skills)
- [ ] **File upload** for portfolios and documents

### Future Enhancements
- [ ] **Mobile app** (React Native)
- [ ] **Analytics dashboard** for platform insights
- [ ] **Multi-language support** (Afrikaans, Zulu, etc.)
- [ ] **Location-based matching** with maps integration
- [ ] **Skills verification** system
- [ ] **Freelancer portfolio** showcase
- [ ] **Push notifications** for mobile
- [ ] **Advanced reporting** for platform analytics

## 🔧 Known Issues

- Warning about Next.js SWC dependencies (cosmetic, doesn't affect functionality)
- Demo data shown when Firebase database is empty (by design)

## 🔐 Firebase Security

### Firestore Security Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow others to read basic profile info
    }

    // Gigs are readable by all authenticated users
    match /gigs/{gigId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.employerId;
    }

    // Applications
    match /applications/{applicationId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == resource.data.applicantId ||
         request.auth.uid == resource.data.employerId);
    }

    // Reviews
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.reviewerId;
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For questions, suggestions, or issues:
- Open an issue in this repository
- Check the project documentation
- Review the demo data implementation for examples

---

**Built with ❤️ for South Africa's gig economy** 🇿🇦