# Braintrust Nexus

A modern admin application with dual views (Admin and Client) for managing automated workflows and custom agents. Built with React, TypeScript, and a comprehensive service layer architecture.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Overview

Braintrust Nexus is a desktop-only web application that provides comprehensive workflow automation management through two distinct interfaces:

- **Admin Portal**: Complete system administration with user management, client oversight, and subscription handling
- **Client Portal**: Workflow management, ROI tracking, and exception resolution

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite
- **Routing**: React Router v6
- **UI Components**: shadcn/ui with Tailwind CSS
- **API Layer**: Mock services with custom hooks
- **Testing**: Vitest with React Testing Library
- **Authentication**: 
  - Admin: Google OAuth2 (usebraintrust.com domain)
  - Client: Internal auth with 2FA/passkey support

## 🏗 Architecture

### Service Layer Pattern
```
mockData → API Service → Custom Hook → Component
```

All data flows through a centralized service layer with proper TypeScript typing and error handling.

### Key Services
- **clientApi**: Client management operations
- **userApi**: User management with role-based access
- **subscriptionApi**: Subscription plan configuration
- **workflowApi**: Workflow operations and status management

### Custom Hooks
- **useClients**: Client data management with pagination and filtering
- **useUsers**: User management with role filtering and search
- **useSubscriptions**: Subscription plan data management
- **useWorkflows**: Workflow data with status filtering and ROI tracking

## 🎯 Key Features

### Admin Portal
- **📊 Dashboard**: Data filters (7d, 30d, MTD, QTD, YTD, ITD) with metrics cards
- **👥 User Management**: Complete CRUD operations with role-based access control
- **🏢 Client Management**: Add clients with comprehensive validation (email, phone, URL)
- **💳 Subscription Management**: Create/manage subscription plans with pricing models
- **⚙️ Workflow Management**: Exception handling and ROI tracking
- **💰 Billing & Credentials**: Management interfaces

### Client Portal
- **🔄 Workflows**: Complete workflow ROI management
  - Click workflow names to edit existing workflows
  - Toggle workflow status (active/inactive/testing/development)
  - Track time saved, cost saved, nodes, executions, exceptions
  - Sort by date, department, name, and metrics
- **⚠️ Exception Management**: Reporting and resolution
- **🤖 Custom Agent Configuration**: Agent setup and monitoring
- **💰 Billing & Credentials**: Client-specific views

## 🔐 Access Control

- **Admin Role**: Full access to all clients and user management
- **Solutions Engineer (SE)**: Access to assigned clients only
- **Client Role**: Access to own data and workflows only

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/              # Admin-specific components
│   │   ├── Dashboard/      # Admin dashboard with metrics
│   │   ├── ClientManagement/   # Add new clients with validation
│   │   ├── UserManagement/     # Full CRUD user management
│   │   ├── Subscriptions/      # Subscription plan management
│   │   ├── SubscriptionNew/    # Create subscription plans
│   │   ├── Exceptions/         # Exception handling
│   │   ├── Credentials/        # Credential management
│   │   └── Billing/           # Billing management
│   ├── client/             # Client-specific components
│   │   ├── Dashboard/      # Client dashboard view
│   │   ├── Workflows/      # Workflow ROI management
│   │   ├── Reporting/      # Reporting and analytics
│   │   ├── Exceptions/     # Exception management
│   │   ├── Credentials/    # Credential management
│   │   └── Billing/        # Billing view
│   ├── shared/             # Shared components
│   └── ui/                # shadcn/ui components
├── hooks/                  # Custom React hooks for data management
├── services/              # API service layer with mock implementations
├── data/                  # Centralized mock data definitions
├── types/                 # TypeScript type definitions
└── test/                  # Test utilities and setup
```

## 🗄 Data Management

### Centralized Mock Data
All mock data is managed in `src/data/mockData.ts`:
- **mockClients**: Client company data with departments and workflows
- **mockUsers**: User accounts with role-based permissions
- **mockSubscriptionPlans**: Subscription plan configurations
- **mockWorkflowData**: Workflow execution and ROI data
- **mockWorkflows**: Detailed workflow definitions with nodes and executions
- **mockExceptions**: Workflow exception tracking

### TypeScript Interfaces
- **User**: User account with role-based permissions and client assignments
- **Client**: Company information with departments and workflow metrics
- **WorkflowData**: Simplified workflow data for ROI tracking and management
- **Workflow**: Detailed workflow with nodes, executions, and exceptions
- **SubscriptionPlan**: Subscription configuration with pricing and billing
- **WorkflowException**: Exception tracking and resolution

## 🧪 Testing

- Comprehensive unit tests for all API services
- Component tests with proper hook mocking
- Vitest with React Testing Library
- TypeScript-compliant testing patterns
- Test files: `*.test.ts` for services, `*.test.tsx` for components

## 🚀 Development Commands

```bash
# Development
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build

# Quality Assurance
npm run typecheck  # TypeScript type checking
npm run lint       # ESLint code analysis
npm run test       # Run test suite
npm run test:ui    # Run tests with UI
npm run test:coverage  # Generate coverage report
```

## 🎨 Design System

- **UI Framework**: shadcn/ui components as foundation
- **Styling**: Tailwind CSS with consistent design tokens
- **Responsive**: Desktop-only design (no mobile support needed)
- **Accessibility**: ARIA labels and keyboard navigation
- **Design Reference**: [Figma Designs](https://www.figma.com/design/opulwnBe4xYyh4nz9o2Gc5/Nexus)

## 💡 Development Guidelines

### TypeScript Standards
- Strict TypeScript configuration (no `any` types)
- Comprehensive interface definitions
- Proper generic usage where applicable

### React Best Practices
- Functional components with hooks
- Proper dependency arrays in useEffect
- React.memo() for performance optimization
- Error boundaries for robust error handling

### Code Organization
- Single responsibility components
- Consistent naming conventions
- Clean import organization
- Proper separation of concerns

### API Integration
- Never import mockData directly in components
- Always use service layer → custom hook → component pattern
- Handle loading and error states consistently
- Implement proper form validation and user feedback

## 🔄 Workflow Management

The Workflows feature provides comprehensive workflow automation management:

### Create & Edit Workflows
- Modal dialog interface for creating new workflows
- Click workflow names to edit existing workflows
- Comprehensive form validation for all fields
- Support for workflow metadata (department, description, nodes)
- ROI tracking (time saved, cost saved)

### Status Management
- Toggle between active/inactive/testing/development states
- Real-time status updates through API integration
- Visual status indicators in the workflow table

### Data Visualization
- Sortable tables with multiple sort criteria
- Formatted currency and time displays
- Interactive elements for workflow management
- Responsive data loading with proper error handling

## 🤝 Contributing

1. Follow the established patterns in existing components
2. Ensure TypeScript strict compliance
3. Write comprehensive tests for new features
4. Run quality checks before submitting changes
5. Maintain consistency with the design system

## 📄 License

This project is proprietary software developed for Braintrust Nexus.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**