# 🚀 SmartSplit Frontend Integration Tracker

> **Project:** SmartSplit - Expense Splitting Application  
> **Frontend Stack:** React 19, Vite 8, React Router 7, Axios, Tailwind CSS v4, Lucide Icons  
> **Backend Integration:** Spring Boot 3 REST APIs (JWT Auth, PostgreSQL, RabbitMQ, Native CORS)  
> **Current Branch:** `feature/task4-expenses`  
> **Last Updated:** 2026-09-20  

---

## 📊 Overall Progress Summary

| Phase | Description | Total Tasks | Completed | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Phase 1** | Project Setup, Routing & Styling | 3 | 3 | 🟢 Completed |
| **Phase 2** | API Client & Auth Context | 3 | 3 | 🟢 Completed |
| **Phase 3** | Authentication Pages (Signup & Login) | 2 | 2 | 🟢 Completed |
| **Phase 4** | Dashboard & App Layout Shell | 2 | 2 | 🟢 Completed |
| **Phase 5** | Group Management & Members | 4 | 4 | 🟢 Completed |
| **Phase 6** | Expense Management & Split Calculation | 3 | 3 | 🟢 Completed |
| **Phase 7** | Balances & Simplified Settlements | 3 | 0 | 🟡 Next Up |
| **Phase 8** | Notification Center & Activity Feed | 2 | 0 | 🟡 Pending |
| **Phase 9** | End-to-End Verification & Polish | 2 | 0 | 🟡 Pending |
| **Total** | | **24** | **17** | **70.8% Completed** |

---

## 🛠️ Detailed Task Checklist

### Phase 1: Project Setup, Routing & Styling
- [x] **Task 1.1: Install Dependencies**
  - [x] Install `react-router-dom` (client-side routing)
  - [x] Install `axios` (HTTP client with interceptors)
  - [x] Install `lucide-react` (icon set)
  - [x] Setup modern styling with Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)
- [x] **Task 1.2: Backend CORS & API Unification**
  - [x] Enable native CORS support in Spring Boot `SecurityConfig.java` for `http://localhost:5173`
  - [x] Unify `BalanceController` under `@RequestMapping("/api/groups/{groupId}")`
  - [x] Configure frontend `baseURL` directly to `http://localhost:8080`
- [x] **Task 1.3: Environment Configuration**
  - [x] Create `.env` and `.env.example` with `VITE_API_BASE_URL=http://localhost:8080`
  - [x] Update `.gitignore` to safely exclude `.env` files

---

### Phase 2: API Client & Auth Context
- [x] **Task 2.1: Centralized Axios Client (`src/services/api.js`)**
  - [x] Request interceptor to automatically attach `Authorization: Bearer <token>`
  - [x] Response interceptor for global 401 Unauthorized handling (auto-logout / session cleanup)
  - [x] Error parsing helper for friendly error messages from Spring Boot exceptions
  - [x] Auth service (`src/services/authService.js`) handling signup and JSON token responses
  - [x] User service (`src/services/userService.js`) handling `/api/users/me` and `/api/users/by-email`
- [x] **Task 2.2: Authentication Context (`src/context/AuthContext.jsx`)**
  - [x] State: `currentUser`, `token`, `isAuthenticated`, `isLoading`
  - [x] Actions: `login(email, password)`, `register(name, email, password)`, `logout()`
  - [x] Auto-load user profile (`GET /api/users/me`) on app mount if token exists in `localStorage`
- [x] **Task 2.3: Route Guards (`src/components/common/ProtectedRoute.jsx`, `PublicRoute.jsx`)**
  - [x] Protected route wrapper with loading state indicator
  - [x] Public route wrapper (redirects authenticated users away from Login/Register to Dashboard)

---

### Phase 3: Authentication Pages (Signup & Login)
- [x] **Task 3.1: Register Page (`src/pages/Register.jsx`)**
  - [x] Form inputs: `name`, `email`, `password`
  - [x] API integration: `POST /api/auth/signup` via `authService.signup`
  - [x] Validation and friendly error messages
  - [x] Success state banner & auto-redirect to Login
- [x] **Task 3.2: Login Page (`src/pages/Login.jsx`)**
  - [x] Form inputs: `email`, `password`
  - [x] API integration: `POST /api/auth/login` (parse JSON `{ token: "..." }`)
  - [x] Post-login profile retrieval via `GET /api/users/me`
  - [x] Navigation to `/dashboard` (or previous protected route) upon successful login

---

### Phase 4: Dashboard & Layout Shell
- [x] **Task 4.1: App Layout Shell (`src/components/layout/Navbar.jsx`, `AppLayout.jsx`)**
  - [x] Top navbar showing logged-in user profile, avatar, and navigation links
  - [x] Quick logout action button
  - [x] Shared layout container wrapping protected routes
- [x] **Task 4.2: Dashboard Home (`src/pages/Dashboard.jsx`)**
  - [x] Metric cards: Active groups, Total you are owed, Total you owe
  - [x] Dynamic list of user groups fetched via `groupService.getUserGroups()`
  - [x] Empty state illustration and "Create Your First Group" CTA
  - [x] Quick action modal trigger to create new groups

---

### Phase 5: Group Management & Members
- [x] **Task 5.1: Group Service (`src/services/groupService.js`)**
  - [x] `getUserGroups()`: `GET /api/groups`
  - [x] `createGroup(name)`: `POST /api/groups`
  - [x] `getGroupDetails(id)`: `GET /api/groups/{id}`
  - [x] `getGroupMembers(id)`: `GET /api/groups/{id}/members`
  - [x] `addMember(groupId, userId)`: `POST /api/groups/{groupId}/members`
  - [x] `removeMember(groupId, memberId)`: `DELETE /api/groups/{groupId}/members/{memberId}`
  - [x] `leaveGroup(groupId)`: `POST /api/groups/{groupId}/leave`
  - [x] `deleteGroup(groupId)`: `DELETE /api/groups/{groupId}`
- [x] **Task 5.2: Create Group Modal (`src/components/groups/CreateGroupModal.jsx`)**
  - [x] Modal input with 3-50 character validation
  - [x] Submits to `POST /api/groups`, refreshes dashboard, and redirects to new group
- [x] **Task 5.3: Group Details Page (`src/pages/GroupDetails.jsx`)**
  - [x] Header card with group name, admin badge, member count, and created date
  - [x] Tab navigation: **Members**, **Expenses**, **Balances & Settlements**
  - [x] Admin-only group deletion and member leave actions
- [x] **Task 5.4: Members Management Component (`src/components/groups/AddMemberModal.jsx`)**
  - [x] Search user by email via `GET /api/users/by-email?email=...`
  - [x] Add user to group via `POST /api/groups/{groupId}/members`
  - [x] Member list with `ADMIN` and `MEMBER` badges
  - [x] Admin ability to remove members

---

### Phase 6: Expense Management & Split Calculation
- [x] **Task 6.1: Expense Service (`src/services/expenseService.js`)**
  - [x] `getGroupExpenses(groupId)`: `GET /api/groups/{groupId}/expenses`
  - [x] `createExpense(expenseData)`: `POST /api/expenses`
  - [x] `updateExpense(id, expenseData)`: `PUT /api/expenses/{id}`
  - [x] `deleteExpense(id)`: `DELETE /api/expenses/{id}`
- [x] **Task 6.2: Add Expense Modal (`src/components/expense/AddExpenseModal.jsx`)**
  - [x] Form fields: Description, total amount, payer dropdown (`paidByUserId`)
  - [x] Split type selector:
    - [x] `EQUAL`: Auto-calculates equal split among selected members
    - [x] `EXACT`: Custom values per user with total validation (`sum === total`)
    - [x] `PERCENTAGE`: Custom percentage per user with 100% validation (`sum === 100`)
  - [x] Payload construction matching `ExpenseRequest`
- [x] **Task 6.3: Group Expense Feed Component (`src/components/expense/ExpenseList.jsx`)**
  - [x] Chronological expense items with date, payer, amount, and your share
  - [x] Expandable participant split breakdown
  - [x] Delete expense button with confirmation

---

### Phase 7: Balances & Simplified Settlements
- [ ] **Task 7.1: Balance Service (`src/services/balanceService.js`)**
  - [ ] `getGroupBalances(groupId)`: `GET /api/groups/{groupId}/balances`
  - [ ] `getUserBalance(groupId, userId)`: `GET /api/groups/{groupId}/balances/{userId}`
  - [ ] `getGroupSettlements(groupId)`: `GET /api/groups/{groupId}/settlements`
- [ ] **Task 7.2: Group Balances View**
  - [ ] Visual cards showing who is owed money (green) and who owes money (red)
- [ ] **Task 7.3: Simplified Settlements View**
  - [ ] Display Splitwise graph-simplified settlement steps (e.g. *"Alice pays Bob $45.00"*)

---

### Phase 8: Notification Center
- [ ] **Task 8.1: Notification Service (`src/services/notificationService.js`)**
  - [ ] `getUserNotifications(page, size)`: `GET /api/notifications`
  - [ ] `markAsRead(id)`: `PATCH /api/notifications/{id}/read`
  - [ ] `markAllAsRead()`: `PATCH /api/notifications/read-all`
- [ ] **Task 8.2: Notification Dropdown Component**
  - [ ] Bell icon popup with unread badge counter
  - [ ] Display event items (member added, expense logged, debt settled)
  - [ ] Mark single or all notifications as read

---

### Phase 9: End-to-End Verification & Polish
- [ ] **Task 9.1: CORS Validation**
  - [ ] Ensure direct browser calls to `http://localhost:8080/api/*` succeed with CORS headers
- [ ] **Task 9.2: Complete User Journey Test**
  - [ ] User A registers & logs in
  - [ ] User A creates "Trip to Goa" group
  - [ ] User A adds User B by email
  - [ ] User A adds $100 Dinner split EQUAL
  - [ ] Verify User B owes User A $50 in Balances and Settlements
  - [ ] User B logs in and sees notification & owes $50
