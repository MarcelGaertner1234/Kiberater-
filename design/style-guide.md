# Design System & Style Guide

## Brand Identity

### Logo
- Primary: KI-Beratung text logo with AI-inspired icon
- Secondary: Icon only for small spaces
- Minimum size: 120px width (web), 40px (mobile)

### Brand Values
- **Professional**: Trustworthy expertise
- **Modern**: Cutting-edge technology
- **Accessible**: Easy to understand
- **Personal**: Individual approach

## Color Palette

### Primary Colors
- **Primary Blue**: #1e40af (HSL: 222.2 47.4% 11.2%)
  - Use for: Primary buttons, links, focus states
- **Primary Light**: #3b82f6
  - Use for: Hover states, accents

### Secondary Colors
- **Secondary Gray**: #f3f4f6 (HSL: 210 40% 96.1%)
  - Use for: Backgrounds, cards
- **Text Dark**: #111827 (HSL: 222.2 84% 4.9%)
  - Use for: Primary text, headings

### Semantic Colors
- **Success Green**: #10b981
- **Warning Yellow**: #f59e0b  
- **Error Red**: #ef4444
- **Info Blue**: #3b82f6

### Neutral Palette
- **Gray 50**: #f9fafb
- **Gray 100**: #f3f4f6
- **Gray 200**: #e5e7eb
- **Gray 300**: #d1d5db
- **Gray 400**: #9ca3af
- **Gray 500**: #6b7280
- **Gray 600**: #4b5563
- **Gray 700**: #374151
- **Gray 800**: #1f2937
- **Gray 900**: #111827

## Typography

### Font Family
- **Primary**: Inter (sans-serif)
- **Fallback**: system-ui, -apple-system, sans-serif
- **Monospace**: 'Fira Code', monospace (for code)

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)

### Font Weights
- **Regular**: 400 (body text)
- **Medium**: 500 (emphasis)
- **Semibold**: 600 (subheadings)
- **Bold**: 700 (headings)

### Line Heights
- **Tight**: 1.25
- **Normal**: 1.5
- **Relaxed**: 1.75

## Spacing System

Based on 4px grid:
- **0**: 0px
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

## Component Library

### Buttons
```
Primary: bg-primary text-white hover:bg-primary-dark
Secondary: bg-secondary text-gray-700 hover:bg-gray-300
Ghost: text-primary hover:bg-gray-100
Destructive: bg-red-600 text-white hover:bg-red-700
```

### Cards
```
Default: bg-white rounded-lg shadow-sm border border-gray-200
Hover: hover:shadow-md transition-shadow
Padding: p-6
```

### Forms
```
Input: border border-gray-300 rounded-md px-3 py-2
Focus: focus:ring-2 focus:ring-primary focus:border-transparent
Label: text-sm font-medium text-gray-700 mb-1
Error: border-red-500 text-red-600
```

### Badges
```
Default: inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
Success: bg-green-100 text-green-800
Warning: bg-yellow-100 text-yellow-800
Error: bg-red-100 text-red-800
Info: bg-blue-100 text-blue-800
```

## Layout Principles

### Grid System
- 12-column grid on desktop
- 6-column grid on tablet
- 4-column grid on mobile
- Gutter: 24px (desktop), 16px (mobile)

### Container Widths
- **Max Width**: 1280px
- **Padding**: 24px (desktop), 16px (mobile)

### Breakpoints
- **Mobile**: 0-767px
- **Tablet**: 768-1023px
- **Desktop**: 1024px+
- **Wide**: 1280px+

## Icons

### Icon Library
- **Primary**: Lucide React
- **Size variants**: 16px, 20px, 24px
- **Stroke width**: 2px
- **Color**: Inherit from parent

### Common Icons
- Dashboard: LayoutDashboard
- User: User
- Settings: Settings
- Chart: BarChart3
- Message: MessageSquare
- Calendar: Calendar
- Check: Check
- Close: X

## Motion & Animation

### Transitions
- **Fast**: 150ms (micro-interactions)
- **Normal**: 300ms (most transitions)
- **Slow**: 500ms (page transitions)

### Easing Functions
- **Ease**: cubic-bezier(0.4, 0, 0.2, 1)
- **Ease-in**: cubic-bezier(0.4, 0, 1, 1)
- **Ease-out**: cubic-bezier(0, 0, 0.2, 1)

### Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Accessibility

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus States
- Visible focus ring: 2px solid primary
- Keyboard navigation support
- Skip links for main content

### ARIA Labels
- All interactive elements have labels
- Form inputs have associated labels
- Error messages connected to inputs

## Responsive Design

### Mobile First
- Start with mobile layout
- Enhance for larger screens
- Touch-friendly tap targets (44px minimum)

### Content Prioritization
1. Core functionality always visible
2. Progressive disclosure for complex features
3. Responsive typography scales

## Dark Mode (Future)

### Color Adjustments
- Invert light/dark values
- Reduce contrast slightly
- Adjust semantic colors for dark backgrounds

## Do's and Don'ts

### Do's
- ✅ Use consistent spacing
- ✅ Maintain visual hierarchy
- ✅ Test on real devices
- ✅ Consider loading states
- ✅ Provide feedback for actions

### Don'ts
- ❌ Mix different icon sets
- ❌ Use more than 3 font weights
- ❌ Ignore accessibility
- ❌ Create new colors without approval
- ❌ Break the grid system