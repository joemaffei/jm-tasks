---
id: task-23
title: Implement Minimal Authentication (Phase 1)
status: To Do
assignee: []
created_date: '2026-01-13'
labels:
  - authentication
  - security
  - phase-1
dependencies:
  - task-22
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement minimal authentication system for Phase 1 single-user setup. This provides basic security and prepares the foundation for Phase 2 multi-user authentication. Keep it simple but secure for personal use.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [ ] Authentication service created
- [ ] Login functionality implemented
- [ ] Session/token management working
- [ ] Secure token storage implemented
- [ ] Protected routes configured (if needed)
- [ ] Logout functionality implemented
- [ ] Token refresh handling (if applicable)
- [ ] Authentication state management in Vue
- [ ] Error handling for auth failures
- [ ] Basic authentication tests

## Technical Implementation

**Create Authentication Service:**

1. Create `src/services/authService.ts`:
   - `login(credentials)` - Authenticate user
   - `logout()` - Clear session and tokens
   - `isAuthenticated()` - Check auth status
   - `getToken()` - Retrieve auth token
   - `refreshToken()` - Refresh expired token (if needed)
   - Handle token storage securely

2. Token Storage:
   - Use secure storage mechanism
   - Options: httpOnly cookies (preferred) or secure localStorage
   - Implement token expiration handling
   - Clear tokens on logout

**Authentication Flow:**

1. Login Component:
   - Create `src/components/Login.vue` or similar
   - Simple login form (username/password for Phase 1)
   - Submit credentials to auth service
   - Handle login success/failure
   - Redirect to home after successful login

2. Authentication State:
   - Create composable `src/composables/useAuth.ts` (optional)
   - Manage authentication state reactively
   - Provide auth state to components
   - Handle authentication changes

**Route Protection (if needed):**

1. Update `src/router/index.ts`:
   - Add route guards for protected routes
   - Redirect to login if not authenticated
   - Store intended route for post-login redirect

2. Protected Routes:
   - HomeView and other task management routes
   - Login route should be public

**Backend Integration (if needed):**

- If authentication requires backend:
  - Set up Cloudflare Workers auth endpoint
  - Implement token generation/validation
  - Store user session data (if needed)
- For Phase 1, may use simple client-side auth initially

**Security Considerations:**

- All communication over HTTPS (enforced by Cloudflare)
- Secure token storage (httpOnly cookies preferred)
- Input validation and sanitization
- Protection against XSS attacks
- CSRF protection (if using cookies)
- Token expiration and refresh

**UI Integration:**

1. Login View:
   - Create login page/component
   - Simple, clean UI with Tailwind CSS
   - Error messages for failed login
   - Loading states during authentication

2. Navigation:
   - Show logout button when authenticated
   - Hide login button when authenticated
   - Show user info (optional for Phase 1)

## Dependencies

- Task 22 (Dexie Cloud Sync - may need auth for sync)
- Task 7 (Vue Router - for route protection)
- Task 10 (Tailwind CSS - for styling)
- Node.js 22 LTS
- npm 10+

## Deliverables

1. Authentication service created
2. Login functionality implemented
3. Logout functionality implemented
4. Session/token management working
5. Route protection configured (if needed)
6. Secure token storage implemented
7. Authentication tests
8. Login UI component

## Testing

- Test successful login flow
- Test failed login (invalid credentials)
- Test logout functionality
- Test token storage and retrieval
- Test route protection (redirect to login when not authenticated)
- Test token expiration handling
- Test authentication state persistence
- Test error handling for auth failures
- Test security (token not exposed, secure storage)

## Notes

- Keep it simple for Phase 1 - single user (Joe Maffei)
- Can use simple password or token-based auth initially
- Design with Phase 2 (OAuth) in mind for future migration
- Focus on security basics (HTTPS, secure storage)
- May integrate with Dexie Cloud authentication if it provides auth
- Consider using environment variables for any auth configuration
- Document authentication flow for future reference

**Estimated Effort:** 3-4 hours
**Priority:** Medium (important for security but can work without initially)
**Labels:** authentication, security, phase-1
