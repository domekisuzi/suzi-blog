import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.module.css' // 可选：自定义样式

const NotFound: React.FC = () => {
    return (
        <div className="notfound-container">
            <h1>404</h1>
            <p>你访问的页面不存在。</p>
            <Link to="/" className="back-home">
                返回首页
            </Link>
        </div>
    )
}

export default NotFound
