# 🚀 SmartSplit Frontend Integration Tracker

> **Project:** SmartSplit - Expense Splitting Application  
> **Frontend Stack:** React 19, Vite 8, React Router 7, Axios, Tailwind CSS v4, Lucide Icons  
> **Backend Integration:** Spring Boot 3 REST APIs (JWT Auth, PostgreSQL, RabbitMQ, Native CORS)  
> **Current Branch:** `feature/task2-auth-api`  
> **Last Updated:** 2026-09-19  

---

## 📊 Overall Progress Summary

| Phase | Description | Total Tasks | Completed | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Phase 1** | Project Setup, Routing & Styling | 3 | 3 | 🟢 Completed |
| **Phase 2** | API Client & Auth Context | 3 | 3 | 🟢 Completed |
| **Phase 3** | Authentication Pages (Signup & Login) | 2 | 2 | 🟢 Completed |
| **Phase 4** | Dashboard & App Layout Shell | 2 | 0 | 🟡 Next Up |
| **Phase 5** | Group Management & Members | 4 | 0 | 🟡 Pending |
| **Phase 6** | Expense Management & Split Calculation | 3 | 0 | 🟡 Pending |
| **Phase 7** | Balances & Simplified Settlements | 3 | 0 | 🟡 Pending |
| **Phase 8** | Notification Center & Activity Feed | 2 | 0 | 🟡 Pending |
| **Phase 9** | End-to-End Verification & Polish | 2 | 0 | 🟡 Pending |
| **Total** | | **24** | **8** | **33.3% Completed** |

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
  - [x] Auth service (`src/services/authService.js`) handling signup and plain-text JWT token responses
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
  - [x] API integration: `POST /api/auth/login` (parse plain-text JWT token)
  - [x] Post-login profile retrieval via `GET /api/users/me`
  - [x] Navigation to `/dashboard` (or previous protected route) upon successful login

---

### Phase 4: Dashboard & Layout Shell
- [ ] **Task 4.1: App Layout Shell (`src/components/layout/Navbar.jsx`, `Sidebar.jsx`)**
  - [ ] Top navbar showing logged-in user profile & avatar
  - [ ] Notification bell icon with unread count indicator
  - [ ] Logout button with confirmation
- [ ] **Task 4.2: Dashboard Home (`src/pages/Dashboard.jsx`)**
  - [ ] Summary cards: Total amount you are owed (Green) vs. Total amount you owe (Orange/Red)
  - [ ] List of user groups with quick navigation
  - [ ] "Create New Group" quick action modal trigger

---

### Phase 5: Group Management & Members
- [ ] **Task 5.1: Group Service (`src/services/groupService.js`)**
  - [ ] `getUserGroups()`: `GET /api/groups`
  - [ ] `createGroup(name)`: `POST /api/groups`
  - [ ] `getGroupDetails(id)`: `GET /api/groups/{id}`
  - [ ] `getGroupMembers(id)`: `GET /api/groups/{id}/members`
  - [ ] `addMember(groupId, userId)`: `POST /api/groups/{groupId}/members`
  - [ ] `removeMember(groupId, memberId)`: `DELETE /api/groups/{groupId}/members/{memberId}`
  - [ ] `leaveGroup(groupId)`: `POST /api/groups/{groupId}/leave`
  - [ ] `deleteGroup(groupId)`: `DELETE /api/groups/{groupId}`
- [ ] **Task 5.2: Create Group Modal**
  - [ ] Modal input for group name with validation
  - [ ] Submission to `POST /api/groups` and list refresh
- [ ] **Task 5.3: Group Details Page (`src/pages/GroupDetails.jsx`)**
  - [ ] Group header with group name, admin status, and leave/delete controls
  - [ ] Tabs: **Expenses**, **Balances & Settlements**, **Members**
- [ ] **Task 5.4: Members Management Component**
  - [ ] List current members with role badge (`ADMIN` / `MEMBER`)
  - [ ] Search user by email via `GET /api/users/by-email?email=...`
  - [ ] Add user to group via `POST /api/groups/{groupId}/members`
  - [ ] Admin ability to remove members

---

### Phase 6: Expense Management & Split Calculation
- [ ] **Task 6.1: Expense Service (`src/services/expenseService.js`)**
  - [ ] `getGroupExpenses(groupId)`: `GET /api/groups/{groupId}/expenses`
  - [ ] `createExpense(expenseData)`: `POST /api/expenses`
  - [ ] `updateExpense(id, expenseData)`: `PUT /api/expenses/{id}`
  - [ ] `deleteExpense(id)`: `DELETE /api/expenses/{id}`
- [ ] **Task 6.2: Add Expense Modal (`src/components/expense/AddExpenseModal.jsx`)**
  - [ ] Form fields: Description, total amount, payer dropdown (`paidByUserId`)
  - [ ] Split type selector:
    - [ ] `EQUAL`: Auto-calculates equal split among selected members
    - [ ] `EXACT`: Custom values per user with total validation (`sum === total`)
    - [ ] `PERCENTAGE`: Custom percentage per user with 100% validation (`sum === 100`)
  - [ ] Payload construction matching `ExpenseRequest`
- [ ] **Task 6.3: Group Expense Feed Component**
  - [ ] Chronological expense items with date, payer, amount, and your share
  - [ ] Delete/edit expense buttons with confirmation

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
