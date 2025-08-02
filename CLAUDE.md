# Braintrust Nexus Test Project

## Project Overview
This is a test project for building the Braintrust Nexus platform - an admin application with two main views (Admin and Client) for managing automated workflows and custom agents.

## Tech Stack
- **Frontend**: React with TypeScript (strict - no `any` types)
- **Build Tool**: Vite
- **Routing**: React Router
- **UI Components**: shadcn/ui with theming support
- **API**: tRPC for type-safe endpoints
- **Database**: Shared database between Admin and Client apps
- **Authentication**: 
  - Admin App: Google OAuth2 with usebraintrust.com domain
  - Client App: Internal auth system with 2FA/passkey support
- **Design**: Desktop web only (no mobile support needed)

## Key Features to Implement

### Admin App
1. **Dashboard Overview**
   - Data card filters (7 days, 30 days, MTD, QTD, YTD, ITD)
   - Global metrics cards with trend indicators
   - Client management table with sorting
   - Add new client functionality

2. **Client Management**
   - Client detail pages
   - Workflow management
   - Exception handling
   - ROI tracking

### Client App
1. **Workflow Management**
   - View and manage automated workflows
   - Exception reporting and resolution
   - Execution history

2. **Custom Agents**
   - Agent configuration and monitoring

## Access Control
- **Admin Role**: Full access to all clients and user management
- **Solutions Engineer (SE)**: Access to assigned clients only
- **Client Role**: Access to own data and workflows only

## Development Guidelines
- Build modular, maintainable code
- Follow TypeScript best practices
- Use shadcn components as base, customize for unique design
- Keep cursor rules in repository
- Focus on functionality, code quality, and design accuracy

## Testing & Quality
- Implement comprehensive testing
- Run linting and type checking
- Ensure production-quality design implementation

## Design Resources
- Figma designs available at: https://www.figma.com/design/opulwnBe4xYyh4nz9o2Gc5/Nexus
- Create reasonable loading/error/empty states where missing
- Maintain professional, production-ready appearance

## Build Commands
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# Testing
npm run test
```

## API Services & Data Management

### Service Layer Architecture
The project uses a service layer pattern with mock API services that simulate real backend interactions:

- **clientApi** (`src/services/clientApi.ts`): Handles all client-related operations
  - Get all clients with pagination, filtering, and sorting
  - Get individual client details
  - Create, update, and delete clients
  - Get dashboard metrics aggregated from client data

- **userApi** (`src/services/userApi.ts`): Handles all user management operations
  - Get all users with pagination, role filtering, and search
  - Get individual user details
  - Create, update, and delete users
  - Get user statistics by role

### Custom Hooks
React hooks provide clean integration between components and API services:

- **useClients** (`src/hooks/useClients.ts`): Client data management
  - Pagination, search, and sorting state management
  - Loading and error states
  - Dashboard metrics hook

- **useUsers** (`src/hooks/useUsers.ts`): User data management
  - Role filtering and search functionality
  - User statistics hook
  - Individual user data hook

### Testing Strategy
- Comprehensive unit tests for all API services
- Component tests mock the service hooks for isolation
- Test files follow the pattern: `*.test.ts` for services, `*.test.tsx` for components

## Project Structure
```
/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin-specific components
│   │   ├── client/         # Client-specific components
│   │   ├── shared/         # Shared components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   ├── data/              # Mock data definitions
│   ├── types/             # TypeScript type definitions
│   └── test/              # Test utilities and setup
├── admin/                 # Admin application
├── client/                # Client application  
├── shared/                # Shared components and utilities
├── database/              # Database schema and migrations
└── types/                 # Shared TypeScript definitions
```