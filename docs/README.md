# Finance Calculator Documentation

## 📖 Project Overview

This is a TypeScript Next.js finance calculator application with the following key features:

- **Mortgage Calculator**: Calculate monthly payments, interest, and amortization schedules
- **Multi-Currency Support**: USD, EUR, GBP, CAD, AUD, JPY
- **Interactive Charts**: Visual representation of loan data
- **Export Functionality**: PDF and CSV export capabilities
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts for data visualization
- **Export**: jsPDF and html2canvas for reports

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── calculators/        # Calculator pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── calculators/        # Calculator components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── hooks/                  # Custom React hooks
└── lib/                    # Utilities and types
    ├── types/              # TypeScript definitions
    └── utils/              # Helper functions
```

## 📊 Component Analysis

See [Component Analysis](COMPONENT_ANALYSIS.md) for detailed breakdown of all React components.

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Documentation
npm run docs         # Generate all documentation
npm run docs:components  # Analyze components only
```

## 🚀 Key Components

### MortgageCalculator
The main calculator component featuring:
- Real-time mortgage calculations
- Interactive input forms
- Chart visualizations
- Export functionality

### ExportButton
Handles PDF and CSV export with multiple formats:
- Summary PDFs
- Full reports with charts
- CSV data export
- Print functionality

### Layout Components
- **Header**: Navigation and branding
- **Footer**: Site information and links

## 🔧 TypeScript Integration

This project uses TypeScript for:
- Type-safe component props
- Interface definitions for data structures
- Compile-time error checking
- Better IDE support and autocomplete

## 📱 Responsive Design

Built with mobile-first approach using Tailwind CSS:
- Responsive grid layouts
- Mobile-optimized touch targets
- Flexible typography and spacing
- Cross-browser compatibility

---
*Documentation generated on 30/06/2025, 17:46:05*
