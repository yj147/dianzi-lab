# Admin Layout & Navigation Optimization - Development Plan

## Overview

Optimize the admin dashboard layout by adding a desktop header with breadcrumb navigation and enhancing the sidebar with branding elements, while maintaining responsive design across breakpoints.

## Task Breakdown

### Task 1: Desktop Header Implementation

- **ID**: task-1
- **type**: ui
- **Description**: Create a desktop-only header component for the admin layout featuring a breadcrumb navigation that displays the current page name in Chinese, admin email display, and a logout button with proper focus states. The header should use glass morphism effect (bg-white/80 backdrop-blur-md) and support dark mode.
- **File Scope**:
  - `app/admin/_components/AdminHeader.tsx` (create or modify)
  - `app/admin/layout.tsx` (integration)
- **Dependencies**: None
- **Test Command**:
  ```bash
  npm run test -- __tests__/app/admin/layout.test.tsx --coverage --collectCoverageFrom='app/admin/_components/AdminHeader.tsx'
  ```
- **Test Focus**:
  - Header visibility on desktop (hidden on mobile, visible on md+)
  - Breadcrumb displays correct Chinese labels for routes: /admin → "仪表板", /admin/ideas → "点子管理", /admin/users → "用户管理", /admin/trash → "垃圾箱"
  - Admin email is rendered correctly
  - Logout button has aria-label and proper focus:ring styles
  - Dark mode classes are applied correctly

### Task 2: Sidebar Bottom Enhancement

- **ID**: task-2
- **type**: ui
- **Description**: Enhance the admin sidebar by adding a "© 2026 点子 Lab" copyright notice at the bottom, hiding the account/logout section on desktop (md:hidden - since desktop header handles this), and adding focus:ring-2 focus:ring-blue-500 to the logout button for improved accessibility.
- **File Scope**:
  - `app/admin/_components/AdminSidebar.tsx`
- **Dependencies**: None
- **Test Command**:
  ```bash
  npm run test -- __tests__/app/admin/layout.test.tsx --coverage --collectCoverageFrom='app/admin/_components/AdminSidebar.tsx'
  ```
- **Test Focus**:
  - Copyright text "© 2026 点子 Lab" is rendered in the sidebar
  - Account/logout section has md:hidden class applied
  - Logout button has focus:ring-2 focus:ring-blue-500 styles
  - Sidebar structure remains intact on mobile viewports
  - Dark mode styles are applied to copyright text

### Task 3: Unit Tests Update

- **ID**: task-3
- **type**: default
- **Description**: Update the admin layout test suite to validate the new desktop header and sidebar enhancements. Use semantic queries (getByRole, getByLabelText, getByText) to ensure accessibility compliance. Tests should cover both mobile and desktop breakpoints.
- **File Scope**:
  - `__tests__/app/admin/layout.test.tsx`
- **Dependencies**: depends on task-1, task-2
- **Test Command**:
  ```bash
  npm run test -- __tests__/app/admin/layout.test.tsx --coverage --collectCoverageFrom='app/admin/**/*.tsx'
  npm run lint
  ```
- **Test Focus**:
  - Desktop header renders with breadcrumb, email, and logout button
  - Breadcrumb shows correct Chinese page names for all admin routes
  - Sidebar copyright is present and correctly styled
  - Account/logout section visibility changes across breakpoints (visible on mobile, hidden on desktop)
  - All interactive elements have proper aria-labels
  - Focus states are testable via keyboard navigation simulation
  - Dark mode variants are applied correctly

## Acceptance Criteria

- [ ] Desktop header displays at md+ breakpoint with glass morphism effect (bg-white/80 backdrop-blur-md)
- [ ] Breadcrumb navigation shows Chinese page names for all admin routes
- [ ] Admin email is visible in desktop header
- [ ] Logout button in header has focus:ring-2 focus:ring-blue-500
- [ ] Sidebar displays "© 2026 点子 Lab" copyright at bottom
- [ ] Sidebar account/logout section is hidden on desktop (md:hidden)
- [ ] Dark mode support is complete for all new UI elements
- [ ] All unit tests pass with semantic queries (aria-labels, roles)
- [ ] Code coverage ≥90%
- [ ] npm run lint passes without errors
- [ ] npm run build completes successfully

## Technical Notes

- **Responsive Design**: Use Tailwind's `hidden md:flex` pattern to toggle header visibility; use `md:hidden` to hide mobile-specific sidebar sections on desktop
- **Breadcrumb Mapping**: Implement a simple pathname-to-label mapping object for Chinese route names; avoid over-engineering with complex routing libraries
- **Reuse Existing Patterns**:
  - Use `logout()` from `lib/auth-actions.ts` for logout functionality
  - Follow existing glass morphism pattern: `bg-white/80 backdrop-blur-md border-b`
  - Maintain consistent dark mode classes: `dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700`
- **Accessibility**: All interactive elements must have aria-labels; focus states must be visible with `focus:ring-2 focus:ring-blue-500`
- **Testing Strategy**: Use `@testing-library/react` with semantic queries; avoid using CSS selectors or testids where semantic queries are available
- **Build Validation**: Ensure TypeScript compilation and Next.js build succeed after all changes
