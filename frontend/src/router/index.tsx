// src/router/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import TaskPage from '../features/tasks/TaskPage'
import BookListPage from '../features/booklist/BookListPage'
import NotFound from '../pages/NotFound'

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path='/subtasks' element={""} />
        <Route path='/modules' element={""} />
        <Route path='/taskStatistics' element={""} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
) 

export default AppRoutes
