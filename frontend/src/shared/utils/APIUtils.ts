import axios from 'axios'



export const api = axios.create({
    baseURL: 'http://localhost:8080/api', // 可通过 .env 管理
    timeout: 10000,
    withCredentials: true,
    headers : {
     'Content-Type': "application/json",
     'Accept': 'application/json'
    }
})

// 全局请求/响应拦截器（可选）
api.interceptors.response.use(
    res => res,
    err => {
        console.error('❌ API 错误:', err.response?.data || err.message)
        return Promise.reject(err)
    }
)

api.interceptors.request.use(
    re=>re,
    err=>{
     console.error('api res error',err.request?.data || err.message)
     return Promise.reject(err)
    }
)