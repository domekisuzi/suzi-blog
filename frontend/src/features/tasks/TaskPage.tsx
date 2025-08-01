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
import {Module, Task, TaskPriority, TaskPriorityValues,Subtask} from "./types";
import styles from  "./TaskPage.module.css"
import {mockModules, mockTasks} from "../../utils/CrackData";
import {createTask, deleteTask, fetchTasks, updateTask} from "../../api/tasks";
import {withUUID} from "../../utils/DataWrap";
import TaskMain from "./TaskMain";
import TaskDetailCard from "./TaskDetailCard";
import { dateUtils } from '../../utils/DateUtil';
import CreateSubTaskCard from './CreateSubTaskCard';
import CreateTaskCard from './CreateTaskCard';
//  后续再设计是否会有页面方面的内容
//  先防止module列表，改为其他格式吧


const TaskPage: React.FC=() => {

    // const taskList:Task[] = mockTasks
    const moduleList:Module[] = mockModules


    const [createTaskOpen,setCreateTaskOpen] = React.useState(false) // 声明组件级别状态声明变量，去open是状态，setOpen是更新状态的函数， false是设置的初始值
    const [detailTaskOpen,setDetailTaskOpen] = React.useState(false)
    
    const [createSubTaskOpen,setCreateSubTaskOpen] = React.useState(false) // this is used for creating sub task, it is not used now, but may be used in the future


    // used  for detail task
    const [nowDetailTask,setNowDetailTask] = React.useState< Task| null>(null)
    const [taskList,setTaskList] = React.useState <Task[]|null>(null)

    const [editTaskOpen,setEditTaskOpen] = React.useState(false)


    const handleCreateSubTaskOpen = (task:Task) => {
        setNowDetailTask(task)
        setCreateSubTaskOpen(true);
    }
    const handleCreateSubTaskClose = () => {
        setCreateSubTaskOpen(false);
    };
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
    
    const handleCreateTaskSubmit = ( ) =>{
        
        handleCreateTaskClose()
        freshTasksList()  
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

    const handleCreateSubTaskSubmit = ()=>{
        handleCreateSubTaskClose()
        freshTasksList()  
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
                    <CreateTaskCard  onSubmit={handleCreateTaskSubmit}/>
            
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
                            <ListItem key={task.id}  sx={
                                 { padding:0,alienItems:'stretch'}
                            } >
                                <TaskMain sx={{margin:1,width:'400px'}}
                                            task={task}
                                            onClick={() => handleDetailTaskOpen(task)}
                                            onDelete={handleDeleteTask}
                                            onEdit={handleEditTask}
                                            addSubTaskClick={() => handleCreateSubTaskOpen(task) }
                                            />
                            </ListItem>
                                 
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

           

            <Dialog  open={createSubTaskOpen} onClose={handleCreateSubTaskClose}>
                <DialogTitle >
                    添加子任务
                </DialogTitle>
                <DialogContent dividers>
                    {  
                    nowDetailTask && 
                  
                        <CreateSubTaskCard   taskId={nowDetailTask.id}  onSubmit={handleCreateSubTaskSubmit}  />

                    }

                </DialogContent>
                <DialogActions>

                   <Button type="submit" form="createSubTaskForm">
                        提交
                    </Button>
                    <Button onClick={handleCreateSubTaskClose} autoFocus>
                        关闭
                    </Button>
                </DialogActions>

            </Dialog>
        </div>

        <table  className={styles.table2} >
            <tr>
                <td>
                
                <table className={styles.table3} >
                    <tr><th>表格A</th></tr>
                    <tr><td>数据1</td></tr>
                    <tr><td>数据2</td></tr>
                </table>
                </td>

                <td>
                
                <table className={styles.table1}  >
                    <tr><th>表格B</th></tr>
                    <tr><td>数据A</td></tr>
                    <tr><td>数据B</td></tr>
                </table>
                </td>
            </tr>
            </table>

 

    </div>

    
    )
}

export default TaskPage
