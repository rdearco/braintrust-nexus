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
   - Client detail pages with comprehensive form validation
   - Add new clients with department, user, and solutions engineer assignment
   - Email, phone, and URL validation
   - Workflow management
   - Exception handling
   - ROI tracking

3. **User Management**
   - Complete CRUD operations for users
   - Role-based access control (Admin, SE, Client)
   - Client assignment for Solutions Engineers
   - Cost/bill rate management
   - Form validation and error handling

4. **Subscription Management**
   - Create and manage subscription plans
   - Pricing model configuration (Tiered, Fixed, Usage)
   - Contract length and billing cadence setup
   - Setup fees, prepayment percentages, and overage costs
   - Client assignment tracking

### Client App
1. **Workflows** (renamed from WorkflowManagement)
   - View and manage automated workflows with ROI tracking
   - Create new workflows with comprehensive form validation
   - Edit existing workflows by clicking workflow names
   - Toggle workflow status (active/inactive/testing/development)
   - Sort by various fields (date, department, name, metrics)
   - Track time saved, cost saved, nodes, executions, and exceptions

2. **Custom Agents**
   - Agent configuration and monitoring

## Access Control
- **Admin Role**: Full access to all clients and manage users
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

## Data Management

### Centralized Mock Data (`src/data/mockData.ts`)
All mock data is centralized in a single file for consistency:
- **mockClients**: Client company data with departments and workflows
- **mockUsers**: User accounts with role-based permissions
- **mockSubscriptionPlans**: Subscription plan configurations
- **mockWorkflowData**: Workflow execution and ROI data
- **mockWorkflows**: Detailed workflow definitions with nodes and executions
- **mockExceptions**: Workflow exception tracking

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

- **subscriptionApi** (`src/services/subscriptionApi.ts`): Handles subscription plan management
  - Get all subscription plans with pagination, filtering, and sorting
  - Get individual plan details
  - Create, update, and delete subscription plans
  - Get subscription statistics

- **workflowApi** (`src/services/workflowApi.ts`): Handles workflow management operations
  - Get all workflows with pagination, filtering, and sorting
  - Get individual workflow details
  - Create, update, and delete workflows
  - Toggle workflow status (active/inactive)
  - Get workflow statistics

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

- **useSubscriptions** (`src/hooks/useSubscriptions.ts`): Subscription plan data management
  - Pagination, search, and sorting state management
  - Loading and error states
  - Subscription statistics hook

- **useWorkflows** (`src/hooks/useWorkflows.ts`): Workflow data management
  - Pagination, search, and filtering state management
  - Loading and error states
  - Department and status filtering
  - Individual workflow data hook
  - Workflow statistics hook

### Key TypeScript Interfaces (`src/types/index.ts`)
- **User**: User account with role-based permissions and client assignments
- **Client**: Company information with departments and workflow metrics
- **WorkflowData**: Simplified workflow data for ROI tracking and management
- **Workflow**: Detailed workflow with nodes, executions, and exceptions
- **SubscriptionPlan**: Subscription configuration with pricing and billing
- **WorkflowException**: Exception tracking and resolution

### Testing Strategy
- Comprehensive unit tests for all API services
- Component tests mock the service hooks for isolation
- Test files follow the pattern: `*.test.ts` for services, `*.test.tsx` for components
- Vitest with proper mocking patterns for TypeScript compliance
- React Testing Library for component testing

## Project Structure
```
/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin-specific components
│   │   │   ├── Dashboard/  # Admin dashboard with metrics
│   │   │   ├── ClientManagement/  # Add new clients with validation
│   │   │   ├── UserManagement/    # Full CRUD user management
│   │   │   ├── Subscriptions/     # Subscription plan management
│   │   │   ├── SubscriptionNew/   # Create subscription plans
│   │   │   ├── Exceptions/        # Exception handling
│   │   │   ├── Credentials/       # Credential management
│   │   │   └── Billing/          # Billing management
│   │   ├── client/         # Client-specific components
│   │   │   ├── Dashboard/  # Client dashboard view
│   │   │   ├── Workflows/  # Workflow ROI management (renamed)
│   │   │   ├── Reporting/  # Reporting and analytics
│   │   │   ├── Exceptions/ # Exception management
│   │   │   ├── Credentials/# Credential management
│   │   │   └── Billing/    # Billing view
│   │   ├── shared/         # Shared components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks for data management
│   ├── services/          # API service layer with mock implementations
│   ├── data/              # Centralized mock data definitions
│   ├── types/             # TypeScript type definitions
│   └── test/              # Test utilities and setup
├── admin/                 # Admin application
├── client/                # Client application  
├── shared/                # Shared components and utilities
├── database/              # Database schema and migrations
└── types/                 # Shared TypeScript definitions
```