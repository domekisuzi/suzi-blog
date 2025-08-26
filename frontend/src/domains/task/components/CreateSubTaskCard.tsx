 import dayjs, { Dayjs } from 'dayjs';
import { DateField, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { log } from 'console';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import { Subtask } from '../model/taskTypes';
import { dateUtils } from '../../../shared/utils/DateUtil';
 
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import { createSubtask } from '../api/taskApi';
 
interface CreateSubTaskCardProps {
    taskId: string; // ID of the parent task
    onSubmit:(subtask: Partial<Subtask>) => void; 
}

export default function CreateSubTaskCard( { taskId ,onSubmit   }: CreateSubTaskCardProps  ) {

    const [dueDateNow, setDueDate] = React.useState<string | null>(null);
    const [subTaskTitle, setSubTaskTitle] = React.useState('');
    dayjs.extend(utc)
         
    return (
         <Box
                                   id="createSubTaskForm"
                                   component="form"
                                   onSubmit={(e)=> {
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
                                                onSubmit(res)
                                            }
                                            console.log("创建子任务成功",res)
                                        }).catch(
                                            (error)=>{
                                                console.log("创建子任务失败",taskData)
                                                console.log(error)  
                                                }
                                        )

                                       onSubmit(taskData )
                                       
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