# Pizza Shop Management System

A comprehensive management system for pizza restaurants, handling in-store dining, online ordering, kitchen operations, and payment processing.

## Features

### 🍕 Pizza Menu Management

- Admin interface to manage pizza options (sizes, crusts, toppings)
- Support for standard pizzas and custom build options
- Manage side items (wings, breadsticks, salads, drinks)
- Include images, descriptions, prices, and ingredient tracking
- Categorize items (pizzas, sides, desserts, drinks, specials)
- Handle special deals and combo promotions

### 🪑 Table Management

- Visual floor plan of restaurant tables
- Table status tracking (available, occupied, reserved, cleaning)
- Server assignment to tables or sections
- Table capacity and location indicators
- QR code generation for each table for direct ordering

### 🛒 Pizza Ordering System

- Customer-facing interface accessible via table QR codes
- Intuitive pizza customization (size, crust, toppings with visual feedback)
- Special instructions for pizza preparation
- Real-time cart management with order modification
- Multiple order submissions during one dining session
- Order status tracking for customers

### 👨‍🍳 Kitchen Display System

- Chronological display of incoming pizza and food orders
- Order prioritization with preparation times
- Clear display of custom pizza preparations and special instructions
- Status updates (Preparing, In Oven, Ready for Delivery/Pickup)
- Visual/audio alerts for new orders
- Order categorization (dine-in, takeout, delivery)

### 💳 Payment Processing

- Split bill capabilities for tables
- Multiple payment methods (cash, card, mobile payment)
- Tipping options and tip distribution
- Digital receipt generation with email option
- Handling discounts and promotional offers
- Daily sales reconciliation

### ⚡ Real-time Updates

- Socket.io integration for instant updates between kitchen, servers, and customers
- Live order status tracking
- Table availability updates
- Preparation and delivery time estimates

## Tech Stack

- **Frontend**: Next.js with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **Form Handling**: React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/pizza-shop-management.git
cd pizza-shop-management
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/pizza_shop"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
pizza-shop-management/
├── prisma/                  # Prisma schema and migrations
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── customer/        # Customer-facing pages
│   │   ├── dashboard/       # Admin, kitchen, and server dashboards
│   │   └── ...
│   ├── components/          # React components
│   │   ├── forms/           # Form components
│   │   ├── kitchen/         # Kitchen display components
│   │   ├── layout/          # Layout components
│   │   ├── menu/            # Menu components
│   │   ├── orders/          # Order components
│   │   ├── payment/         # Payment components
│   │   ├── tables/          # Table management components
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and libraries
│   │   ├── api/             # API utilities
│   │   ├── auth/            # Authentication utilities
│   │   ├── db/              # Database utilities
│   │   └── utils/           # General utilities
│   ├── providers/           # React context providers
│   └── types/               # TypeScript type definitions
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
