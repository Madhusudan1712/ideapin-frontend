# State Management and API Integration Standards

## 1. API Call Abstraction
- **No Direct Component Fetching**: Components must not execute fetch/axios/GraphQL queries directly in `useEffect` or inline handlers.
- **Custom Hooks Layer**: Abstract all API queries and mutations into custom React hooks or data-fetching library wrappers (e.g., TanStack Query, RTK Query, or a dedicated custom hook like `useFetchData`).
  ```typescript
  // Correct: Abstracted hook
  const { data, isLoading, error } = useGetIdeaDetails(ideaId);

  // Incorrect: Direct fetch in component
  useEffect(() => {
    fetch(`/api/ideas/${ideaId}`).then(...)
  }, [ideaId]);
  ```
- **Service Layer Directory**: Place raw API client configuration and direct endpoint calls inside a centralized service directory (e.g., `src/services/api/` or `src/api/`). Keep these functions pure and independent of React state.

## 2. Loading State Management
- **Explicit Flags**: Maintain or derive explicit boolean indicators for loading states (e.g., `isLoading`, `isFetching`, `isSubmitting`).
- **Disable Interactive Elements**: Disable forms, submit buttons, and input fields during write mutations or submissions to prevent duplicate operations.
- **Skeleton Screens**: Prefer using skeleton screens or subtle spinners over full-screen blockades to maintain a responsive, modern UI feel.

## 3. Error Handling for Async Operations
- **Graceful Failure**: Catch all API errors and display user-friendly error messages. Do not let raw stack traces or JSON response dumps leak to the user interface.
- **Try-Catch blocks**: Wrap raw async operations in `try-catch` blocks at the custom hook or service level.
- **Global Error Boundaries**: Implement global React Error Boundaries to catch unhandled errors during rendering and render a fallback recovery UI instead of blanking the screen.
- **Notification Toast**: Use standard toast alerts or form-level error alerts to communicate validation and network errors clearly to the user.

## 4. Client State vs. Server State
- **Server Cache**: Keep server state (fetched data) in a dedicated cache using a data-fetching library (like TanStack Query). Avoid syncing server responses manually into local `useState` unless editing a copy of the data.
- **Local State Scope**: Keep UI state as local as possible. Only elevate state to Context or global state managers (like Zustand or Redux) if multiple disjointed components require access to that state.
