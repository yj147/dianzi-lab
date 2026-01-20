# User Registration Page - Development Plan

## Overview
Implement a full-stack user registration feature with email/password authentication, form validation, and bcrypt password hashing.

## Task Breakdown

### Task 1: Install Dependencies
- **ID**: task-1
- **type**: quick-fix
- **Description**: Install required npm packages: react-hook-form, zod, @hookform/resolvers
- **File Scope**: package.json, package-lock.json
- **Dependencies**: None
- **Test Command**: npm install && npm run build
- **Test Focus**: Verify dependencies are correctly installed and project builds without errors

### Task 2: Setup Database Client and User Repository
- **ID**: task-2
- **type**: default
- **Description**: Create Prisma client singleton (lib/db.ts) and user write function with email normalization in lib/users.ts
- **File Scope**: lib/db.ts, lib/users.ts
- **Dependencies**: None
- **Test Command**: npm run build && npm test -- lib/users.test.ts --coverage --coveragePathPatterns=lib/users.ts
- **Test Focus**: Test email normalization (trim + toLowerCase), Prisma client initialization, user creation function with mocked Prisma client

### Task 3: Implement Registration Server Action
- **ID**: task-3
- **type**: default
- **Description**: Create registerUser Server Action with Zod schema validation, bcrypt hashing (cost=10), and unique email conflict handling (P2002)
- **File Scope**: app/register/actions.ts
- **Dependencies**: depends on task-1, depends on task-2
- **Test Command**: npm run build && npm test -- app/register/actions.test.ts --coverage --coveragePathPatterns=app/register/actions.ts
- **Test Focus**: Test Zod schema validation (email format, password min 6 chars, confirmPassword match), bcrypt hashing with correct cost factor, P2002 unique constraint error handling, timing attack mitigation

### Task 4: Create Registration UI
- **ID**: task-4
- **type**: ui
- **Description**: Build /register page with glassmorphism card design, responsive layout, react-hook-form integration, onBlur validation, and loading states
- **File Scope**: app/register/page.tsx, app/register/RegisterForm.tsx
- **Dependencies**: depends on task-1, depends on task-3
- **Test Command**: npm run build && npm run lint && npm test -- app/register/RegisterForm.test.tsx --coverage
- **Test Focus**: Test form validation feedback, loading state during submission, error message display for unique email violations, successful redirect to /login

### Task 5: Create Login Page Placeholder
- **ID**: task-5
- **type**: quick-fix
- **Description**: Create placeholder /login page for post-registration redirect target
- **File Scope**: app/login/page.tsx
- **Dependencies**: None
- **Test Command**: npm run build
- **Test Focus**: Verify page renders without errors and route is accessible

## Acceptance Criteria
- [ ] /register page accessible and functional
- [ ] Form fields implemented: email, password, confirmPassword
- [ ] Email format validation (frontend + backend via Zod)
- [ ] Password minimum 6 characters validation
- [ ] ConfirmPassword match validation
- [ ] Email uniqueness validation with user-friendly error message
- [ ] Successful registration redirects to /login
- [ ] Passwords stored as bcrypt hashes with cost factor 10
- [ ] All unit tests pass
- [ ] Code coverage ≥90%

## Technical Notes
- Use Server Actions instead of API routes for registration logic
- Zod schema shared between client and server for consistent validation
- Email normalization: trim() + toLowerCase() before database write
- No pre-check for email uniqueness - rely on Prisma unique constraint (P2002 error)
- Timing attack mitigation: always execute bcrypt.hash regardless of validation outcome
- Prisma client singleton pattern to avoid connection pool exhaustion
- Glassmorphism UI design with responsive layout (mobile-first)
