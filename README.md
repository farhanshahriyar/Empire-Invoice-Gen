# 🚀 Empire Invoice Generator  
_A next-generation invoice and business management system powered by cutting-edge technologies._

> "Designing something simple is much harder than making it complex. Simplicity is genius." — *Bill Gates*


---

## 📜 Overview

**Empire Invoice Generator** is a modern, scalable, and highly efficient invoicing and management system developed using **React**, **Supabase**, and **PostgreSQL**, styled elegantly with **Tailwind CSS**.  
It empowers businesses to **seamlessly generate, track, and manage invoices, customers, and products** — all within an intuitive, responsive interface.

---

## ✨ Core Features

### 📂 Customer Management
- **Add New Customers:** Input full customer profiles including name, multiple contacts, addresses, and notes.
- **Edit Customer Profiles:** Maintain up-to-date records with real-time editing capability.
- **Advanced Search & Sorting:** Quickly filter and locate customer records in large datasets.

### 🧾 Invoice Generation
- **Create Professional Invoices:** Dynamic forms allowing customizable fields for items, quantities, rates, and taxes.
- **Real-Time Calculations:** Automated total, tax, and discount calculations with error prevention safeguards.
- **PDF Export:** Generate high-quality, brandable PDF invoices for printing, emailing, or archiving.

### 📦 Product Management
- **Inventory Control:** Manage product lists with attributes like SKU, name, price, and description.
- **Flexible CRUD Operations:** Create, update, delete, and archive products effortlessly.
- **Filter & Search:** Organize product data with robust sorting, tagging, and search functionalities.

### 🔄 Real-time Updates
- **Supabase Sync:** Live updates across all sessions; any change in the system instantly reflects for all users.
- **Zero Downtime Experience:** Ensures business continuity with near real-time responsiveness.

### 📋 Order Management
- **Order Sheet Creation:** Build and manage customer orders with integrated address and payment options.
- **Smart Search:** Quickly find relevant products and invoices.
- **Streamlined Submission:** Simple, clear order summaries with confirmation workflows to reduce operational errors.

### 📱 Responsive Design
- **Mobile-First Architecture:** Seamlessly adapts to all devices, offering exceptional UX on desktops, tablets, and smartphones.
- **Touch Optimization:** Enhanced touch controls and mobile-friendly components.

### 🛠️ Customizable Components
- **Tailwind-Based UI Kit:** Uniform, scalable, and easily adjustable component system.
- **Reusable Elements:** Modular architecture ensures faster development and consistency across pages.

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** React (TypeScript)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite

### Backend
- **Platform:** Supabase (Backend-as-a-Service)
- **Database:** PostgreSQL

### Tools & Utilities
- **Linting:** ESLint
- **Package Management:** Bun / NPM
- **State Management:** React Hooks

---

## 📁 Directory Structure
```
farhanshahriyar-empire-invoice-gen/
├── public/
├── src/
│   ├── components/
│   │   ├── Forms (Customer, Invoice, Order, Product)
│   │   ├── Layouts (Sidebar, ThemeProvider)
│   │   ├── Order Utilities (AddressFields, PaymentMethod, ProductSearch, etc.)
│   │   ├── UI Kit (Accordion, Button, Card, Table, etc.)
│   ├── hooks/
│   ├── integrations/
│   │   └── supabase/
│   ├── lib/
│   ├── pages/
│   │   └── (Dashboard, Customers, Inventory, Orders, Invoices)
│   ├── types/
├── supabase/
├── config files (Tailwind, Vite, PostCSS, etc.)
├── README.md
├── package.json / bun.lockb
└── tsconfig files
```

## Flowchart 
---
![Empire Invoice Generator](https://78d11y9vqc.ufs.sh/f/5z2fDmMWhbJSS1wXrimU3biJQFRyIhTKkczrwpsxtdf7mgOW)

---

## 🛠️ Usage

- Navigate through intuitive pages (Dashboard, Customers, Invoices, Products, Orders).
- Use the dynamic forms to create, edit, and manage customers, invoices, and products.
- Instantly generate and download professional PDF invoices using the **InvoicePDF** feature.

---
