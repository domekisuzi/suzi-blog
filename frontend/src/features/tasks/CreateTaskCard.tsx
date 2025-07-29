 
import React from 'react';
import { Card, CardContent,Divider} from '@mui/material';
import { Box, TextField, Typography, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {  mockModules } from '../../utils/CrackData'; // Assuming these are defined in a mockData file
import { Task, TaskPriority, TaskPriorityValues} from "./types";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {createTask} from "../../api/tasks";
import {withUUID} from "../../utils/DataWrap"; 
import { dateUtils } from '../../utils/DateUtil';
interface Props {

    onSubmit:() => void
}



export default function CreateTaskCard({onSubmit}:Props ) {
    const [dueDate, setDueDate] = React.useState<Date | null>(null);



    const handleCreateTaskSubmit = (e:React.FormEvent<HTMLFormElement>) =>{ // I am not sure if it's right to  contennt 
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
                }
                // console.log(taskData.dueDate)
                console.log("创建任务成功")
            }).catch(
                (error)=>{
                    console.log("创建任务失败")
                    console.log(error)
                }
            )
            
        }

    return (
       <Card> 
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
                               <Box
                                   id="createTaskForm"
                                   component="form"
                                   onSubmit={(e)=> {
                                       onSubmit()
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
        </CardContent>
      
       </Card> 
    )
}