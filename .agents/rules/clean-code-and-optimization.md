# Clean Code and Optimization Standards

## 1. Simplicity & Readability
- **Favor Readability Over Cleverness**: Write code that is easy to understand, review, and maintain. Avoid overly dense one-liners, complex ternary nesting, or implicit type coercions.
- **Nesting Depth Limit**: Enforce a maximum nesting depth of **3 levels** for conditional statements and loops. If code exceeds this depth, extract logic into separate helper functions.
- **Guard Clauses**: Use early returns/guard clauses to handle edge cases, error conditions, and empty states. This flattens component and function structures, improving readability.
  ```typescript
  // Correct
  function processPayment(payment: Payment) {
    if (!payment.isValid) return;
    if (payment.isProcessed) return;

    executeTransaction(payment);
  }

  // Incorrect
  function processPayment(payment: Payment) {
    if (payment.isValid) {
      if (!payment.isProcessed) {
        executeTransaction(payment);
      }
    }
  }
  ```

## 2. DRY and SOLID Principles
- **Single Responsibility Principle (SRP)**: Each function, component, and hook must have exactly one reason to change. Do not bundle UI presentation, complex computations, and network calls in a single component.
- **Extract Shared Logic**: Identify repeatable patterns and extract them into pure utility functions (e.g., inside `src/utils/`) or custom React hooks (`src/hooks/`).
- **Open/Closed Principle**: Design components to be extendable via props (e.g., forwarding props, children, or utilizing slot patterns) rather than hardcoding conditional branches for each new use-case.

## 3. Performance & Re-render Optimization
- **Array Manipulations**: Choose the correct array utility (`map`, `filter`, `reduce`, `some`, `every`, `find`). Do not mutate arrays in-place; return new arrays. Use keys properly in dynamic list rendering (never use the array index as the key if items can change order, be inserted, or deleted).
- **Cleanup Handlers**: Prevent memory leaks by always cleaning up event listeners, timers, intervals, and WebSocket connections in the cleanup function of `useEffect`.
  ```typescript
  useEffect(() => {
    const handleResize = () => { ... };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  ```
- **Inline Object & Function References**: Avoid declaring new object/array literals or inline arrow functions inside TSX elements unless they are lightweight or the component has no children. In critical performance sections or when passing props to memoized components, use `useCallback` or `useMemo` to keep references stable.

## 4. Naming Conventions
- **Intention-Revealing Booleans**: Prefix boolean variables and properties with state-revealing words such as `is`, `has`, `should`, `can`, or `did` (e.g., `isLoading`, `hasError`, `shouldRender`, `canDelete`).
- **Descriptive Event Handlers**:
  - Name functions that handle user interactions with the prefix `handle` followed by the target and action (e.g., `handleUserSubmit`, `handleSearchChange`, `handleModalClose`).
  - Name the props representing these handlers with `on` followed by the action (e.g., `onSubmit`, `onSearchChange`, `onClose`).
- **Descriptive Function Names**: Avoid short, vague abbreviations (e.g., use `fetchUserData` instead of `getData`, use `calculateTotalAmount` instead of `calc`).
