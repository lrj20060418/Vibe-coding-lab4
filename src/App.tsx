import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { DayDetailPage } from './pages/DayDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/day/:date" element={<DayDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
