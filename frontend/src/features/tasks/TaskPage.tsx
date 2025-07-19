import React from 'react'
import {
    Button,
    Dialog,
    List,
    ListItem,
    ListItemText,
    DialogTitle,
    DialogActions,
    TextField,
    Typography, DialogContent, Box, MenuItem, Card, ListItemIcon, Divider, Chip ,CardActionArea
} from "@mui/material";
import {Module, Task, TaskPriority, TaskPriorityValues} from "./types";
import styles from  "./TaskPage.module.css"
import {mockModules, mockTasks} from "../../utils/CrackData";
import {useNavigate} from "react-router-dom";

import {createTask} from "../../api/tasks";
import {withUUID} from "../../utils/DataWrap";
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'


//  后续再设计是否会有页面方面的内容
//  先防止module列表，改为其他格式吧


const TaskPage: React.FC=() => {


    const taskList:Task[] = mockTasks
    const moduleList:Module[] = mockModules


    const [createTaskOpen,setCreateTaskOpen] = React.useState(false) // 声明组件级别状态声明变量，去open是状态，setOpen是更新状态的函数， false是设置的初始值
    const [detailTaskOpen,setDetailTaskOpen] = React.useState(false)
    const handleCreateTaskOpen = () => {
        setCreateTaskOpen(true);
    };

    const handleCreateTaskClose = () => {
        setCreateTaskOpen(false);
    };
    const handleDetailTaskOpen = () => {
        setDetailTaskOpen(true);
    };

    const handleDetailTaskClose = () => {
        setDetailTaskOpen(false);
    };
    const [dueDate, setDueDate] = React.useState<Date | null>(null)
    const formattedDate = dueDate
        ? dueDate.toISOString().slice(0, 19).replace('T', ' ')
        : null

    const handleCreateTaskSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const formData =  new FormData(e.currentTarget)
        const taskData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            moduleId: formData.get('moduleId') as string,
            completed: false,
            id: "",
            createdAt: "",
            priority: formData.get("taskPriority") as TaskPriority,
            dueDate: formattedDate as string
        }
        createTask(withUUID<Task>(taskData) ).then((res)=>{
            if(res){
                //这里填充等待和成功逻辑

            }
            console.log(taskData.dueDate)
            console.log("创建任务成功")
        })

        handleCreateTaskClose()
    }

    const task  = mockTasks[0]

    return(
    <div className={styles.container}>
        this is TaskPage
        <h1>
            Work Plan
        </h1>
        <div className={styles.header}>
            <span className={styles.headerItem}>
                 Manage your tasks and projects efficiently
            </span>
            <Button   variant= "contained" onClick={handleCreateTaskOpen}> New Task</Button>
            <Dialog open={createTaskOpen}
            onClose={handleCreateTaskClose}
            >
                <DialogTitle>
                    {"创建任务"}
                </DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box
                            id="createTaskForm"
                            component="form"
                            onSubmit={handleCreateTaskSubmit}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                py: 2,
                                px: 1
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={600}>
                                📌 基本信息
                            </Typography>

                            <TextField name="title" variant="standard" label="任务标题" required />
                            <TextField
                                name="description"
                                variant="standard"
                                label="任务描述"
                                multiline
                                minRows={2}
                            />

                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                ⚙️ 任务设置
                            </Typography>

                            <TextField
                                name="moduleName"
                                select
                                variant="standard"
                                label="模块（可选）"
                            >
                                {mockModules.map((data) => (
                                    <MenuItem key={data.id} value={data.name}>
                                        {data.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                name="taskPriority"
                                select
                                variant="standard"
                                label="优先级"
                                required
                            >
                                {TaskPriorityValues.map((data) => (
                                    <MenuItem key={data} value={data}>
                                        {data.charAt(0).toUpperCase() + data.slice(1)}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <DatePicker
                                value={dueDate}
                                onChange={(newValue) => setDueDate(newValue)}

                            />
                        </Box>
                    </LocalizationProvider>

                </DialogContent>

                <DialogActions>
                    <Button type="submit" form="createTaskForm">
                        提交
                    </Button>
                    <Button onClick={handleCreateTaskClose} autoFocus>
                        关闭
                    </Button>
                </DialogActions>

            </Dialog>
        </div>

        <div className={styles.taskSection}>
            <div className={styles.module}>


                <List>
                    <h2>
                        Modules
                    </h2>

                    {moduleList.map((module)=>(

                            <ListItem key={module.id} className={styles.moduleItem} sx={{padding:0}}>
                                <ListItemText primary={module.name}/>
                            </ListItem>

                    ))}
                </List>
            </div>
            <div className={styles.tasks}>
                <List className={styles.taskRoot}>
                    {taskList.map((task)=>(
                        <Card  key={task.id}  className={styles.cardTaskItem}>
                            <CardActionArea onClick={handleDetailTaskOpen}>
                                <ListItem className={styles.taskItem}>

                                        <div className={styles.taskTitle}>
                                            <p>{(task.module && task.module.name)}</p>
                                            <p> {( task.completed? "Completed":"In progress")  }</p>
                                        </div>

                                        <ListItemText  className={styles.taskButton}  primary={task.title}
                                                       secondary={task.description}
                                        />

                                </ListItem>
                        </CardActionArea>
                        </Card>
                        )
                    )}

                </List>
            </div>

            {/*任务详情界面，需要一些*/}
            <Dialog onClose={handleDetailTaskClose} open={detailTaskOpen} className={styles.taskDetail}>
                <DialogTitle>
                    任务详情
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                        {task.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Chip label={`优先级: ${task.priority}`} color="primary" size="small" />
                        <Chip label={task.completed ? '已完成' : '未完成'} color={task.completed ? 'default' : 'success'} size="small" />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        模块：{task.module?.name ?? ""} | 分类：{""}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        创建时间：{ (task.createdAt)} ｜ 截止：{ (task.dueDate)}
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>描述</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {task.description}
                    </Typography>

                    { ((task.subtasks?.length ?? 0) > 0) && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>子任务</Typography>
                            <List dense>
                                {task.subtasks?.map(sub => (
                                    <ListItem key={sub.id}>
                                        <ListItemIcon>
                                            {sub.completed ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon color="disabled" />}
                                        </ListItemIcon>
                                        <ListItemText primary={sub.title} secondary={sub.completed ? '已完成' : '未完成'} />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailTaskClose} autoFocus>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    </div>
    )
}

export default TaskPage
