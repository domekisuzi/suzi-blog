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
    Typography, DialogContent, Box, MenuItem, Card, ListItemIcon, Divider, Chip, CardActionArea, IconButton,
    Backdrop,
    CircularProgress
} from "@mui/material";
import {  Task, TaskPriority, TaskPriorityValues,Subtask, TaskDetailVo} from "../model/taskTypes";
import styles from  "./TaskPage.module.css"
import {mockModules, mockTasks} from "../../../shared/utils/CrackData";
import {fetchTasks, deleteTask, updateTask, getAllTaskVos} from '../api/taskApi';
import {withUUID} from "../../../shared/utils/DataWrap";
import TaskMain from "../components/TaskMain";
import TaskDetailCard from '../components/TaskDetailCard';
import { dateUtils } from '../../../shared/utils/DateUtil';
import CreateSubTaskCard from '../components/CreateSubTaskCard';
import CreateTaskCard from '../components/CreateTaskCard';
import ModuleCard from  '../../module/components/ModuleCard';
import MouduleListCard from '../../module/components/ModuleListCard';
import { fetchModules } from '../../module/api/moduleApi';
import { set } from 'date-fns';
import { Module } from '../../module/model/module';
import { useLoading } from '../../../context/LoadingContext';
//  后续再设计是否会有页面方面的内容
//  先防止module列表，改为其他格式吧


const TaskPage: React.FC=() => {
 
    const {loading,setLoading} = useLoading()
    const [createTaskOpen,setCreateTaskOpen] = React.useState(false) // 声明组件级别状态声明变量，去open是状态，setOpen是更新状态的函数， false是设置的初始值
    const [detailTaskOpen,setDetailTaskOpen] = React.useState(false)
     
    const [createSubTaskOpen,setCreateSubTaskOpen] = React.useState(false) // this is used for creating sub task, it is not used now, but may be used in the future

    const [selectedModuleId, setSelectedModuleId] = React.useState<string | undefined>(undefined);


    

    // used  for detail task
    const [nowDetailTask,setNowDetailTask] = React.useState< Task| null>(null)
    const [nowDetailTaskVo,setNowDetailTaskVo] = React.useState<TaskDetailVo | null>(null)
    const [taskList,setTaskList] = React.useState <Task[]|null>(null)
    const [detailTaskVoList,setDetailTaskVoList] = React.useState<TaskDetailVo[] | null>(null)
    const [moduleList,setModuleList] = React.useState <Module[]|null>(null)
    
    const [editTaskOpen,setEditTaskOpen] = React.useState(false)


    const [createModuleOpen,setCreateModuleOpen]  = React.useState(false)


    const handleCreateModuleOpen =  ()=>{
        setCreateModuleOpen(true)
    }
    const handleCreateModuleClose = () =>{
        setCreateModuleOpen(false)
    }
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
    
        if (window.confirm("Are you sure you want to delete this task?")) {
            setLoading(true)
            deleteTask(task.id).then(
                ()=>{
                    freshTaskVoList()
                    freshTasksList()
                    setTaskList(pre => pre ?  pre.filter(t =>t.id !== task.id ):[])
                }
            ).finally(()=>{
                setLoading(false)
            })
        }
        setTaskList(pre => pre ?  pre.filter(t =>t.id !== task.id ):[])
    }

 
    const handleCreateModuleSubmit = (module: Module ) => {
        
        handleCreateModuleClose()
        setModuleList(pre => pre ? [...pre, module] : [module])
     }
    const handleCreateTaskSubmit = (task:Task ) =>{
        
        handleCreateTaskClose()
        setTaskList(pre => pre ? [...pre, task] : [task])
        freshTaskVoList()
        freshTasksList()
    }

    const handleEditTaskSubmit = ()=>{
        setLoading(true)
        if(nowDetailTask) {
            updateTask(nowDetailTask.id, nowDetailTask).then(() => {
                console.log("update success!",nowDetailTask)
                setTaskList(pre =>
                pre
                    ? pre.map(task =>
                        task.id === nowDetailTask?.id
                        ? { ...nowDetailTask } // 保证新引用
                        : task
                    )
                    : []
                )
                //TODO('create the update success animation to alert user')
                freshTasksList()
                freshTaskVoList()//works ! 
                setLoading(false)
                setEditTaskOpen(false)
            }).catch(error => {
                console.log("update failed", error)
                setEditTaskOpen(false)
                setLoading(false)
            })
        }
        else{
            console.log("update failed, item does not exist")
            setEditTaskOpen(false)
        }
    }

    const handleCreateSubTaskSubmit = (subtask:  Partial<Subtask> )=>{
        handleCreateSubTaskClose()
        //TODO add fresh logic 
        subtask.id = subtask.id ? subtask.id : 'd3b6eb33-f38a-4f83-b618-f17483b1e152' // if the id is not exist, set it to empty string 
        setNowDetailTask(pre => {
            if(pre) {
                 const res =  {
                    ...pre,
                    subtasks: [...(pre.subtasks || []), subtask as Subtask] // can resistant this because the card do not to show something
                }
                console.log("测试下创建",res)
                setTaskList(pre => pre ? pre.map(task => task.id === nowDetailTask?.id ? res : task) : [])
                freshTaskVoList()//it works ! 
                return res
            }
            return pre
        }) 
       
       
    }

    const freshModuleList = () =>{
        fetchModules().then(
            (res:Module[]) =>{
                console.log(res)
                setModuleList(res ? res:null)
            }
        ).catch(error=>console.error("获取module失败",error ))
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
    const freshTaskVoList = () => {
        getAllTaskVos().then(
            (res) => {
                console.log("测试下taskVo",res)
                setDetailTaskVoList(res)
            }
        ).catch(
            (error) => {
                console.error("获取任务视图失败", error)
            }
        )
    }

    useEffect(()=>{
        freshTasksList()
        freshModuleList()
        freshTaskVoList()
        console.log("init task page success!")
    },[])

    return(
    <div className={styles.container}>
        {/* <Backdrop open={loading} sx={{ zIndex: 9999 }}>
            <CircularProgress color="inherit" />
        </Backdrop> */}
        this is TaskPage
        <h1>
            Work Plan
        </h1>
        <div className={styles.header}>
            <span className={styles.headerItem}>
                 Manage your tasks and projects efficiently
            </span>
            <Button variant='contained' onClick={handleCreateModuleOpen}>new Module </Button>
            <Button   variant= "contained" onClick={handleCreateTaskOpen}> New Task</Button>


            <Dialog open={createModuleOpen}
                onClose={handleCreateModuleClose}
                >
                    <DialogTitle>
                        {"创建模块"}
                    </DialogTitle>
                    <DialogContent>
                        <ModuleCard onEditing={false} onSubmit={handleCreateModuleSubmit}/>
                    </DialogContent>

                    <DialogActions>
                        <Button type="submit" form="createModuleForm">
                            提交
                        </Button>
                        <Button onClick={handleCreateModuleClose} autoFocus>
                            关闭
                        </Button>
                    </DialogActions>
            </Dialog>

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
            {/* <div className={styles.module}>
                    <MouduleListCard  modules={moduleList}  onSelect={handleModuleSelect}  selectedModuleId={selectedModuleId}/>
            </div> */}
            <div className={styles.tasks}>
                <List className={styles.taskRoot}>

                    {
                        detailTaskVoList?.map((task)=> ( 
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
                            <TaskDetailCard task={ nowDetailTask} isEditing={false}   />
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
    </div>
    )
}

export default TaskPage
