# Frontend Components Hierarchy

## Übersicht
Komponentenstruktur für die KI-Beratungsplattform basierend auf Atomic Design Prinzipien und Next.js 14 Best Practices.

## Design System Prinzipien
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Composition over Inheritance**: Kleine, kombinierbare Komponenten
- **TypeScript First**: Vollständige Typisierung
- **Accessibility**: ARIA Labels und Keyboard Navigation
- **i18n Ready**: Alle Texte über Translation Keys

## Komponenten-Struktur

```
/frontend/src/components/
├── atoms/              # Kleinste UI-Einheiten
├── molecules/          # Kombinationen von Atoms
├── organisms/          # Komplexe UI-Bereiche
├── templates/          # Seiten-Layouts
└── providers/          # Context Provider
```

## Atoms (Basis-Komponenten)

### Button
```typescript
// components/atoms/Button/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

// Verwendung
<Button variant="primary" size="md" leftIcon={<PlusIcon />}>
  {t('common.create_project')}
</Button>
```

### Input
```typescript
// components/atoms/Input/Input.tsx
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number'
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
  required?: boolean
}
```

### Badge
```typescript
// components/atoms/Badge/Badge.tsx
interface BadgeProps {
  variant: 'info' | 'success' | 'warning' | 'danger'
  size: 'sm' | 'md'
  children: React.ReactNode
}
```

### Avatar
```typescript
// components/atoms/Avatar/Avatar.tsx
interface AvatarProps {
  src?: string
  alt: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string // Initialen
  status?: 'online' | 'offline' | 'busy'
}
```

### Weitere Atoms
- **Text**: Typography-Komponente
- **Icon**: Icon-Wrapper für Lucide Icons
- **Spinner**: Loading-Indikator
- **Divider**: Horizontale/Vertikale Trenner
- **Link**: Next.js Link Wrapper
- **Image**: Next.js Image Wrapper

## Molecules (Zusammengesetzte Komponenten)

### Card
```typescript
// components/molecules/Card/Card.tsx
interface CardProps {
  title?: string
  description?: string
  footer?: React.ReactNode
  isHoverable?: boolean
  isPressable?: boolean
  children: React.ReactNode
}
```

### FormField
```typescript
// components/molecules/FormField/FormField.tsx
interface FormFieldProps {
  name: string
  label: string
  type: InputProps['type']
  control: Control // React Hook Form
  rules?: RegisterOptions
  helperText?: string
}

// Integriert Input + Label + Error Handling
```

### EmptyState
```typescript
// components/molecules/EmptyState/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
```

### StatCard
```typescript
// components/molecules/StatCard/StatCard.tsx
interface StatCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: React.ReactNode
}
```

### Weitere Molecules
- **Toast**: Notification Component
- **Modal**: Dialog Wrapper
- **Dropdown**: Select Komponente
- **Tabs**: Tab Navigation
- **Breadcrumb**: Navigation Path
- **Pagination**: Seiten-Navigation

## Organisms (Feature-Komponenten)

### Navigation
```typescript
// components/organisms/Navigation/Navigation.tsx
- Logo
- Nav Items (basierend auf User Role)
- User Menu (Avatar + Dropdown)
- Language Switcher
- Mobile Menu Toggle
```

### Sidebar
```typescript
// components/organisms/Sidebar/Sidebar.tsx
interface SidebarProps {
  items: Array<{
    label: string
    href: string
    icon: React.ReactNode
    badge?: number
  }>
  isCollapsed?: boolean
}
```

### AssessmentWizard
```typescript
// components/organisms/AssessmentWizard/AssessmentWizard.tsx
interface AssessmentWizardProps {
  type: 'quick' | 'detailed'
  onComplete: (responses: AssessmentResponse) => void
}

// Beinhaltet:
- Progress Bar
- Question Display
- Answer Options
- Navigation (Vor/Zurück)
- Summary
```

### KanbanBoard
```typescript
// components/organisms/KanbanBoard/KanbanBoard.tsx
interface KanbanBoardProps {
  projectId: string
  columns: Array<{
    id: string
    title: string
    tasks: Task[]
  }>
  onTaskMove: (taskId: string, columnId: string) => void
}

// Features:
- Drag & Drop (react-beautiful-dnd)
- Task Cards
- Add Task Button
- Column Management
```

### ChatInterface
```typescript
// components/organisms/ChatInterface/ChatInterface.tsx
interface ChatInterfaceProps {
  recipientId: string
  projectContext?: string
}

// Komponenten:
- Message List
- Message Input
- Typing Indicator
- File Upload
- Emoji Picker (optional)
```

### PricingTable
```typescript
// components/organisms/PricingTable/PricingTable.tsx
interface PricingTableProps {
  plans: Plan[]
  currentPlan?: string
  onSelectPlan: (planId: string) => void
}
```

### DashboardWidgets
```typescript
// components/organisms/DashboardWidgets/
- WelcomeWidget
- RoadmapWidget
- ProjectsOverviewWidget
- RecentActivityWidget
- QuickActionsWidget
```

## Templates (Layout-Komponenten)

### DashboardLayout
```typescript
// components/templates/DashboardLayout/DashboardLayout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode
}

// Struktur:
- Navigation (top)
- Sidebar (left)
- Main Content Area
- Footer (optional)
```

### AuthLayout
```typescript
// components/templates/AuthLayout/AuthLayout.tsx
// Für Login/Register/Password Reset
- Centered Card
- Background Pattern
- Logo
- Language Switcher
```

### LandingLayout
```typescript
// components/templates/LandingLayout/LandingLayout.tsx
// Für öffentliche Seiten
- Hero Navigation
- Main Content
- Footer with Links
```

## Providers (Context/State)

### ThemeProvider
```typescript
// components/providers/ThemeProvider.tsx
- Light/Dark Mode (später)
- Custom Theme Values
```

### AuthProvider
```typescript
// components/providers/AuthProvider.tsx
- User State
- Login/Logout Methods
- Token Management
```

### I18nProvider
```typescript
// components/providers/I18nProvider.tsx
- Language State
- Translation Function
- Locale Switching
```

## Beispiel: Landing Page Aufbau

```typescript
// app/(landing)/page.tsx
<LandingLayout>
  <HeroSection>
    <Heading />
    <Subheading />
    <Button variant="primary" size="lg">
      {t('landing.start_assessment')}
    </Button>
  </HeroSection>
  
  <FeaturesSection>
    <Card>
      <Icon />
      <Text />
    </Card>
  </FeaturesSection>
  
  <PricingSection>
    <PricingTable plans={plans} />
  </PricingSection>
</LandingLayout>
```

## Component Guidelines

### Naming Convention
- PascalCase für Komponenten
- camelCase für Props
- Beschreibende Namen (nicht zu kurz)

### File Structure
```
ComponentName/
├── ComponentName.tsx      # Komponente
├── ComponentName.test.tsx # Tests
├── ComponentName.stories.tsx # Storybook
├── index.ts              # Export
└── styles.module.css     # Falls needed
```

### Props Guidelines
- Interfaces statt Types
- Optional Props mit `?`
- Default Props über Destructuring
- Children als explicit prop

### Performance
- React.memo für teure Komponenten
- useMemo/useCallback wo sinnvoll
- Lazy Loading für große Komponenten
- Image Optimization mit next/image

### Accessibility
- Semantic HTML
- ARIA Labels wo nötig
- Keyboard Navigation
- Focus Management
- Screen Reader Support

## Styling Approach

### Tailwind CSS
```typescript
// Basis-Klassen in Komponenten
<button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">

// Varianten über clsx
import clsx from 'clsx'

const buttonClasses = clsx(
  'px-4 py-2 rounded-md',
  {
    'bg-blue-500 text-white': variant === 'primary',
    'bg-gray-200 text-gray-800': variant === 'secondary',
  }
)
```

### CSS Modules (wenn nötig)
```css
/* ComponentName.module.css */
.complexAnimation {
  /* Für komplexe Animationen die mit Tailwind schwer sind */
}
```

## Testing Strategy

### Unit Tests
```typescript
// Button.test.tsx
describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Integration Tests
- User Flows testen
- API Mocking mit MSW
- Form Submissions
- Navigation Tests

## Storybook Setup

```typescript
// Button.stories.tsx
export default {
  title: 'Atoms/Button',
  component: Button,
}

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Loading = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
}
```

## Import/Export Pattern

```typescript
// components/atoms/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Badge } from './Badge'

// Verwendung
import { Button, Input, Badge } from '@/components/atoms'
```

## Mobile-First Approach

```typescript
// Responsive Design mit Tailwind
<div className="
  grid grid-cols-1      // Mobile
  md:grid-cols-2        // Tablet
  lg:grid-cols-3        // Desktop
  gap-4
">
```

## Performance Monitoring

- React DevTools Profiler
- Lighthouse Scores
- Bundle Size Tracking
- Core Web Vitals