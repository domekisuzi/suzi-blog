// src/router/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import TaskPage from '../domains/task/pages/TaskPage'
import BookListPage from '../domains/booklist/pages/BookListPage'
import NotFound from '../pages/NotFound'
import ModulePage from '../domains/module/pages/ModulePage'
import TimelinePage from '../domains/timeline/pages/TimelinePage'
import DataManagePage from '../pages/DataManagePage'
import WeeklySchedulePage from '../domains/schedule/pages/WeeklySchedulePage'

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/tasks/:moduleId" element={<TaskPage />} />
        <Route path='/subtasks' element={<Navigate to='/tasks' replace />} />
        <Route path='/subtasks/:taskId' element={<Navigate to='/tasks' replace />} />
        <Route path='/modules' element={<ModulePage />} />
        <Route path='/modules/:moduleId' element={<ModulePage />} />
        <Route path='/timeline' element={<TimelinePage />} />
        <Route path='/data' element={<DataManagePage />} />
        <Route path='/schedule' element={<WeeklySchedulePage />} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
) 

export default AppRoutes
