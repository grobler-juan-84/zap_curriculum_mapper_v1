import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage'
import { LoginPage } from './features/auth/LoginPage'
import { ResetPasswordPage } from './features/auth/ResetPasswordPage'
import { SignupPage } from './features/auth/SignupPage'
import { BookWorkspacePage } from './features/book-workspace/BookWorkspacePage'
import { CurriculumLibraryPage } from './features/curriculum-library/CurriculumLibraryPage'
import { LandingPage } from './features/landing/LandingPage'
import { SeriesLibraryPage } from './features/series-library/SeriesLibraryPage'
import { AppShell } from './features/shell/AppShell'
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
        <Route index element={<Navigate to="workspace" replace />} />
        <Route path="curriculum" element={<CurriculumLibraryPage />} />
        <Route path="series" element={<SeriesLibraryPage />} />
        <Route path="workspace" element={<BookWorkspacePage />} />
        <Route path="validation" element={<ValidationPage />} />
        <Route path="chalkie" element={<ChalkiePage />} />
      </Route>
    </Routes>
  )
}
