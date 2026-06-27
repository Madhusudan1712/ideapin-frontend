# UI, Styling, and Accessibility Standards

## 1. Styling Technologies and Conventions
- **Material-UI (MUI)**: For standard UI widgets and layouts, use Material-UI (`@mui/material`) components.
- **Emotion Styled Components**: For custom component logic, wrap components using Emotion's `styled` utility:
  ```tsx
  import { styled } from '@mui/material/styles';

  const CustomBox = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: 'var(--bg)',
  }));
  ```
- **The `sx` Prop**: Use the MUI `sx` prop for one-off layouts, spacing adjustments, and micro-styling. Do not over-use it for large, complex structures; extract to styled components instead.
- **CSS Variables**: Leverage CSS custom properties (e.g., `var(--bg)`, `var(--text)`, `var(--accent)`) defined in `index.css` to keep styling aligned with the global theme palette.
- **SASS (.scss)**: For global layouts, utilities, or complex animations, write clean SASS stylesheets. Organize them in `src/style/` and import them modularly or globally.

## 2. Responsive Design Practices
- **Mobile-First Layouts**: Design for mobile viewports first, then scale up for larger viewports.
- **MUI Grid and Breakpoints**: Use MUI's `<Grid>` or Box components with responsive arrays or objects (e.g., `sx={{ width: { xs: '100%', md: '50%' } }}`).
- **CSS Media Queries**: When using custom CSS/SASS, define media queries matching MUI breakpoint standards:
  - `xs`: 0px
  - `sm`: 600px
  - `md`: 900px
  - `lg`: 1200px
  - `xl`: 1536px
- **Flexible Units**: Use relative values (`rem`, `em`, `%`, `vh`, `vw`) rather than fixed pixel dimensions for layouts, padding, and text scaling.

## 3. Accessibility (a11y) Standards
- **Semantic HTML**: Use semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`) instead of nested `<div>`s where possible.
- **ARIA Attributes**: Add `aria-label`, `aria-describedby`, or `aria-live` tags to interactive components or custom icons that lack explicit text labels.
- **Keyboard Navigation**:
  - Ensure all interactive elements (buttons, links, form fields) are reachable via `Tab`.
  - Maintain a visible `:focus` or `:focus-visible` ring around elements when focused.
  - Implement key press listeners (e.g., `Enter` and `Space` for buttons, `Escape` to close modals) for custom interactive elements.
- **Alt Tags**: Always include descriptive `alt` attributes on all images. For decorative elements, use `alt=""`.
- **Form Labels**: Pair all `<input>` elements with a corresponding `<label>` (using `htmlFor`) or use the appropriate MUI Label components (`InputLabel`).
