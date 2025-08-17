// src/router/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import TaskPage from '../domains/task/pages/TaskPage'
import BookListPage from '../domains/booklist/pages/BookListPage'
import NotFound from '../pages/NotFound'
import ModulePage from '../domains/module/pages/ModulePage'
const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path='/subtasks' element={""} />
        <Route path='/modules' element={<ModulePage />} />
        <Route path='/statistics' element={""} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
) 

export default AppRoutes
