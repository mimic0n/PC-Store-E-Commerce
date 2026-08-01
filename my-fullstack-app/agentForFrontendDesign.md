# Admin Frontend Design System

This document outlines the design system, stylesheet, and overall style for the E-Commerce Admin Dashboard.

## 1. Overall Theme and Style

- **Theme**: Modern, clean, and professional.
- **UI**: Minimalist with a focus on data visualization and ease of use.
- **Consistency**: All components and pages should adhere to these guidelines to ensure a consistent user experience.

## 2. Color Palette

- **Primary**: `#4F46E5` (Indigo) - Used for primary buttons, links, and active states.
- **Secondary**: `#6B7280` (Gray) - Used for secondary text and less important elements.
- **Accent**: `#10B981` (Green) - Used for highlights, success messages, and call-to-action elements.
- **Background**: `#F9FAFB` (Light Gray) - Main background color for the content area.
- **Surface**: `#FFFFFF` (White) - Background for cards, modals, and sidebars.
- **Text Primary**: `#111827` (Dark Gray)
- **Text Secondary**: `#6B7280` (Gray)
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)

## 3. Typography

- **Font Family**: 'Inter', sans-serif. Use a web font provider like Google Fonts to import it.
- **Headings**:
  - `h1`: 30px, Bold (700)
  - `h2`: 24px, Bold (700)
  - `h3`: 20px, Semi-Bold (600)
  - `h4`: 16px, Semi-Bold (600)
- **Body Text**: 14px, Regular (400)
- **Labels & Inputs**: 14px, Medium (500)
- **Buttons**: 14px, Medium (500)

## 4. Layout

- **Main Layout**: A fixed sidebar on the left and a main content area on the right with a header.
- **Spacing**: Use a base unit of 8px for margins, paddings, and gaps. (e.g., 8px, 16px, 24px, 32px).
- **Grid System**: Use CSS Flexbox or Grid for layout structures.

## 5. Component Styles

### Buttons

- **Primary Button**:
  - Background: `Primary (#4F46E5)`
  - Text: `White (#FFFFFF)`
  - Hover: Darker shade of primary (`#4338CA`)
  - Padding: `12px 24px`
  - Border-radius: `8px`
- **Secondary Button**:
  - Background: `White (#FFFFFF)`
  - Text: `Text Primary (#111827)`
  - Border: `1px solid #D1D5DB` (Light Gray)
  - Hover: `Background (#F9FAFB)`
  - Padding: `12px 24px`
  - Border-radius: `8px`

### Forms

- **Inputs**:
  - Padding: `10px 12px`
  - Border: `1px solid #D1D5DB`
  - Border-radius: `6px`
  - Focus: Border color `Primary (#4F46E5)` with a subtle box-shadow.
- **Labels**:
  - Font size: `14px`
  - Font weight: `Medium (500)`
  - Color: `Text Primary (#111827)`

### Tables

- **Header**:
  - Background: `Background (#F9FAFB)`
  - Text: `Text Secondary (#6B7280)`, Uppercase
  - Font weight: `Semi-Bold (600)`
- **Rows**:
  - Border-bottom: `1px solid #E5E7EB`
  - Hover: `Background (#F9FAFB)`

### Cards

- Background: `Surface (#FFFFFF)`
- Border-radius: `12px`
- Box-shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- Padding: `24px`

## 6. Stylesheet Structure

- **Global Styles**: Use `src/index.css` for base styles, typography, and CSS variables.
- **Component Styles**: Use CSS modules (`*.module.css`) for component-specific styles to avoid class name collisions.
- **CSS Variables**: Define the color palette and spacing units as CSS variables in `src/index.css` for easy theming and maintenance.

Example `index.css` with CSS Variables:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

:root {
  --primary-color: #4f46e5;
  --secondary-color: #6b7280;
  --accent-color: #10b981;
  --background-color: #f9fafb;
  --surface-color: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;

  --spacing-unit: 8px;
}

body {
  font-family: "Inter", sans-serif;
  background-color: var(--background-color);
  color: var(--text-primary);
}
```
