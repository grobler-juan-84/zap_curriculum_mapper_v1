import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage'
import { LoginPage } from './features/auth/LoginPage'
import { ResetPasswordPage } from './features/auth/ResetPasswordPage'
import { SignupPage } from './features/auth/SignupPage'
import { BookWorkspacePage } from './features/book-workspace/BookWorkspacePage'
import { CurriculumLibraryPage } from './features/curriculum-library/CurriculumLibraryPage'
import { LandingPage } from './features/landing/LandingPage'
import { AppShell } from './features/shell/AppShell'
import { AppEntryRedirect } from './features/shell/AppEntryRedirect'
import { PreserveQueryRedirect } from './features/shell/PreserveQueryRedirect'
import { SeriesToWorkspaceChooserRedirect } from './features/shell/SeriesToWorkspaceChooserRedirect'
import { BookIntelligenceRedirect } from './features/book-intelligence/BookIntelligenceRedirect'
import { ChalkiePage } from './features/chalkie/ChalkiePage'
import { ValidationPage } from './features/validation/ValidationPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<AppEntryRedirect />} />
        <Route path="curriculum" element={<CurriculumLibraryPage />} />
        {/* Compatibility: former series stop → in-workspace book chooser. */}
        <Route path="series" element={<SeriesToWorkspaceChooserRedirect />} />
        {/* Canonical teacher preparation surface (rich SB-first workspace). */}
        <Route path="book-workspace" element={<ChalkiePage />} />
        {/* Compatibility: former Chalkie Workspace URL. */}
        <Route
          path="chalkie"
          element={<PreserveQueryRedirect to="/app/book-workspace" />}
        />
        {/* Compatibility: former mock "Book Workspace" URL → canonical surface. */}
        <Route
          path="workspace"
          element={<PreserveQueryRedirect to="/app/book-workspace" />}
        />
        {/* Hidden legacy mock spread workstation (Beehive demo). Not in sidebar. */}
        <Route path="legacy-mock-workspace" element={<BookWorkspacePage />} />
        <Route path="validation" element={<ValidationPage />} />
        <Route
          path="book-intelligence"
          element={<BookIntelligenceRedirect />}
        />
        <Route
          path="book-intelligence/:catalogBookId"
          element={<BookIntelligenceRedirect />}
        />
      </Route>
    </Routes>
  )
}
