import React from 'react';
import { Task,Subtask } from './types';
import { Card, CardContent, Button } from '@mui/material';
import { Box, TextField, Typography } from '@mui/material';
import { createSubtask } from '../../api/tasks';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { DateField, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { log } from 'console';
import utc from 'dayjs/plugin/utc';
import { dateUtils } from '../../utils/DateUtil';
interface CreateSubTaskCardProps {
    taskId: string; // ID of the parent task
    onSubmit:() => void; 
}

export default function CreateSubTaskCard( { taskId ,onSubmit   }: CreateSubTaskCardProps  ) {

     const [dueDateNow, setDueDate] = React.useState<string | null>(null);
    const [subTaskTitle, setSubTaskTitle] = React.useState('');
    dayjs.extend(utc)
        const handleCreateSubTask = (e:React.FormEvent<HTMLFormElement>) =>{ // I am not sure if it's right to  contennt 
            e.preventDefault()
            const formData =  new FormData(e.currentTarget)
            const taskData: Partial<Subtask> = {
                title: formData.get('title') as string,
                taskId:  taskId, // 关联的任务ID
                completed: false,
                id: "",
                dueDate :   dueDateNow? dateUtils.toBackendFormat(dueDateNow) : undefined
            } 
            createSubtask(taskId, taskData).then((res)=>{
                if(res){
                    //TODO('create the update success animation to alert user')
                }
                console.log("创建子任务成功",res)
            }).catch(
                (error)=>{
                    console.log("创建子任务失败",taskData)
                    console.log(error)  
                                }
            )
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
                               <LocalizationProvider dateAdapter={AdapterDayjs}>
                                
                                    <DatePicker label="Date"
                                        onChange={ 
                                            (datepicker) =>{
                                                setDueDate( dayjs(datepicker).utc().format("YYYY-MM-DDTHH:mm:ss") )
                                            }
                                        }  />
                               </LocalizationProvider>                     
                               </Box>
    );
}