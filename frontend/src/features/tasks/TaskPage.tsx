import React, {useEffect, useMemo} from 'react'
import {
    Button,
    Dialog,
    List,
    ListItem,
    ListItemText,
    DialogTitle,
    DialogActions,
    TextField,
    Typography, DialogContent, Box, MenuItem, Card, ListItemIcon, Divider, Chip, CardActionArea, IconButton
} from "@mui/material";
import {Module, Task, TaskPriority, TaskPriorityValues} from "./types";
import styles from  "./TaskPage.module.css"
import {mockModules, mockTasks} from "../../utils/CrackData";

import {createTask, deleteTask, fetchTasks, updateTask} from "../../api/tasks";
import {withUUID} from "../../utils/DataWrap";
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskDetailCard from "../../components/common/TaskDetailCard";
import { dateUtils } from '../../utils/DateUtil';
import { log } from 'console';
//  后续再设计是否会有页面方面的内容
//  先防止module列表，改为其他格式吧


const TaskPage: React.FC=() => {

    // const taskList:Task[] = mockTasks
    const moduleList:Module[] = mockModules


    const [createTaskOpen,setCreateTaskOpen] = React.useState(false) // 声明组件级别状态声明变量，去open是状态，setOpen是更新状态的函数， false是设置的初始值
    const [detailTaskOpen,setDetailTaskOpen] = React.useState(false)


    // used  for detail task
    const [nowDetailTask,setNowDetailTask] = React.useState< Task| null>(null)
    const [taskList,setTaskList] = React.useState <Task[]|null>(null)

    const [editTaskOpen,setEditTaskOpen] = React.useState(false)


    const handleCreateTaskOpen = () => {
        setCreateTaskOpen(true);
    };

    const handleCreateTaskClose = () => {
        setCreateTaskOpen(false);
    };
    const handleEditTaskOpen = () => {
        setCreateTaskOpen(true);
    };

    const handleEditTaskClose = () => {
        setEditTaskOpen(false);
    };


    const handleDetailTaskOpen = (task:Task) => {
        setNowDetailTask(task)
        if(task ) {
            setDetailTaskOpen(true) // if task is not exist, we can not open the detail dialog,though it would't hapenn in normal time
        }
        else{
            setDetailTaskOpen(false)
            alert("unexpected error happen ! ")
        }

    };

    const handleDetailTaskClose = () => {
        setDetailTaskOpen(false);
    };

    const handleEditTask =  (task:Task) =>{
        setNowDetailTask(task)
        setEditTaskOpen(true)
    }

    const handleDeleteTask = (task:Task) =>{

        deleteTask(task.id).then(
            ()=>{
                setTaskList(pre => pre ?  pre.filter(t =>t.id !== task.id ):[])
            }
        )
    }
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
            dueDate: dateUtils.toBackendFormat(dueDate) // 这里需要转换为后端格式
        }
        createTask(withUUID<Task>(taskData) ).then((res)=>{
            if(res){
                   //TODO('create the update success animation to alert user')
                freshTasksList()
            }
            // console.log(taskData.dueDate)
            console.log("创建任务成功")
        }).catch(
            (error)=>{
                console.log("创建任务失败")
                console.log(error)
            }
        )
        handleCreateTaskClose()
    }

    const handleEditTaskSubmit = ()=>{

        if(nowDetailTask) {
           
            updateTask(nowDetailTask.id, nowDetailTask).then(() => {
                console.log("update success!",nowDetailTask)
                //TODO('create the update success animation to alert user')
                setTaskList(pre => pre ? pre.map(task => task.id === nowDetailTask?.id ? nowDetailTask : task) : [])
                setEditTaskOpen(false)
            })

        }
        else{
            console.log("update failed, item does not exist")
            setEditTaskOpen(false)
        }
    }
    const freshTasksList = () => {
        fetchTasks().then(
            (res) => {
                console.log(res)
                setTaskList(res)
            }
        ).catch(
            (error) => {
                console.error("获取任务失败", error)
            }
        )
    }

    useEffect(()=>{
        freshTasksList()
        console.log("effect works")
    },[])


    //also need a var to show completedTask,then use a button to change the task state
    const uncompletedTasks:Task[] =   useMemo (() =>{ // maybe sometimes we need to show  the work both completed and uncompleted
        if(taskList){
           return  taskList.filter(task => !task.completed)
        }
        return  []
    },[taskList])

    const  completedTasks:Task[] =   useMemo (() =>{ // maybe sometimes we need to show  the work both completed and uncompleted
        if(taskList){
            return  taskList.filter(task => task.completed)
        }
        return  []
    },[taskList])


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
                            onSubmit={(e)=> {
                                handleCreateTaskSubmit(e)
                            }
                        }
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
                                onChange={(newValue) => {
                                    setDueDate(newValue)
                                    console.log("change to " + newValue as string)
                                }}

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

                    {
                        uncompletedTasks?.map((task)=> (

                                <Card key={task.id} className={styles.cardTaskItem}>
                                    <CardActionArea onClick={ ()=>{
                                        handleDetailTaskOpen(task)
                                    } } component="div">
                                        <ListItem className={styles.taskItem}
                                                  secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="edit"  onClick={
                                                    (e)=>{
                                                        e.stopPropagation()
                                                        handleEditTask(task)
                                                    }
                                                }>
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={
                                                    (e)=>{
                                                        e.stopPropagation()   //stop event propagation to prevent the parent click event
                                                        handleDeleteTask(task)
                                                    }
                                                }>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </>
                                        }
                                        >
                                            <div className={styles.taskTitle}>
                                                <p>{(task.module && task.module.name)}</p>
                                                <p> {(task.completed ? "Completed" : "In progress")}</p>

                                            </div>

                                            <ListItemText className={styles.taskButton} primary={task.title}
                                                          secondary={task.description}
                                            />



                                        </ListItem>
                                    </CardActionArea>
                                </Card>
                        )
                    )

                    }
                </List>
            </div>

            {/*任务详情界面，需要一些*/}
            <Dialog  open={detailTaskOpen} className={styles.taskDetail} onClose={handleDetailTaskClose}>
                <DialogTitle>
                    任务详情
                </DialogTitle>
                <DialogContent dividers>{
                    nowDetailTask && (
                            <TaskDetailCard task={nowDetailTask} isEditing={false}   />
                    )
                }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailTaskClose} autoFocus>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog >

            {/* without setting  onClose, we can not close the dialog when losing focus */}
            <Dialog  open={editTaskOpen} onClose={handleEditTaskClose}>
                <DialogTitle >
                    修改任务
                </DialogTitle>
                <DialogContent dividers>
                    {  
                    nowDetailTask && 
                  
                        <TaskDetailCard task={nowDetailTask } isEditing={true} onChange={setNowDetailTask }/>

                    }

                </DialogContent>
                <DialogActions>

                    <Button onClick={ handleEditTaskSubmit  } autoFocus>
                        提交
                    </Button>
                    <Button onClick={handleEditTaskClose} autoFocus>
                        关闭
                    </Button>
                </DialogActions>

            </Dialog>
        </div>
    </div>
    )
}

export default TaskPage
