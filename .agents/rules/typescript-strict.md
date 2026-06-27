# TypeScript Coding Standards

## 1. Type Safety and any Avoidance
- **Ban `any`**: Do not use the `any` type under any circumstances. If a type is genuinely unknown, use `unknown` and implement type guards or type assertions at the boundaries.
- **Strict Conversions**: Avoid unsafe type assertions (`as SomeType`) unless dealing with external libraries that do not export proper types. Instead, write custom type guards using `is` syntax.
- **Strict Null Checks**: Explicitly handle `null` and `undefined`. Do not use non-null assertions (`!`) unless absolutely necessary and documented. Use optional chaining (`?.`) and nullish coalescing (`??`) to handle potentially missing values.

## 2. Component Props and Type Declarations
- **Props Definition**: Mandate a specific `type` or `interface` for all component prop declarations.
  ```typescript
  // Preferred format
  export interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }
  ```
- **Prefer `type` over `interface` for Unions and Intersections**: Use `type` when declaring unions, tuples, or utility types, and `interface` for object structures that may be extended.
- **Exporting Types**: Export component prop types only if they are expected to be used by parent/consuming components.

## 3. Function and Hook Signatures
- **Explicit Return Types**: All custom hooks, utility functions, and API fetching functions must declare their return types explicitly.
  ```typescript
  // Correct
  export const useToggle = (initialValue: boolean): [boolean, () => void] => { ... };

  // Incorrect
  export const useToggle = (initialValue: boolean) => { ... };
  ```
- **Arrow Function Parameter Types**: Define parameter types inline or construct a unified parameter type object for functions that accept more than three arguments.

## 4. Generics and Utility Types
- **Generic Constraints**: Always apply constraints to generic parameters when the type requires specific properties (e.g., `<T extends Identifiable>`).
- **Use TypeScript Utilities**: Utilize built-in utility types like `Pick`, `Omit`, `Partial`, `Readonly`, and `Record` to avoid duplicate type definitions.
