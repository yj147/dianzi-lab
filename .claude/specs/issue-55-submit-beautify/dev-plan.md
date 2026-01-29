# 点子提交页面美化 - Development Plan

## Overview

Enhance the submit page with pre-render authentication checks, glassmorphism styling matching the login page, and improved user feedback through loading spinners and helper text.

## Task Breakdown

### Task 1: Remove /submit from Middleware Protection

- **ID**: task-1
- **type**: default
- **Description**: Remove `/submit` from the middleware's protected routes array to allow unauthenticated users to reach the page. Authentication will be handled at the page component level instead, enabling a better user experience with an inline login prompt.
- **File Scope**: middleware.ts (line 59), **tests**/middleware/middleware.test.ts
- **Dependencies**: None
- **Test Command**: npm test -- **tests**/middleware/middleware.test.ts --coverage --coveragePathIgnorePatterns=[]
- **Test Focus**:
  - Verify `/submit` is accessible without authentication
  - Ensure other protected routes remain protected
  - Test middleware redirect logic for authenticated/unauthenticated states

### Task 2: SubmitPage Pre-render Auth Check and Login Prompt

- **ID**: task-2
- **type**: default
- **Description**: Convert SubmitPage to an async Server Component that checks session using `getSession()` from `lib/auth.ts`. For unauthenticated users, render a glassmorphism card with login prompt and link to `/login?redirect=/submit`. For authenticated users, render the existing SubmitForm component.
- **File Scope**: app/(main)/submit/page.tsx
- **Dependencies**: depends on task-1
- **Test Command**: npm test -- **tests**/app/submit.test.tsx --coverage --coveragePathIgnorePatterns=[]
- **Test Focus**:
  - Mock `getSession()` to return null → verify login prompt is shown
  - Mock `getSession()` to return valid session → verify SubmitForm is rendered
  - Verify login prompt includes correct redirect parameter
  - Test accessibility of login prompt card

### Task 3: SubmitForm UI Enhancement with Glassmorphism

- **ID**: task-3
- **type**: ui
- **Description**: Enhance SubmitForm styling to match login page glassmorphism design. Apply `bg-white/20 backdrop-blur-xl ring-1 ring-white/30 shadow-2xl` to form card. Add Loader2 spinner to submit button with `aria-busy` state. Add helper text below title field ("简洁明了的标题"), description field ("详细描述你的想法"), and tags field ("用逗号分隔多个标签").
- **File Scope**: app/(main)/submit/SubmitForm.tsx
- **Dependencies**: None (can run in parallel with task-1)
- **Test Command**: npm test -- **tests**/app/submit.test.tsx --coverage --coveragePathIgnorePatterns=[]
- **Test Focus**:
  - Verify glassmorphism classes are applied to form container
  - Test submit button shows Loader2 spinner during submission
  - Verify `aria-busy` attribute toggles correctly on button
  - Confirm helper text is rendered below each form field
  - Test form submission still works with new UI

### Task 4: Update Tests for New Auth Flow

- **ID**: task-4
- **type**: default
- **Description**: Update test suite to cover the new authentication flow. Mock `getSession` in submit page tests to cover both authenticated and unauthenticated scenarios. Update middleware tests to verify `/submit` is no longer protected. Ensure overall test coverage meets ≥90% threshold.
- **File Scope**: **tests**/app/submit.test.tsx, **tests**/middleware/middleware.test.ts
- **Dependencies**: depends on task-1, task-2, task-3
- **Test Command**: npm run test:coverage
- **Test Focus**:
  - Unauthenticated user sees login prompt with correct redirect link
  - Authenticated user sees submit form
  - Form validation still works after UI changes
  - Loading states (spinner, aria-busy) are properly tested
  - Helper text accessibility
  - Verify overall coverage ≥90%

## Acceptance Criteria

- [ ] Unauthenticated users can access `/submit` and see a login prompt card
- [ ] Login prompt includes redirect parameter to return to submit page after login
- [ ] Authenticated users see the enhanced SubmitForm with glassmorphism styling
- [ ] Submit button displays Loader2 spinner during submission with proper `aria-busy` state
- [ ] Helper text is displayed below title, description, and tags fields
- [ ] All unit tests pass
- [ ] Code coverage ≥90%

## Technical Notes

- **Auth Pattern**: Follow the pattern used in `app/(main)/dashboard/page.tsx` for server-side session checking
- **Styling Reference**: Match glassmorphism design from `app/(main)/login/LoginForm.tsx` (bg-white/20, backdrop-blur-xl, ring-1 ring-white/30, shadow-2xl)
- **Loading Spinner**: Import Loader2 from lucide-react, add `animate-spin` class
- **Test Pattern**: Reference `__tests__/app/dashboard.test.tsx` for auth mocking patterns
- **Redirect Flow**: Use `/login?redirect=/submit` pattern to maintain user intent after authentication
- **Accessibility**: Ensure `aria-busy` on submit button, `aria-describedby` on form fields linking to helper text
- **Migration Strategy**: Task 1 must complete before Task 2 to avoid race conditions in auth handling
