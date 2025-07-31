import React from 'react';
import { Task,Subtask } from './types';
import { Card, CardContent, Button } from '@mui/material';
import { Box, TextField, Typography } from '@mui/material';
import { createSubtask } from '../../api/tasks';



interface CreateSubTaskCardProps {
    taskId: string; // ID of the parent task
    onSubmit:() => void; 
}

export default function CreateSubTaskCard( { taskId ,onSubmit   }: CreateSubTaskCardProps  ) {

    const [subTaskTitle, setSubTaskTitle] = React.useState('');

        const handleCreateSubTask = (e:React.FormEvent<HTMLFormElement>) =>{ // I am not sure if it's right to  contennt 
            e.preventDefault()
            const formData =  new FormData(e.currentTarget)
            const taskData:Subtask = {
                title: formData.get('title') as string,
                taskId:  taskId, // 关联的任务ID
                completed: false,
                id: "",
                createdAt: "",
                updatedAt:"",    
            } 
            createSubtask(taskId, { title: taskData.title }).then((res)=>{
                if(res){
                    //TODO('create the update success animation to alert user')
                }
                console.log("创建子任务成功")
            }).catch(
                (error)=>{
                    console.log("创建子任务失败")
                    console.log(error)
                }
            )

            // createTask(withUUID<Task>(taskData) ).then((res)=>{
            //     if(res){
            //         //TODO('create the update success animation to alert user')
            //     }
            //     // console.log(taskData.dueDate)
            //     console.log("创建任务成功")
            // }).catch(
            //     (error)=>{
            //         console.log("创建任务失败")
            //         console.log(error)
            //     }
            // )
            
        }

    return (
         <Box
                                   id="createSubTaskForm"
                                   component="form"
                                   onSubmit={(e)=> {
                                       onSubmit()
                                       handleCreateSubTask(e)
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
                                   
                                   <TextField name="title" variant="standard" label="子任务描述" required />
                               </Box>
    );
}