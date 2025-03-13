# Restaurant Management System: File Structure

```
restaurant-project/
├── .cursor/
│   └── rules.json               # Cursor IDE rules for code quality
├── app/
│   ├── api/                     # API Route Handlers
│   │   ├── auth/                # Authentication endpoints
│   │   ├── menu/                # Menu management endpoints
│   │   ├── tables/              # Table management endpoints
│   │   ├── orders/              # Order management endpoints
│   │   ├── kitchen/             # Kitchen-specific endpoints
│   │   ├── payments/            # Payment processing endpoints
│   │   ├── inventory/           # Inventory management endpoints
│   │   ├── reports/             # Reporting endpoints
│   │   └── staff/               # Staff management endpoints
│   │
│   ├── (auth)/                  # Authentication route group
│   │   ├── login/               # Login page
│   │   │   └── page.tsx         # Login page component
│   │   ├── register/            # Registration page
│   │   │   └── page.tsx         # Registration page component
│   │   └── layout.tsx           # Auth layout
│   │
│   ├── (dashboard)/             # Admin dashboard route group
│   │   ├── layout.tsx           # Dashboard layout with navigation
│   │   ├── page.tsx             # Dashboard homepage
│   │   ├── menu/                # Menu management
│   │   │   ├── page.tsx         # Menu items list
│   │   │   ├── add/             # Add new menu item
│   │   │   │   └── page.tsx     # Add menu item form
│   │   │   ├── [id]/            # Edit menu item
│   │   │   │   └── page.tsx     # Edit menu item form
│   │   │   └── categories/      # Category management
│   │   │       └── page.tsx     # Category list/edit
│   │   │
│   │   ├── tables/              # Table management
│   │   │   ├── page.tsx         # Table layout and list
│   │   │   ├── layout/          # Visual table layout editor
│   │   │   │   └── page.tsx     # Layout editor interface
│   │   │   └── [id]/            # Table details
│   │   │       └── page.tsx     # Individual table view
│   │   │
│   │   ├── orders/              # Order management
│   │   │   ├── page.tsx         # Orders list
│   │   │   └── [id]/            # Order details
│   │   │       └── page.tsx     # Individual order view
│   │   │
│   │   ├── inventory/           # Inventory management
│   │   │   ├── page.tsx         # Inventory dashboard
│   │   │   ├── ingredients/     # Ingredient management
│   │   │   │   ├── page.tsx     # Ingredients list
│   │   │   │   └── [id]/        # Ingredient details
│   │   │   │       └── page.tsx # Edit ingredient
│   │   │   └── transactions/    # Inventory transactions
│   │   │       └── page.tsx     # Transaction history
│   │   │
│   │   ├── reports/             # Reporting
│   │   │   ├── page.tsx         # Reports dashboard
│   │   │   ├── sales/           # Sales reports
│   │   │   │   └── page.tsx     # Sales analysis
│   │   │   ├── inventory/       # Inventory reports
│   │   │   │   └── page.tsx     # Inventory analysis
│   │   │   └── custom/          # Custom report builder
│   │   │       └── page.tsx     # Custom report interface
│   │   │
│   │   └── staff/               # Staff management
│   │       ├── page.tsx         # Staff directory
│   │       ├── schedule/        # Scheduling
│   │       │   └── page.tsx     # Staff schedule interface
│   │       └── [id]/            # Staff member details
│   │           └── page.tsx     # Edit staff member
│   │
│   ├── kitchen/                 # Kitchen Order System
│   │   ├── layout.tsx           # Kitchen layout
│   │   ├── page.tsx             # Order queue display
│   │   └── [id]/                # Order details
│   │       └── page.tsx         # Individual order view for kitchen
│   │
│   ├── table/                   # Customer-facing ordering interface
│   │   ├── layout.tsx           # Customer layout
│   │   └── [id]/                # Table-specific ordering
│   │       ├── page.tsx         # Menu browsing interface
│   │       ├── cart/            # Shopping cart
│   │       │   └── page.tsx     # Cart management
│   │       ├── orders/          # Order history for table
│   │       │   └── page.tsx     # Past orders for this table
│   │       └── payment/         # Payment processing
│   │           └── page.tsx     # Payment interface
│   │
│   ├── error.tsx                # Global error component
│   ├── layout.tsx               # Root layout
│   ├── not-found.tsx            # 404 page
│   └── page.tsx                 # Homepage
│
├── components/                  # Shared UI Components
│   ├── ui/                      # Basic UI components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── input.tsx            # Input component
│   │   └── ...                  # Other UI components
│   │
│   ├── forms/                   # Form components
│   │   ├── menu-item-form.tsx   # Menu item form
│   │   ├── table-form.tsx       # Table form
│   │   └── ...                  # Other form components
│   │
│   ├── layout/                  # Layout components
│   │   ├── sidebar.tsx          # Dashboard sidebar
│   │   ├── header.tsx           # App header
│   │   └── ...                  # Other layout components
│   │
│   ├── features/                # Feature-specific components
│   │   ├── menu/                # Menu components
│   │   ├── table/               # Table components
│   │   ├── orders/              # Order components
│   │   ├── kitchen/             # Kitchen components
│   │   ├── inventory/           # Inventory components
│   │   └── staff/               # Staff components
│   │
│   └── shared/                  # Shared components
│       ├── data-table.tsx       # Reusable data table
│       ├── search.tsx           # Search component
│       └── ...                  # Other shared components
│
├── lib/                         # Utility functions and shared code
│   ├── actions/                 # Server actions
│   │   ├── menu.ts              # Menu actions
│   │   ├── orders.ts            # Order actions
│   │   └── ...                  # Other server actions
│   │
│   ├── db/                      # Database utilities
│   │   └── index.ts             # Prisma client instance
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── menu.ts              # Menu types
│   │   ├── order.ts             # Order types
│   │   └── ...                  # Other type definitions
│   │
│   ├── utils/                   # Utility functions
│   │   ├── format.ts            # Formatting utilities
│   │   ├── validation.ts        # Form validation
│   │   └── ...                  # Other utilities
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-menu.ts          # Menu-related hooks
│   │   ├── use-orders.ts        # Order-related hooks
│   │   └── ...                  # Other hooks
│   │
│   └── constants.ts             # Application constants
│
├── prisma/                      # Prisma ORM
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding script
│
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   ├── icons/                   # Icon assets
│   └── fonts/                   # Font assets
│
├── styles/                      # Global styles
│   └── globals.css              # Global CSS
│
├── middleware.ts                # Next.js middleware
├── next.config.js               # Next.js configuration
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## Key File Explanations

### Next.js App Structure

1. **API Routes** (`app/api/`):
   - Route handlers for all backend functionality
   - Organized by feature domain (menu, tables, orders, etc.)

2. **Auth Routes** (`app/(auth)/`):
   - Authentication-related pages (login, registration)
   - Grouped in a route group to share layout

3. **Dashboard Routes** (`app/(dashboard)/`):
   - Admin and staff management interfaces
   - Organized by feature with nested routing

4. **Kitchen System** (`app/kitchen/`):
   - Dedicated interface for kitchen staff
   - Real-time order queue and management

5. **Customer Interface** (`app/table/`):
   - Table-specific ordering interface
   - Accessed via QR code by customers

### Component Organization

1. **UI Components** (`components/ui/`):
   - Reusable, atomic UI components
   - Following a design system approach

2. **Feature Components** (`components/features/`):
   - Feature-specific component collections
   - Organized by domain

3. **Form Components** (`components/forms/`):
   - Reusable form components for data entry
   - With validation and error handling

4. **Layout Components** (`components/layout/`):
   - Structural components for page layouts
   - Headers, sidebars, navigation elements

### Utility Code

1. **Server Actions** (`lib/actions/`):
   - Encapsulated server-side logic
   - Used with React Server Components

2. **Database Utilities** (`lib/db/`):
   - Prisma client and database helpers
   - Query building functions

3. **Type Definitions** (`lib/types/`):
   - TypeScript interfaces and types
   - Ensuring type safety across the application

4. **Custom Hooks** (`lib/hooks/`):
   - React hooks for state management
   - Data fetching and manipulation

### Prisma ORM

1. **Schema** (`prisma/schema.prisma`):
   - Database schema definition
   - Entity relationships and data models

2. **Seed Script** (`prisma/seed.ts`):
   - Initial data population
   - Test data for development