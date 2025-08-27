import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
 
// import './styles/global.css' // 全局样式（可选）
import './app/App.css'
import App from './app/App'
import { LoadingProvider } from './context/LoadingContext'
const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(
    <LoadingProvider>
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    </LoadingProvider>
)
