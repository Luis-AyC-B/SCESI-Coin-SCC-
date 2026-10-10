import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Admin from './pages/Admin'
import Explorador from './pages/Explorador'
import Panel from './pages/Panel'
import Premios from './pages/Premios'
import Ranking from './pages/Ranking'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/panel" replace />} />
            <Route path="panel" element={<Panel />} />
            <Route path="premios" element={<Premios />} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="explorador" element={<Explorador />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/panel" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
