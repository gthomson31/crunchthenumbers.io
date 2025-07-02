# Crunch the Numbers

A professional financial calculator suite built with Next.js 14, TypeScript, and modern React patterns. Features mortgage calculations with multi-currency support, interactive charts, detailed amortization schedules, and export capabilities.

## 🚀 Quick Start

```bash
# Clone and install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
finance-calculators/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── calculators/
│   │   │   └── mortgage/       # Mortgage calculator page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable UI components
│   │   ├── calculators/        # Calculator-specific components
│   │   ├── layout/             # Layout components (Header, Footer)
│   │   └── ui/                 # Generic UI components
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utilities and types
│       ├── types/              # TypeScript type definitions
│       └── utils/              # Helper functions
├── public/                     # Static assets
└── config files               # Configuration files
```

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **React 18** - Latest React features with hooks

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Responsive charts and data visualization

### Export & PDF
- **jsPDF** - PDF generation
- **html2canvas** - HTML to canvas conversion for full reports

### Development Tools
- **ESLint** - Code linting and style enforcement
- **Autoprefixer** - CSS vendor prefixes
- **TypeScript** - Static type checking

## 🧩 Component Architecture

### Core Components

#### `MortgageCalculator.tsx`
The main mortgage calculator component featuring:
- **State Management**: Uses React hooks for inputs and results
- **Real-time Calculations**: Updates results as inputs change
- **Chart Visualization**: Multiple chart views (balance, payments, breakdown)
- **Export Functionality**: PDF and CSV export capabilities
- **Currency Support**: Multi-currency formatting

```typescript
interface MortgageInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  downPayment: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  currency: string;
  loanType: 'mortgage' | 'remortgage';
}
```

#### `ExportButton.tsx`
Handles all export functionality:
- CSV export for amortization schedules
- PDF summary reports
- Full PDF reports with charts
- Print functionality

### Layout Components

#### `Header.tsx`
- Responsive navigation
- Mobile menu with hamburger toggle
- Brand identity and links

#### `Footer.tsx`
- Site information and links
- Multi-column responsive layout

## 🔧 Key Features

### 1. Mortgage Calculations

- **Monthly Payment Calculation**: Principal, interest, taxes, insurance
- **Amortization Schedule**: Detailed month-by-month breakdown
- **Multiple Loan Types**: New mortgage vs remortgage
- **Real-time Updates**: Instant recalculation on input changes

### 2. Multi-Currency Support

Supports 6 major currencies with proper formatting:

- USD ($) - US Dollar
- EUR (€) - Euro
- GBP (£) - British Pound
- CAD (C$) - Canadian Dollar
- AUD (A$) - Australian Dollar
- JPY (¥) - Japanese Yen

### 3. Data Visualization

- **Balance Over Time**: Line chart showing loan balance reduction
- **Payment Breakdown**: Pie charts for monthly and total costs
- **Principal vs Interest**: Bar chart showing payment composition

### 4. Export Capabilities

- **CSV Export**: Amortization schedule data
- **PDF Summary**: Key results and breakdown
- **Full PDF Report**: Complete calculator with charts
- **Print Friendly**: Optimized print layouts

### 5. Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces

## 📝 TypeScript Types

### Core Types (`src/lib/types/calculator.ts`)

```typescript
interface MortgageInputs {
  loanAmount: number;          // Total home price or property value
  interestRate: number;        // Annual interest rate (%)
  loanTerm: number;           // Loan duration in years
  downPayment: number;        // Down payment or outstanding balance
  propertyTax: number;        // Annual property tax
  homeInsurance: number;      // Annual home insurance
  pmi: number;               // Monthly PMI payment
  currency: string;          // Currency code (USD, EUR, etc.)
  loanType: 'mortgage' | 'remortgage';
}

interface MortgageResults {
  monthlyPayment: number;           // Total monthly payment
  totalInterest: number;            // Total interest over loan life
  totalPayment: number;             // Total amount paid
  monthlyPI: number;               // Principal & interest only
  monthlyTaxInsurance: number;     // Tax and insurance portion
  amortizationSchedule: AmortizationPayment[];
}

interface AmortizationPayment {
  month: number;               // Payment number
  year: number;               // Year of payment
  principalPayment: number;   // Principal portion
  interestPayment: number;    // Interest portion
  remainingBalance: number;   // Remaining loan balance
  totalPayment: number;       // Total payment amount
}
```

## 🎯 Custom Hooks

### `useLocalStorage.ts`

Persists user preferences across sessions:

- Saves selected currency
- Handles SSR compatibility
- Error handling for localStorage access

```typescript
const [savedCurrency, setSavedCurrency] = useLocalStorage('selectedCurrency', 'USD');
```

## 🔄 State Management

The application uses React's built-in state management:

1. **Local Component State**: For form inputs and UI state
2. **useEffect**: For calculations and side effects
3. **localStorage**: For persisting user preferences
4. **Props**: For component communication

## 📊 Calculation Logic

### Monthly Payment Formula

```shell

M = P × [r(1 + r)^n] / [(1 + r)^n - 1]

Where:
M = Monthly payment
P = Principal loan amount
r = Monthly interest rate (annual rate ÷ 12)
n = Total number of payments (years × 12)
```

### Amortization Schedule

For each payment:

1. **Interest Payment** = Remaining Balance × Monthly Rate
2. **Principal Payment** = Monthly Payment - Interest Payment
3. **New Balance** = Previous Balance - Principal Payment

## 🎨 Styling Strategy

### Tailwind CSS Classes

- **Responsive Design**: `sm:`, `md:`, `lg:`, `xl:` prefixes
- **Grid Layouts**: `grid`, `grid-cols-*`, `gap-*`
- **Flexbox**: `flex`, `items-center`, `justify-between`
- **Colors**: Consistent color palette with hover states
- **Spacing**: Standardized padding and margins

### Component Styling Patterns
```typescript
// Card-like containers
className="bg-white p-6 rounded-xl shadow-lg"

// Button styles
className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"

// Input fields
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
```

## 📱 Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
```

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npx tsc --noEmit     # Check TypeScript types without building
```

## 📦 Dependencies

### Production Dependencies

- `next` - React framework
- `react` & `react-dom` - React library
- `recharts` - Chart library
- `lucide-react` - Icon library
- `html2canvas` - HTML to canvas conversion
- `jspdf` - PDF generation

### Development Dependencies

- `typescript` - TypeScript compiler
- `@types/*` - Type definitions
- `eslint` - Code linting
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS post-processing

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Performance Considerations

1. **Code Splitting**: Next.js automatic code splitting
2. **Image Optimization**: Next.js built-in image optimization
3. **Bundle Analysis**: Use `npm run build` to see bundle sizes
4. **Lazy Loading**: Components loaded as needed
5. **Memoization**: React.memo for expensive components

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Automatic deployments on push
3. Preview deployments for PRs

## 💰 Monetization Ready

The codebase includes infrastructure for:

- Google AdSense integration points
- Affiliate marketing component structure
- Lead generation form foundations
- Premium feature toggles

## 🔮 Future Features

Planned calculator additions:
- Personal Loan Calculator
- Investment Growth Calculator
- Debt Payoff Planner
- Retirement Calculator
- Auto Loan Calculator

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

*Generated on ${new Date().toLocaleDateString()} - This documentation covers the complete structure and functionality of the Finance Calculator application.*
