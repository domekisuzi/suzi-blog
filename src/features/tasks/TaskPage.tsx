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
    DialogContentText, DialogContent, Box, MenuItem
} from "@mui/material";
import {Module, Task} from "./types";
import styles from  "./TaskPage.module.css"
import {mockModules, mockTasks} from "../../utils/CrackData";
import {useNavigate} from "react-router-dom";
import DialogContext from "@mui/material/Dialog/DialogContext";


//  后续再设计是否会有页面方面的内容
//  先防止module列表，改为其他格式吧


const TaskPage: React.FC=() => {


    const taskList:Task[] = mockTasks
    const moduleList:Module[] = mockModules

    const navigate=   useNavigate( )
    const [open,setOpen] = React.useState(false) // 声明组件级别状态声明变量，去open是状态，setOpen是更新状态的函数， false是设置的初始值
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = (e:React.FormEvent) =>{
        e.preventDefault()
        alert("solve submit!")
        handleClose()
    }

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
            <Button   variant= "contained" onClick={handleClickOpen}> New Task</Button>
            <Dialog open={open}
            onClose={handleClose}
            >
                <DialogTitle>
                    {"创建任务"}
                </DialogTitle>
                <DialogContent>
                    <Box  id="taskForm" component="form" onSubmit={handleSubmit}

                          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' },
                              "display":"flex",
                              "flex-direction":"column"
                         }}
                    >
                        <TextField  variant="standard" label="Title"/>
                        <TextField  variant="standard" label="Description"/>
                        <TextField  select variant="standard" label="Module" placeholder="可选">
                            {
                                mockModules.map((data)=>(
                                    <MenuItem key={data.id} value={data.id}>
                                        {data.name}
                                    </MenuItem>
                                ))
                            }
                        </TextField>

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" form="taskForm">
                        提交
                    </Button>
                    <Button onClick={handleClose} autoFocus>
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
                        <ListItem key={task.id} className={styles.taskItem}>
                            <div className={styles.taskTitle}>
                              <p>{(task.module && task.module.name)}</p>
                                <p> {( task.completed? "Completed":"In progress")  }</p>
                            </div>

                            <ListItemText  className={styles.taskButton}  primary={task.title}
                                          secondary={task.description}
                            />
                        </ListItem>)
                    )}

                </List>
            </div>
        </div>
    </div>
    )
}

export default TaskPage
