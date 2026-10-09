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

## Pilot scope

See [docs/PILOT_SPEC.md](docs/PILOT_SPEC.md) for the approved pilot scope and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for sequencing.

## License

Private - All rights reserved
