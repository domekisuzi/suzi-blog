import express from 'express'
import  cors from 'cors'
import bodyParser from 'body-parser'
import tasksRoutes from './routes/tasks'
import * as dotenv from 'dotenv'

dotenv.config()



const app = express()

// ✅ 配置 CORS
app.use(cors({
    origin: 'http://localhost:3000', // 或部署后的前端地址，也可用 "*" 允许所有
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}))

// ✅ 解析 JSON 请求体
app.use(bodyParser.json())

// ✅ 注册路由
app.use('/api/tasks', tasksRoutes)

// ✅ 启动服务
const PORT = 3001
app.listen(PORT, () => {
    console.log(`🚀 后端服务启动成功：http://localhost:${PORT}`)
})
