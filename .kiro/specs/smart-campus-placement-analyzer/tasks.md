# Implementation Tasks: Smart Campus Placement & Skill Gap Analyzer

## FRONTEND DEVELOPMENT (Weeks 1-8)

### Phase FE1: Foundation & Setup (Week 1)

- [x] FE1.1 Initialize React project with `npm create vite@latest -- --template react-ts`
- [x] FE1.2 Install core dependencies: React Router v6, Redux Toolkit, axios, TypeScript
- [x] FE1.3 Install UI framework: Tailwind CSS or Material-UI v5
- [x] FE1.4 Install form handling: React Hook Form, zod for validation
- [x] FE1.5 Install utilities: lodash, date-fns, uuid
- [x] FE1.6 Create folder structure: src/components, src/pages, src/services, src/hooks, src/store, src/types, src/utils
- [x] FE1.7 Configure Vite config (vite.config.ts) with aliases and optimization
- [x] FE1.8 Set up Redux store with slices (auth, profile, opportunities, notifications)
- [x] FE1.9 Create axios instance with interceptor setup for auth headers
- [x] FE1.10 Initialize .gitignore and version control

### Phase FE2: Authentication UI (Week 1)

- [x] FE2.1 Create `src/types/auth.ts` with TypeScript interfaces (User, LoginRequest, AuthResponse)
- [x] FE2.2 Create Redux slice: `src/store/authSlice.ts` with actions (login, register, logout, setUser)
- [x] FE2.3 Create auth service `src/services/authService.ts` with placeholder API calls
- [x] FE2.4 Create `src/components/LoginForm.tsx` with React Hook Form and zod validation
- [x] FE2.5 Implement email/password validation in LoginForm with error display
- [x] FE2.6 Create `src/components/RegisterForm.tsx` with role selection (student/recruiter/admin)
- [x] FE2.7 Implement form validation for RegisterForm (email, password, role required)
- [x] FE2.8 Create `src/hooks/useAuth.ts` custom hook for auth state access
- [x] FE2.9 Create `src/components/ProtectedRoute.tsx` wrapper for role-based route protection
- [x] FE2.10 Create Auth context provider `src/context/AuthContext.tsx` for session management
- [x] FE2.11 Create error boundary and error display component for auth failures
- [x] FE2.12 Write unit tests for LoginForm and RegisterForm using React Testing Library

### Phase FE3: Layout & Navigation (Week 1-2)

- [x] FE3.1 Create `src/components/Header.tsx` with user profile menu and logout
- [x] FE3.2 Create `src/components/Navigation.tsx` with role-based menu items (React Router Links)
- [x] FE3.3 Create `src/components/Layout.tsx` wrapper component with Header + Navigation + Outlet
- [x] FE3.4 Create `src/components/Sidebar.tsx` for desktop navigation drawer
- [x] FE3.5 Create `src/components/MobileNav.tsx` with hamburger menu and drawer
- [x] FE3.6 Create `src/components/Footer.tsx` with links and copyright
- [x] FE3.7 Create Tailwind responsive grid classes in `src/styles/globals.css`
- [x] FE3.8 Set up React Router in `src/App.tsx` with nested routes for all portals
- [x] FE3.9 Create route definitions for Student, Recruiter, and Admin pages
- [x] FE3.10 Implement responsive toggle between desktop nav and mobile hamburger menu
- [x] FE3.11 Create `src/pages/NotFound.tsx` 404 page
- [x] FE3.12 Test navigation flow and route switching

### Phase FE4: Shared Components Library (Week 2)

- [x] FE4.1 Create `src/components/ui/Button.tsx` with variants (primary, secondary, danger, disabled)
- [x] FE4.2 Create `src/components/ui/TextInput.tsx` with label, error, and validation support
- [x] FE4.3 Create `src/components/ui/Modal.tsx` with header, body, footer and customizable content
- [x] FE4.4 Create `src/components/ui/Toast.tsx` notification component with auto-dismiss
- [x] FE4.5 Create `src/components/ui/Spinner.tsx` loading indicator component
- [x] FE4.6 Create `src/components/ui/Card.tsx` reusable card container with shadow and padding
- [x] FE4.7 Create `src/components/ui/Badge.tsx` and `Tag.tsx` components
- [x] FE4.8 Create `src/components/ui/FormField.tsx` wrapper with label, error, and help text
- [x] FE4.9 Create `src/components/ErrorBoundary.tsx` class component for error handling
- [x] FE4.10 Create `src/components/ui/SkeletonLoader.tsx` for loading states
- [x] FE4.11 Create `src/hooks/useToast.ts` custom hook for toast notifications
- [x] FE4.12 Create Storybook stories for component documentation
- [x] FE4.13 Write unit tests for all UI components

### Phase FE5: Student Profile Page (Week 2-3)

- [x] FE5.1 Create `src/types/profile.ts` with StudentProfile TypeScript interface
- [x] FE5.2 Create Redux slice: `src/store/profileSlice.ts` with actions (setProfile, updateProfile, setDocuments)
- [x] FE5.3 Create profile service `src/services/profileService.ts` with placeholder API calls
- [x] FE5.4 Create `src/pages/StudentProfile/StudentProfilePage.tsx` main page layout
- [x] FE5.5 Create `src/components/StudentProfileForm.tsx` with React Hook Form for all profile fields
- [x] FE5.6 Implement form validation for required fields (email, name, education, CGPA) - Requirement 1.4
- [x] FE5.7 Create `src/components/FileUploader.tsx` component for document uploads
- [x] FE5.8 Create `src/components/DocumentList.tsx` to display uploaded documents with delete/replace
- [x] FE5.9 Create `src/components/StudentProfileView.tsx` for read-only profile display
- [x] FE5.10 Implement edit/view mode toggle using useState
- [x] FE5.11 Create form submission handler with success/error toast notifications
- [x] FE5.12 Implement form state management with Redux
- [x] FE5.13 Create hooks: `useProfile()`, `useDocuments()` for profile operations
- [x] FE5.14 Write Property-Based Tests for Properties 1-3 (Profile round-trip, validation, file upload)

### Phase FE6: Assessment UI (Week 3)

- [x] FE6.1 Create `src/types/assessment.ts` with Assessment, Question, AssessmentSession interfaces
- [x] FE6.2 Create Redux slice: `src/store/assessmentSlice.ts` with assessment state management
- [x] FE6.3 Create assessment service `src/services/assessmentService.ts` with placeholder API calls
- [x] FE6.4 Create `src/pages/Assessment/AssessmentListPage.tsx` showing available assessments
- [x] FE6.5 Create `src/components/AssessmentCard.tsx` displaying assessment title, duration, difficulty
- [x] FE6.6 Create `src/components/AssessmentStartModal.tsx` with start confirmation
- [x] FE6.7 Create `src/components/AssessmentViewer.tsx` for displaying questions one at a time
- [x] FE6.8 Create `src/components/AssessmentTimer.tsx` countdown timer component with warning
- [x] FE6.9 Create `src/components/QuestionRenderer.tsx` rendering MCQ/essay/coding questions
- [x] FE6.10 Create `src/components/AssessmentNavigation.tsx` with previous/next/pause buttons
- [x] FE6.11 Implement localStorage-based auto-save for incomplete assessments
- [x] FE6.12 Create `src/pages/Assessment/AssessmentResultsPage.tsx` with score and breakdown
- [x] FE6.13 Implement resume incomplete assessment functionality
- [x] FE6.14 Write Property-Based Tests for Properties 4-6 (Assessment scoring, resume, results)

### Phase FE7: Skill Gap Visualization (Week 3-4)

- [x] FE7.1 Create `src/types/skillGap.ts` with SkillGapAnalysis and Recommendation interfaces
- [x] FE7.2 Create skill gap service `src/services/skillGapService.ts` with placeholder calculations
- [x] FE7.3 Create `src/pages/SkillGap/SkillGapPage.tsx` main page layout
- [x] FE7.4 Install Chart.js and react-chartjs-2 libraries
- [x] FE7.5 Create `src/components/SkillComparison.tsx` radar chart (current vs required skills)
- [x] FE7.6 Create `src/components/SkillProficiencyChart.tsx` bar chart for each skill
- [x] FE7.7 Create `src/components/SkillGapRecommendations.tsx` list of recommendations
- [x] FE7.8 Create `src/components/LearningResources.tsx` with resource links for each gap
- [x] FE7.9 Create `src/components/SkillPriorityIndicator.tsx` showing high/medium/low priorities
- [x] FE7.10 Implement filter by skill category using useState
- [x] FE7.11 Create data aggregation logic for multiple assessments
- [x] FE7.12 Write Property-Based Tests for Property 7 (Skill gap aggregation)

### Phase FE8: Opportunity Discovery (Week 4)

- [x] FE8.1 Create `src/types/opportunity.ts` with JobOpportunity and Application interfaces
- [x] FE8.2 Create Redux slice: `src/store/opportunitySlice.ts` for opportunities state
- [x] FE8.3 Create opportunity service `src/services/opportunityService.ts` with placeholder API calls
- [x] FE8.4 Create `src/pages/Opportunities/OpportunitiesPage.tsx` main page layout
- [x] FE8.5 Create `src/components/OpportunityCard.tsx` displaying job title, company, skills, deadline
- [x] FE8.6 Create `src/components/FilterPanel.tsx` with location, company, role type checkboxes
- [x] FE8.7 Implement real-time filter logic with debouncing (lodash.debounce)
- [x] FE8.8 Create `src/components/OpportunityListing.tsx` with grid/list view toggle
- [x] FE8.9 Create `src/pages/Opportunities/OpportunityDetailsPage.tsx` with full job info
- [x] FE8.10 Create `src/components/ApplyModal.tsx` with confirmation before application
- [x] FE8.11 Implement duplicate application prevention with error message
- [x] FE8.12 Create "no results" state with helpful suggestions
- [x] FE8.13 Implement loading states with SkeletonLoader
- [x] FE8.14 Write Property-Based Tests for Properties 8-10 (Filter combo, duplicate prevention, details)

### Phase FE9: Student Application History (Week 4)

- [x] FE9.1 Create `src/pages/Applications/ApplicationHistoryPage.tsx` main page
- [x] FE9.2 Create `src/components/ApplicationCard.tsx` showing opportunity title, company, status, date
- [x] FE9.3 Create `src/components/StatusBadge.tsx` component (applied, reviewed, shortlisted, rejected, selected)
- [x] FE9.4 Implement filter by status using useState and array.filter()
- [x] FE9.5 Implement sort by date or company name
- [x] FE9.6 Create withdrawal request button with confirmation modal
- [x] FE9.7 Create `src/components/ApplicationTimeline.tsx` for application progression visualization
- [x] FE9.8 Implement loading and empty states
- [x] FE9.9 Write unit tests for application status display and filtering

### Phase FE10: Recruiter Portal - Job Posting (Week 5)

- [ ] FE10.1 Create `src/pages/Recruiter/RecruiterDashboardPage.tsx` main page
- [ ] FE10.2 Create `src/components/JobPostingForm.tsx` with React Hook Form
- [ ] FE10.3 Implement skill requirement input (dynamic array of skills with proficiency)
- [ ] FE10.4 Implement form validation (title, description, skills, deadline required)
- [ ] FE10.5 Create `src/pages/Recruiter/PostingManagementPage.tsx` listing recruiter's postings
- [ ] FE10.6 Create `src/components/PostingCard.tsx` with edit and delete buttons
- [ ] FE10.7 Implement posting status toggle (open/closed/filled)
- [ ] FE10.8 Create `src/pages/Recruiter/ApplicantListPage.tsx` for viewing applicants
- [ ] FE10.9 Create `src/components/ApplicantCard.tsx` with profile preview and skill match %
- [ ] FE10.10 Create `src/components/ApplicantModal.tsx` for full profile view
- [ ] FE10.11 Implement sort/filter by skill match percentage
- [ ] FE10.12 Write Property-Based Tests for Properties 11-13 (Posting round-trip, update, applicant filtering)

### Phase FE11: Search & Advanced Filtering (Week 5)

- [ ] FE11.1 Create `src/components/SearchBar.tsx` global search component
- [ ] FE11.2 Create `src/pages/Search/SearchResultsPage.tsx` results page
- [ ] FE11.3 Implement keyword search in opportunities title/description
- [ ] FE11.4 Create `src/components/AdvancedFilter.tsx` for multi-filter combinations
- [ ] FE11.5 Create `src/components/FilterChips.tsx` displaying active filters with removal
- [ ] FE11.6 Create `src/components/Pagination.tsx` component (previous, page numbers, next)
- [ ] FE11.7 Create sort dropdown (relevance, date, match %)
- [ ] FE11.8 Implement debounced search and filter API calls
- [ ] FE11.9 Write Property-Based Tests for Properties 16-17 (Keyword matching, pagination correctness)

### Phase FE12: Notification Center (Week 6)

- [ ] FE12.1 Create `src/types/notification.ts` with Notification interface
- [ ] FE12.2 Create Redux slice: `src/store/notificationSlice.ts` for notification state
- [ ] FE12.3 Create notification service `src/services/notificationService.ts`
- [ ] FE12.4 Create `src/components/NotificationBell.tsx` icon with unread badge
- [ ] FE12.5 Create `src/components/NotificationDropdown.tsx` menu with latest notifications
- [ ] FE12.6 Create `src/pages/Notifications/NotificationCenterPage.tsx` full page
- [ ] FE12.7 Create `src/components/NotificationCard.tsx` with notification details
- [ ] FE12.8 Implement filter by notification type (opportunity_match, status_update, etc)
- [ ] FE12.9 Create `src/pages/Settings/NotificationPreferencesPage.tsx` with checkboxes
- [ ] FE12.10 Implement mark as read functionality with visual state change
- [ ] FE12.11 Implement notification dismissal/deletion
- [ ] FE12.12 Create auto-refresh hook for polling notifications
- [ ] FE12.13 Write Property-Based Tests for Properties 18-21 (Triggers, status, preferences, persistence)

### Phase FE13: Admin Dashboard (Week 6-7)

- [ ] FE13.1 Create AdminDashboardPage layout
- [ ] FE13.2 Build MetricsWidget component (total students, opportunities, placements)
- [ ] FE13.3 Create AnalyticsChart components (bar, line, pie charts)
- [ ] FE13.4 Build PlacementTrackerPage with application status
- [ ] FE13.5 Create ReportGeneratorPage
- [ ] FE13.6 Build DataExportPage with format selection (CSV/Excel)
- [ ] FE13.7 Implement department filter for analytics
- [ ] FE13.8 Create date range picker for reports
- [ ] FE13.9 Write Property-Based Tests for Properties 14-15 (Report accuracy, export integrity)

### Phase FE14: Responsive Design & Refinement (Week 7-8)

- [ ] FE14.1 Implement mobile-first responsive breakpoints
- [ ] FE14.2 Test all components on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] FE14.3 Implement touch-friendly button sizes and spacing
- [ ] FE14.4 Create mobile-optimized navigation (hamburger menu)
- [ ] FE14.5 Implement responsive tables/cards layout switching
- [ ] FE14.6 Create responsive modals and dialogs
- [ ] FE14.7 Test and fix responsive form layouts
- [ ] FE14.8 Implement lazy loading for images
- [ ] FE14.9 Write Property-Based Tests for Properties 26-27 (Viewport adaptation, design consistency)

### Phase FE15: Frontend Testing (Week 8)

- [ ] FE15.1 Set up Jest and React Testing Library
- [ ] FE15.2 Create test utilities and fixtures
- [ ] FE15.3 Write unit tests for all shared components
- [ ] FE15.4 Write integration tests for page flows
- [ ] FE15.5 Set up fast-check for Property-Based Testing
- [ ] FE15.6 Run all Property-Based Tests (Properties 1-30)
- [ ] FE15.7 Implement performance testing with Lighthouse
- [ ] FE15.8 Generate test coverage report (target: >80%)

---

## BACKEND DEVELOPMENT (Weeks 5-12)

### Phase BE1: Project Setup & Dependencies (Week 5)

- [ ] BE1.1 Initialize FastAPI project with `pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary pydantic python-dotenv`
- [ ] BE1.2 Create project structure: `app/` (models, schemas, routes, services, config), `tests/`, `migrations/`
- [ ] BE1.3 Create `.env` file with database URL, JWT secret, and environment variables
- [ ] BE1.4 Set up `app/config.py` with Settings class using Pydantic BaseSettings
- [ ] BE1.5 Configure PostgreSQL database connection with SQLAlchemy in `app/database.py`
- [ ] BE1.6 Create `app/main.py` with FastAPI app instance and CORS configuration
- [ ] BE1.7 Set up logging configuration in `app/config.py` with Python logging
- [ ] BE1.8 Configure Alembic for database migrations: `alembic init migrations`
- [ ] BE1.9 Set up request validation with Pydantic models in `app/schemas/`
- [ ] BE1.10 Enable automatic API documentation (Swagger UI at `/docs`)
- [ ] BE1.11 Create requirements.txt and .gitignore

### Phase BE2: Authentication & Authorization (Week 5-6)

- [ ] BE2.1 Create `app/models/user.py` with User SQLAlchemy model (id, email, name, role, hashed_password, created_at)
- [ ] BE2.2 Create `app/schemas/user.py` with Pydantic schemas (UserCreate, UserResponse, UserLogin)
- [ ] BE2.3 Install security dependencies: `pip install python-jose[cryptography] passlib[bcrypt] pyjwt`
- [ ] BE2.4 Create `app/services/password.py` with hash_password() and verify_password() using bcrypt
- [ ] BE2.5 Create `app/services/jwt_service.py` with create_access_token() and decode_token()
- [ ] BE2.6 Create `app/routes/auth.py` with POST /api/auth/login endpoint
- [ ] BE2.7 Create POST /api/auth/register endpoint with email uniqueness validation
- [ ] BE2.8 Create POST /api/auth/logout endpoint (returns success response)
- [ ] BE2.9 Create GET /api/auth/validate endpoint to validate JWT token
- [ ] BE2.10 Create `app/dependencies.py` with get_current_user() dependency for route protection
- [ ] BE2.11 Create role-based authorization dependency: require_role() for route protection
- [ ] BE2.12 Implement JWT token expiration (30 minutes access token)
- [ ] BE2.13 Add error handling for invalid/expired tokens (return 401 Unauthorized)
- [ ] BE2.14 Write Property-Based Tests for Properties 22-25 (Auth state, invalid credentials, authorization, session timeout)

### Phase BE3: Student Profile Endpoints (Week 6)

- [ ] BE3.1 Create `app/models/profile.py` with StudentProfile SQLAlchemy model (education, skills, experience, projects, documents)
- [ ] BE3.2 Create `app/models/document.py` with Document model (file_id, file_name, type, uploaded_at, student_id FK)
- [ ] BE3.3 Create `app/schemas/profile.py` with StudentProfileCreate, StudentProfileUpdate, StudentProfileResponse Pydantic schemas
- [ ] BE3.4 Create `app/routes/profile.py` with GET /api/students/{student_id}/profile endpoint
- [ ] BE3.5 Create PUT /api/students/{student_id}/profile endpoint with request body validation
- [ ] BE3.6 Implement profile field validation (CGPA 0-10, non-empty required fields) - Requirement 1.4
- [ ] BE3.7 Create POST /api/students/{student_id}/documents endpoint for file uploads
- [ ] BE3.8 Implement file storage service in `app/services/file_service.py` (local storage or S3)
- [ ] BE3.9 Create DELETE /api/students/{student_id}/documents/{file_id} endpoint
- [ ] BE3.10 Implement access control (students can only modify their own profile)
- [ ] BE3.11 Add error handling for not found (return 404), validation errors (return 422)
- [ ] BE3.12 Create database migrations for profile and document tables
- [ ] BE3.13 Write Property-Based Tests for Properties 1-3 (Profile round-trip, validation, file persistence)

### Phase BE4: Assessment Engine (Week 6-7)

- [ ] BE4.1 Create `app/models/assessment.py` with Assessment, Question, Answer SQLAlchemy models
- [ ] BE4.2 Create `app/models/assessment_session.py` with AssessmentSession model (tracks progress of incomplete assessments)
- [ ] BE4.3 Create `app/models/assessment_result.py` with AssessmentResult model (score, answers, completed_at, time_taken)
- [ ] BE4.4 Create `app/schemas/assessment.py` with Pydantic schemas for all models
- [ ] BE4.5 Create `app/routes/assessment.py` with GET /api/assessments endpoint (list all)
- [ ] BE4.6 Create GET /api/assessments/{assessment_id} endpoint with questions
- [ ] BE4.7 Create POST /api/assessments/{assessment_id}/start endpoint (creates AssessmentSession)
- [ ] BE4.8 Create PUT /api/assessments/{assessment_id}/submit endpoint with answer evaluation
- [ ] BE4.9 Create GET /api/assessments/{assessment_id}/resume endpoint (returns incomplete session state)
- [ ] BE4.10 Implement scoring logic in `app/services/assessment_service.py` (deterministic scoring)
- [ ] BE4.11 Implement answer evaluation logic (compare with correct answers)
- [ ] BE4.12 Implement session save on timeout or manual pause
- [ ] BE4.13 Create database migrations for assessment tables
- [ ] BE4.14 Write Property-Based Tests for Properties 4-6 (Score determinism, resume recovery, result completeness)

### Phase BE5: Skill Gap Analysis (Week 7)

- [ ] BE5.1 Create `app/models/skill_gap.py` with SkillGapAnalysis SQLAlchemy model
- [ ] BE5.2 Create `app/schemas/skill_gap.py` with SkillGapAnalysis Pydantic schema
- [ ] BE5.3 Create `app/services/skill_gap_service.py` with aggregation logic
- [ ] BE5.4 Implement algorithm in skill_gap_service.py to aggregate multiple assessment scores
- [ ] BE5.5 Implement algorithm to map assessment skills to industry standard skill categories
- [ ] BE5.6 Implement recommendation algorithm based on gaps (prioritize high gaps)
- [ ] BE5.7 Create GET /api/students/{student_id}/skill-gaps endpoint
- [ ] BE5.8 Implement response caching with TTL (cache for 1 hour)
- [ ] BE5.9 Create background task for periodic gap recalculation (using APScheduler)
- [ ] BE5.10 Add database migration for skill_gap table
- [ ] BE5.11 Write Property-Based Tests for Property 7 (Skill gap aggregation)

### Phase BE6: Job Opportunity Endpoints (Week 7-8)

- [ ] BE6.1 Create `app/models/opportunity.py` with JobOpportunity SQLAlchemy model (title, company, description, required_skills, location, salary, deadline, status)
- [ ] BE6.2 Create `app/models/application.py` with Application model (student_id FK, opportunity_id FK, status, applied_at, skill_match_percentage)
- [ ] BE6.3 Create `app/schemas/opportunity.py` with Pydantic schemas for opportunities
- [ ] BE6.4 Create `app/routes/opportunity.py` with GET /api/opportunities endpoint (with pagination, filtering, sorting)
- [ ] BE6.5 Implement query parameters: skip, limit, location, company, role_type for filtering
- [ ] BE6.6 Create GET /api/opportunities/{opportunity_id} endpoint with full details
- [ ] BE6.7 Create POST /api/opportunities endpoint (recruiter only) to post new job
- [ ] BE6.8 Create PUT /api/opportunities/{opportunity_id} endpoint (recruiter only) for updates
- [ ] BE6.9 Implement skill matching algorithm in `app/services/matching_service.py`
- [ ] BE6.10 Create POST /api/opportunities/{opportunity_id}/apply endpoint (creates Application record)
- [ ] BE6.11 Implement duplicate application prevention (return error if exists)
- [ ] BE6.12 Create GET /api/opportunities/{opportunity_id}/applicants endpoint (recruiter only)
- [ ] BE6.13 Add database migrations for opportunity and application tables
- [ ] BE6.14 Write Property-Based Tests for Properties 8-13 (Filter, duplicate prevention, completeness, posting, update, filtering)

### Phase BE7: Application Management (Week 8)

- [ ] BE7.1 Create `app/routes/application.py` with application endpoints
- [ ] BE7.2 Create GET /api/applications endpoint to list user's applications (with filtering)
- [ ] BE7.3 Create PUT /api/applications/{application_id}/status endpoint (admin/recruiter only) to change status
- [ ] BE7.4 Create GET /api/applications/{application_id} endpoint with full application details
- [ ] BE7.5 Implement skill match percentage calculation in Application model property
- [ ] BE7.6 Create notification triggers on status change (will integrate with Phase BE9)
- [ ] BE7.7 Implement access control (users see only their applications, recruiters see their postings' applications)
- [ ] BE7.8 Add query parameters for filtering by status, opportunity, date range
- [ ] BE7.9 Write unit tests for application management and status updates

### Phase BE8: Search & Filtering (Week 8)

- [ ] BE8.1 Create `app/services/search_service.py` with keyword search logic
- [ ] BE8.2 Implement multi-filter combination logic (AND logic: all filters must match)
- [ ] BE8.3 Implement full-text search on opportunity title, description, company
- [ ] BE8.4 Create GET /api/search endpoint with query parameters (q, filters)
- [ ] BE8.5 Implement pagination and sorting (by relevance, date, match %)
- [ ] BE8.6 Add database indexes on searchable columns (title, description, company)
- [ ] BE8.7 Implement query optimization with selective field loading
- [ ] BE8.8 Write Property-Based Tests for Properties 16-17 (Keyword matching, pagination correctness)

### Phase BE9: Notification System (Week 9)

- [ ] BE9.1 Create `app/models/notification.py` with Notification SQLAlchemy model (user_id FK, type, title, message, read, created_at)
- [ ] BE9.2 Create `app/schemas/notification.py` with Pydantic schemas
- [ ] BE9.3 Create `app/services/notification_service.py` with notification logic
- [ ] BE9.4 Implement notification trigger for opportunity matching (when new opportunity posted matching student skills)
- [ ] BE9.5 Implement notification trigger for application status changes
- [ ] BE9.6 Create `app/routes/notification.py` with GET /api/notifications endpoint
- [ ] BE9.7 Create PUT /api/notifications/{notification_id}/read endpoint to mark as read
- [ ] BE9.8 Create DELETE /api/notifications/{notification_id} endpoint
- [ ] BE9.9 Create `app/models/notification_preference.py` with user notification preferences
- [ ] BE9.10 Create PUT /api/users/{user_id}/notification-preferences endpoint
- [ ] BE9.11 Implement filtering based on user preferences in notification service
- [ ] BE9.12 Create background task for sending notifications (APScheduler)
- [ ] BE9.13 Set up WebSocket support for real-time notifications (using FastAPI WebSockets)
- [ ] BE9.14 Write Property-Based Tests for Properties 18-21 (Triggers, status, preferences, persistence)

### Phase BE10: Analytics & Reporting (Week 9-10)

- [ ] BE10.1 Create `app/services/analytics_service.py` for analytics calculations
- [ ] BE10.2 Create `app/routes/analytics.py` with analytics endpoints
- [ ] BE10.3 Create GET /api/analytics/dashboard endpoint with metrics (total students, opportunities, placements, placement rate)
- [ ] BE10.4 Implement KPI calculations (query aggregations using SQLAlchemy)
- [ ] BE10.5 Create GET /api/analytics/reports/{report_type} endpoint for different report types
- [ ] BE10.6 Implement department-based filtering (add department field to StudentProfile)
- [ ] BE10.7 Implement date range filtering with query parameters (start_date, end_date)
- [ ] BE10.8 Create POST /api/analytics/export endpoint for data export
- [ ] BE10.9 Implement CSV/Excel export using `pandas` and `openpyxl` libraries
- [ ] BE10.10 Create background task for report generation (APScheduler)
- [ ] BE10.11 Implement caching for analytics results (TTL 1 hour)
- [ ] BE10.12 Write Property-Based Tests for Properties 14-15 (Report accuracy, export integrity)

### Phase BE11: Data Validation & Security (Week 10)

- [ ] BE11.1 Create `app/utils/validators.py` with comprehensive input validation functions
- [ ] BE11.2 Add Pydantic validators to all schemas (email format, CGPA range, date format)
- [ ] BE11.3 Implement HTTPS enforcement (use only in production, configure in deployment)
- [ ] BE11.4 Add security headers middleware: X-Content-Type-Options, X-Frame-Options, etc.
- [ ] BE11.5 Configure CORS policy in `app/main.py` (restrict to frontend domain)
- [ ] BE11.6 Implement request rate limiting using `slowapi` library
- [ ] BE11.7 Implement sensitive data masking in logs (mask passwords, personal info)
- [ ] BE11.8 Add XSS protection via Pydantic HTML escaping
- [ ] BE11.9 Add CSRF token support (if needed for form submissions)
- [ ] BE11.10 Implement data access control (users see only their own data)
- [ ] BE11.11 Create DELETE /api/users/{user_id} endpoint for account deletion
- [ ] BE11.12 Implement cascading deletion (delete profile, documents, applications, assessments)
- [ ] BE11.13 Write Property-Based Tests for Properties 29-30 (Sensitive data protection, deletion completeness)

### Phase BE12: Performance Optimization (Week 10-11)

- [ ] BE12.1 Add database indexes on frequently queried columns (user_id, opportunity_id, created_at)
- [ ] BE12.2 Implement N+1 query prevention with SQLAlchemy `selectinload()` and `joinedload()`
- [ ] BE12.3 Install and configure Redis: `pip install redis`
- [ ] BE12.4 Implement caching layer for frequently accessed data (opportunities, skill gaps)
- [ ] BE12.5 Create connection pooling for database using SQLAlchemy pool configuration
- [ ] BE12.6 Implement pagination for all list endpoints (default limit 20, max 100)
- [ ] BE12.7 Implement response compression (gzip) middleware in FastAPI
- [ ] BE12.8 Create background tasks for heavy computations (skill gap recalc, notifications)
- [ ] BE12.9 Implement query result caching with TTL (using Redis or in-memory cache)
- [ ] BE12.10 Add HTTP caching headers (Cache-Control, ETag) for appropriate responses
- [ ] BE12.11 Optimize JSON serialization (use Pydantic model_dump())
- [ ] BE12.12 Write performance tests and create optimization report
- [ ] BE12.13 Write Property-Based Tests for Property 28 (Large dataset pagination)

### Phase BE13: Backend Testing (Week 11)

- [ ] BE13.1 Install pytest and testing dependencies: `pip install pytest pytest-asyncio httpx`
- [ ] BE13.2 Create `tests/` directory structure: `conftest.py`, `test_models/`, `test_routes/`, `test_services/`
- [ ] BE13.3 Create `tests/conftest.py` with FastAPI TestClient and test database setup
- [ ] BE13.4 Create test database fixture (separate from production database)
- [ ] BE13.5 Create seed data fixtures for common test scenarios
- [ ] BE13.6 Write unit tests for all services in `tests/test_services/`
- [ ] BE13.7 Write integration tests for all API endpoints in `tests/test_routes/`
- [ ] BE13.8 Install and configure Hypothesis for property-based testing: `pip install hypothesis`
- [ ] BE13.9 Write property-based tests for all 30 properties
- [ ] BE13.10 Run full test suite: `pytest --cov=app tests/`
- [ ] BE13.11 Generate coverage report (target >80%)
- [ ] BE13.12 Set up test CI/CD pipeline (GitHub Actions or GitLab CI)
- [ ] BE13.13 Create test documentation

### Phase BE14: Deployment & DevOps (Week 11-12)

- [ ] BE14.1 Create `Dockerfile` for FastAPI application
- [ ] BE14.2 Create `docker-compose.yml` for local development (FastAPI + PostgreSQL + Redis)
- [ ] BE14.3 Create `.dockerignore` file
- [ ] BE14.4 Set up GitHub Actions CI/CD pipeline (`.github/workflows/`)
- [ ] BE14.5 Configure lint and test jobs in CI (black, flake8, pytest)
- [ ] BE14.6 Configure automated deployment job to staging/production
- [ ] BE14.7 Create environment configuration files (.env.example, .env.production)
- [ ] BE14.8 Set up logging with Python logging and structured logs (JSON format)
- [ ] BE14.9 Configure error tracking with Sentry: `pip install sentry-sdk`
- [ ] BE14.10 Set up performance monitoring (APM) optional
- [ ] BE14.11 Create deployment runbook document (how to deploy, rollback procedures)
- [ ] BE14.12 Configure database backups and restore procedures
- [ ] BE14.13 Set up monitoring and alerting (log aggregation, error alerts)
- [ ] BE14.14 Deploy to staging environment and run smoke tests
- [ ] BE14.15 Deploy to production and verify all systems operational

---

## Optional Enhancements (Post-MVP)

- [ ]* 16.1 Implement advanced skill matching algorithm with ML
- [ ]* 16.2 Add video interview capability for recruiters
- [ ]* 16.3 Implement recommendation engine for learning paths
- [ ]* 16.4 Add real-time collaboration features (messaging)
- [ ]* 16.5 Create mobile native apps (React Native/Flutter)
- [ ]* 16.6 Implement advanced analytics with predictive modeling
- [ ]* 16.7 Add third-party integrations (LinkedIn, Indeed, etc.)
- [ ]* 16.8 Create automated skill assessment with coding challenges
