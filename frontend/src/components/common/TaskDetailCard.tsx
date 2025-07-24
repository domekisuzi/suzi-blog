
import React from 'react'
import {
    TextField,
    Typography,
    Box,
    Chip,
    Divider,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material'
import { Task } from '../../features/tasks/types'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { dateUtils } from '../../utils/DateUtil'
 

interface Props {
    task: Task
    isEditing?: boolean
    onChange?: (updated: Task) => void // this function is used for noticing the change to parent component, when the value is uneditable, we do not need to set the value
}



export default function TaskDetailCard({ task, isEditing = false, onChange }: Props) {
    const handleFieldChange = (field: keyof Task) => (e: any) => {
        const value = e.target.value
        console.log ('FieldChange', field, value)
        if(onChange){
            // onChange?.({ ...task, [field]: value })  // a new grammar named optional chaining,it avoids use the function  of null which causes error
            const newValue:Task = { ...task, [field]: value } 
            onChange(newValue) // update the task with the new value
            console.log('onChange', newValue)
        }
      
    }

    return (
        <Box sx={{ p: 2 }}>
            {/* 标题 */}
            {isEditing ? (
                <TextField
                    label="标题"
                    fullWidth
                    value={task.title}
                    onChange={handleFieldChange('title')}
                    sx={{ mb: 2 }}
                />
            ) : (
                <Typography variant="h5" fontWeight={600} gutterBottom>{task.title}</Typography>
            )}

            {/* 优先级与完成状态 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={`优先级: ${task.priority}`} color="primary" size="small" />
                <Chip
                    label={task.completed ? '已完成' : '未完成'}
                    color={task.completed ? 'default' : 'success'}
                    size="small"
                />
            </Box>

            {/* 模块与分类 */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
                模块：{task.module?.name ?? '—'} ｜
            </Typography>

            {/* 截止时间 */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
                创建时间：{task.createdAt} ｜ 截止：{ task.dueDate ? dateUtils.toDisplayFormat( task.dueDate) : '无' }
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* 描述 */}
            <Typography variant="subtitle1" gutterBottom>描述</Typography>
            {isEditing ? (
                <TextField
                    label="描述"
                    fullWidth
                    multiline
                    rows={4}
                    value={task.description}
                    onChange={handleFieldChange('description')}
                />
            ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {task.description}
                </Typography>
            )}

            {((task.subtasks?.length ?? 0) > 0) && (
                <>
                    <Divider sx={{my: 2}}/>
                    <Typography variant="subtitle1" gutterBottom>子任务</Typography>
                    <List dense>
                        {task.subtasks?.map(sub => (
                            <ListItem key={sub.id}>
                                <ListItemIcon>
                                    {sub.completed ? <CheckCircleIcon color="success"/> :
                                        <RadioButtonUncheckedIcon color="disabled"/>}
                                </ListItemIcon>
                                <ListItemText primary={sub.title}
                                              secondary={sub.completed ? '已完成' : '未完成'}/>

                            </ListItem>
                        ))}
                    </List>
                </>
            )}

        </Box>
    )
}
