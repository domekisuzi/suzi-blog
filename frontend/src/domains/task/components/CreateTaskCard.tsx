import React, { useEffect } from 'react';
import { Box, TextField, Typography, MenuItem, Card, CardContent, Divider } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { Task, TaskPriority, TaskPriorityValues } from '../model/taskTypes';
import { dateUtils } from '../../../shared/utils/DateUtil';
import { withUUID } from '../../../shared/utils/DataWrap';
import { createTask } from '../api/taskApi';
import { fetchModules } from '../../module/api/moduleApi';
import { Module } from '../../module/model/module';
import { useLoading } from '../../../context/LoadingContext';

interface Props {
    onSubmit: (task: Task) => void
}

export default function CreateTaskCard({ onSubmit }: Props) {
    const [dueDate, setDueDate] = React.useState<string | null>(null);
    const [moduleList, setModuleList] = React.useState<Module[] | null>(null);
    const { setLoading } = useLoading()
    dayjs.extend(utc)

    useEffect(() => {
        setLoading(true)
        fetchModules().then(res => {
            setModuleList(res)
            setLoading(false)
        }).catch(error => console.log(error))
    }, [])

    return moduleList && (
        <Box
            id="createTaskForm"
            component="form"
            onSubmit={(e) => {
                e.preventDefault()
                setLoading(true)
                const formData = new FormData(e.currentTarget)
                const moduleName = formData.get('moduleId') as string
                const taskData: Task = {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    moduleName: (moduleName === '') ? undefined : moduleName,
                    completed: false,
                    id: "",
                    createdAt: "",
                    priority: formData.get("taskPriority") as TaskPriority,
                    dueDate: dueDate ? dateUtils.toBackendFormat(dueDate) : undefined
                }
                createTask(withUUID<Task>(taskData)).then((res) => {
                    if (res) {
                        onSubmit(taskData)
                        setLoading(false)
                    }
                    console.log("创建任务成功", res)
                }).catch((error) => {
                    console.log("创建任务失败")
                    console.log(error)
                    setLoading(false)
                })
            }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                📌 基本信息
            </Typography>

            <TextField
                name="title"
                label="任务标题"
                required
                defaultValue={''}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        '&:hover': { backgroundColor: '#fff' },
                        '&.Mui-focused': { backgroundColor: '#fff' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                }}
            />

            <TextField
                name="description"
                label="任务描述"
                multiline
                minRows={3}
                defaultValue={''}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        '&:hover': { backgroundColor: '#fff' },
                        '&.Mui-focused': { backgroundColor: '#fff' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                }}
            />

            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                ⚙️ 任务设置
            </Typography>

            <TextField
                name="moduleId"
                select
                label="模块（可选）"
                defaultValue={moduleList ? moduleList[0].name : ''}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        '&:hover': { backgroundColor: '#fff' },
                        '&.Mui-focused': { backgroundColor: '#fff' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                }}
            >
                {moduleList.map(({ id, name }) => (
                    <MenuItem key={id} value={name} sx={{ borderRadius: '8px', mx: 1, my: 0.5 }}>
                        {name}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                name="taskPriority"
                select
                label="优先级"
                required
                defaultValue={TaskPriorityValues[0]}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        '&:hover': { backgroundColor: '#fff' },
                        '&.Mui-focused': { backgroundColor: '#fff' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                }}
            >
                {TaskPriorityValues.map((data) => (
                    <MenuItem key={data} value={data} sx={{ borderRadius: '8px', mx: 1, my: 0.5 }}>
                        {data === 'high' ? '🔴 高' : data === 'medium' ? '🟡 中' : '🟢 低'}
                    </MenuItem>
                ))}
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="截止日期"
                    onChange={(newValue) => {
                        setDueDate(dayjs(newValue).local().format("YYYY-MM-DDTHH:mm:ss"))
                    }}
                    slotProps={{
                        textField: {
                            sx: {
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f8fafc',
                                    '&:hover': { backgroundColor: '#fff' },
                                    '&.Mui-focused': { backgroundColor: '#fff' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                            }
                        }
                    }}
                />
            </LocalizationProvider>
        </Box>
    )
}