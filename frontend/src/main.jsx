import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import RequireAuthor from './components/RequireAuthor'
import RequireRecipient from './components/RequireRecipient'
import RecipientGate from './pages/RecipientGate'
import RecipientLetterList from './pages/RecipientLetterList'
import RecipientLetterDetail from './pages/RecipientLetterDetail'
import WriterLogin from './pages/WriterLogin'
import WriterDashboard from './pages/WriterDashboard'
import WriterNewLetter from './pages/WriterNewLetter'
import WriterLetterDetail from './pages/WriterLetterDetail'
import NotFound from './pages/NotFound'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipientGate />} />

        <Route element={<RequireRecipient />}>
          <Route path="/letters" element={<RecipientLetterList />} />
          <Route path="/letters/:id" element={<RecipientLetterDetail />} />
        </Route>

        <Route path="/write" element={<WriterLogin />} />

        <Route element={<RequireAuthor />}>
          <Route path="/write/dashboard" element={<WriterDashboard />} />
          <Route path="/write/new" element={<WriterNewLetter />} />
          <Route path="/write/letters/:id" element={<WriterLetterDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
