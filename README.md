# BonAppi

A mobile-first web application designed to enhance the in-restaurant dining experience by combining reservation management, pre-ordering capabilities, personalized dish tracking, and gamified loyalty features.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app runs on `http://localhost:5173` by default.

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout components (AppShell, Header, BottomNav)
│   ├── restaurant/   # Restaurant-specific components
│   └── ...
├── screens/          # Page components
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── services/         # API/Firebase services
├── utils/            # Helper functions
├── constants/        # App constants (routes, levels, achievements)
└── data/             # Mock data for development
```

## Features (MVP)

- [ ] Restaurant discovery and browsing
- [ ] Menu viewing with full dish customization
- [ ] Cart and checkout with Stripe
- [ ] Reservation system
- [ ] User authentication
- [ ] "My Usual" order saving
- [ ] Review and rating system
- [ ] Status/gamification system

## License

Private - All rights reserved
