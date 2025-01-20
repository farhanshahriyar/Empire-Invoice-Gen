# Empire Invoice Generator
A modern invoice generator and management system built with React, Supabase, and PostgreSQL, styled using Tailwind CSS. This project helps users create, manage, and track invoices, customers, and products efficiently.

- **Customer Management:**
  - Add new customers with detailed contact information.
  - Edit existing customer profiles to update their details.
  - View all customers in a tabulated format with quick search and sorting capabilities.

- **Invoice Generation:**
  - Generate professional invoices with customizable fields for products, quantities, and prices.
  - Automatically calculate totals, taxes, and discounts.
  - Export invoices as PDF files for sharing or printing.

- **Product Management:**
  - Add new products with attributes like name, price, and SKU.
  - Edit or delete existing products to keep the inventory up-to-date.
  - Organize and search products easily using filters.

- **Real-time Updates:**
  - Leveraging Supabase's real-time capabilities to synchronize data across users.
  - Instantly update invoices, customer details, and product information across sessions.

- **Order Management:**
  - Create and manage order sheets with options for address and payment method selection.
  - Search for products and invoices seamlessly.
  - Submit orders with a clear summary and confirmation process.

- **Responsive Design:**
  - The application is fully responsive, ensuring optimal usability on both desktop and mobile devices.

- **Customizable Components:**
  - Reusable UI components such as buttons, forms, and tables, built with Tailwind CSS for consistent styling.

## Tech Stack

### Frontend
- **Framework:** React (TypeScript)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite

### Backend
- **Platform:** Supabase (Backend-as-a-Service)
- **Database:** PostgreSQL

### Tools and Utilities
- **Linting:** ESLint
- **Package Management:** Bun/NPM
- **State Management:** React Hooks

## Directory Structure

```
farhanshahriyar-empire-invoice-gen/
├── README.md
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── CreateCustomerForm.tsx
│   │   ├── CreateInvoiceForm.tsx
│   │   ├── CreateOrderSheet.tsx
│   │   ├── CreateProductForm.tsx
│   │   ├── EditCustomerForm.tsx
│   │   ├── EditInvoiceForm.tsx
│   │   ├── EditProductForm.tsx
│   │   ├── InvoicePDF.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── layout/
│   │   │   └── AppSidebar.tsx
│   │   ├── order/
│   │   │   ├── AddressFields.tsx
│   │   │   ├── InvoiceSearch.tsx
│   │   │   ├── OrderFormSubmit.ts
│   │   │   ├── PaymentMethod.tsx
│   │   │   └── ProductSearch.tsx
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── date-range-picker.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Customers.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Index.tsx
│   │   ├── Inventory.tsx
│   │   ├── Invoices.tsx
│   │   └── Orders.tsx
│   └── types/
│       └── invoice.ts
└── supabase/
    └── config.toml
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/username/farhanshahriyar-empire-invoice-gen.git
   cd farhanshahriyar-empire-invoice-gen
   ```

2. Install dependencies:

   ```bash
   bun install
   # or use npm
   npm install
   ```

3. Set up Supabase:
   - Create a Supabase project at [Supabase](https://supabase.io/).
   - Configure the `supabase/config.toml` file with your project credentials.

4. Start the development server:

   ```bash
   bun dev
   # or use npm
   npm run dev
   ```

5. Access the app in your browser at `http://localhost:3000`.

## Usage

- Navigate to different pages (Dashboard, Customers, Invoices, etc.).
- Use the forms to create or edit customers, invoices, and products.
- Generate PDF invoices using the **InvoicePDF** component.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.

