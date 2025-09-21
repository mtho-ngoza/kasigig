# GIG-SA - Gig Work Platform for South African Youth

GIG-SA is a web-based platform designed to bridge the gap between unemployed youth and immediate, accessible work opportunities in South Africa. It functions as a trusted marketplace for short-term jobs ("gigs") and entry-level tasks, combined with a micro-learning hub.

## Features Implemented

### Core Platform
- ✅ **User Registration & Authentication**: Separate flows for job seekers and employers
- ✅ **Profile Management**: Visual profile builder focusing on skills and ratings rather than formal CVs
- ✅ **Gig Browsing**: Map-based and list-view feed of available gigs with filtering
- ✅ **Gig Posting**: Comprehensive gig creation form with budget calculation
- ✅ **GIG-Skills Learning Hub**: Micro-learning modules with skill badges

### Key Pages
- **Homepage** (`/`): Landing page with hero section and feature overview
- **Browse Gigs** (`/browse-gigs`): Filter and search available gigs
- **Post Gig** (`/post-gig`): Create new gig listings with pricing
- **Authentication** (`/auth/login`, `/auth/register`): User login and registration
- **Profile** (`/profile`): User profile management and editing
- **Learn** (`/learn`): Skill development hub with modules and badges

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### Recommended Backend (per proposal)
- **Firebase** - Authentication, database, and cloud functions
- **Firestore** - Real-time NoSQL database
- **Leaflet.js + OpenStreetMap** - Free mapping solution

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd gig-sa-claude-code
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
app/
├── auth/
│   ├── login/page.tsx          # Login page
│   └── register/page.tsx       # Registration page
├── browse-gigs/page.tsx        # Gig browsing interface
├── learn/page.tsx              # Skills learning hub
├── post-gig/page.tsx          # Gig posting form
├── profile/page.tsx           # User profile management
├── globals.css                # Global styles
├── layout.tsx                 # Root layout component
└── page.tsx                   # Homepage

components/                     # Reusable components (future use)
lib/                           # Utility functions (future use)
types/                         # TypeScript type definitions (future use)
```

## Key Features by User Type

### Job Seekers (Free)
- Profile creation with skills showcase
- Browse local gigs with map view
- Apply to gigs instantly
- Access to GIG-Skills learning modules
- Earn skill badges for profile enhancement
- Rating and review system

### Employers (Paid)
- Post gigs with detailed requirements
- Browse and contact potential workers
- Secure payment system with escrow
- Rating and review workers
- Priority listing options

## Monetization (As Per Proposal)

- **R25 listing fee** per gig posting
- **10-15% service fee** on successful bookings
- **R50 priority listing** for urgent gigs
- **Business subscription packages** for frequent hirers

## Next Steps for Full Implementation

### Immediate Priorities
1. **Firebase Integration**: Set up authentication and database
2. **Geolocation & Maps**: Implement Leaflet.js mapping
3. **Payment System**: Integrate secure wallet functionality
4. **Messaging System**: Real-time chat between users
5. **Mobile Optimization**: Responsive design improvements

### Advanced Features
1. **ID Verification**: South African ID number validation
2. **Push Notifications**: Job alerts and updates
3. **Advanced Search**: AI-powered job matching
4. **Analytics Dashboard**: User and business insights

## Contributing

This project follows the technology recommendations from the GIG-SA proposal document, prioritizing cost-effective, scalable solutions for the South African market.

## License

[License information to be added]

---

**Mission**: To empower South African youth by providing a direct path to earning an income, gaining practical experience, and building essential life skills.