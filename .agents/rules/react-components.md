# React Component and Hooks Coding Standards

## 1. Component Structure and Declaration
- **Use Arrow Functions**: Always declare functional components using arrow functions (`const ComponentName: React.FC<Props> = (...) => { ... }` or `const ComponentName = ({ ... }: Props) => { ... }`).
- **Single Component Per File**: Limit files to one primary component export. Small helper components that are not reused outside the file may be defined in the same file at the bottom.
- **Component File Naming**: Use PascalCase for component files (e.g., `Button.tsx`, `UserProfileCard.tsx`).
- **Placement**: Put component-specific styles and test files in the same directory or alongside the component.

## 2. Props Management
- **Destructure Props**: Always destructure props in the component function signature.
  ```tsx
  // Correct
  export const UserCard = ({ name, email, isActive }: UserCardProps) => { ... };

  // Incorrect
  export const UserCard = (props: UserCardProps) => { ... props.name ... };
  ```
- **Provide Default Values**: Define default values for optional props during destructuring.
- **Prop Types**: Use a TypeScript `type` or `interface` defined directly above the component or imported from a shared types file.

## 3. Control Flow & Logic
- **Prefer Early Returns**: Avoid deep nesting inside components by using early returns (guard clauses) for loading, error, or empty states.
  ```tsx
  // Correct
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data) return <EmptyState />;

  return (
    <div>{/* Main content */}</div>
  );
  ```

## 4. Hooks Rules and Dependency Arrays
- **Strict Dependency Arrays**: Never omit dependencies in `useEffect`, `useMemo`, or `useCallback` hooks. If a dependency triggers unwanted executions, refactor the function, extract it, or use a state update updater callback instead of disabling the linter.
- **Custom Hooks for Logic**: Extract complex stateful logic, side effects, or API integrations from components into custom hooks (e.g., `useFetchUser`, `useFormState`).
- **Hook Placement**: Always declare hooks at the very top of the component function, before any conditional blocks, loops, or nested functions.

## 5. Performance and Memoization
- **Strategic Memoization**:
  - Do not memoize everything by default. Memoization has overhead.
  - Use `useCallback` when passing callbacks to child components that are wrapped in `React.memo` or when the callback is a dependency in another hook.
  - Use `useMemo` for expensive computational operations (e.g., filtering/sorting large arrays) or to maintain stable object reference dependencies for other hooks.
- **Stable Object References**: Keep constants, static configuration objects, and non-reactive functions outside the component declaration so they do not recreate on every render.
