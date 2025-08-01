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

## Project Structure
```
/
├── admin/          # Admin application
├── client/         # Client application  
├── shared/         # Shared components and utilities
├── database/       # Database schema and migrations
└── types/          # Shared TypeScript definitions
```