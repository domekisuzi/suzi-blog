import React from 'react'
import {Button, List, ListItem, ListItemText} from "@mui/material";
import {Module, Task} from "./types";
import styles from  "./TaskPage.module.css"
import {mockModules, mockTasks} from "../../utils/CrackData";

// export interface Task {
//     id: string
//     title: string
//     description?: string
//     completed: boolean
//     priority?: TaskPriority
//     dueDate?: string
//     createdAt: string
//     updatedAt?: string
//     subtasks?: Subtask[]
//     categoryId?: string
// }
const TaskPage: React.FC=() => {


    const taskList:Task[] = mockTasks
    const moduleList:Module[] = mockModules

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

            <Button   variant={"contained"}>New Task</Button>
        </div>
        <div className={styles.taskSection}>
            <div className={styles.module}>

                <h2>
                    Modules
                </h2>
                <List>
                    {moduleList.map((module)=>(
                        <ListItem key={module.id} className={styles.moduleItem}>
                            <ListItemText primary={module.name}/>
                        </ListItem>
                    ))}

                </List>
            </div>
            <div className={styles.tasks}>
                <List>
                    {taskList.map((task)=>(
                        <ListItem key={task.id} className={styles.taskItem}>
                            <div className={styles.taskTitle}>
                              <p>{(task.module && task.module.name)}</p>
                                <p> {( task.completed? "Completed":"In progress")  }</p>
                            </div>

                            <ListItemText primary={task.title}
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
