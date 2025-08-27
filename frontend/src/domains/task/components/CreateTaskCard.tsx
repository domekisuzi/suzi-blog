 
import React, { useEffect } from 'react';
import { Backdrop, Card, CardContent,CircularProgress,Divider} from '@mui/material';
import { Box, TextField, Typography, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
 
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
 
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
 
import { Task, TaskPriority, TaskPriorityValues } from '../model/taskTypes';
 
import { dateUtils } from '../../../shared/utils/DateUtil';
import { withUUID } from '../../../shared/utils/DataWrap';
import { createTask } from '../api/taskApi';
import { fetchModules } from '../../module/api/moduleApi';
import { Module } from '../../module/model/module';
import { set } from 'date-fns';
import { useLoading } from '../../../context/LoadingContext';
import { se } from 'date-fns/locale';
interface Props {
    onSubmit:(task:Task) => void

}



export default function CreateTaskCard({onSubmit}:Props ) {
    const [dueDate, setDueDate] = React.useState<string | null>(null);
    const [moduleList, setModuleList] = React.useState<Module[] | null>(null);
    const { loading, setLoading } = useLoading()
    dayjs.extend(utc)
     useEffect(() => {
            setLoading(true)
            fetchModules().then(res=>{
                setModuleList(res)
                setLoading(false)
            }
        ).catch(error=>console.log(error))
    },[])

    // if(loading){
    //     return (<Backdrop open={loading} sx={{ zIndex: 999 }}>
    //                 <CircularProgress color="inherit" />
    //             </Backdrop>)
    // }

    return moduleList &&  (
       <Card> 
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
                               <Box
                                   id="createTaskForm"
                                   component="form"
                                   onSubmit={(e)=> {
                                    e.preventDefault()
                                    setLoading(true)
            const formData =  new FormData(e.currentTarget)
            
            const moduleName  =   formData.get('moduleId') as string 
            const taskData :Task = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                moduleName: (moduleName === '') ? undefined : moduleName ,
                completed: false,
                id: "",
                createdAt: "",
                priority: formData.get("taskPriority") as TaskPriority,
                dueDate: dueDate? dateUtils.toBackendFormat(dueDate) : undefined// 这里需要转换为后端格式
            }
            createTask(withUUID<Task>(taskData) ).then((res)=>{
                if(res){
                    //TODO('create the update success animation to alert user')
                    onSubmit(taskData)
                    setLoading(false)
                }
                
                console.log("创建任务成功",res)
                    }).catch(
                        (error)=>{
                            console.log("创建任务失败")
                            console.log(error)
                            setLoading(false)
                        }
                    )
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
       
                                   <TextField name="title" variant="standard" label="任务标题" required defaultValue={''} />
                                   <TextField
                                       name="description"
                                       variant="standard"
                                       label="任务描述"
                                       multiline
                                       minRows={2}
                                       defaultValue={''}
                                   />
       
                                   <Divider sx={{ my: 1 }} />
                                   <Typography variant="subtitle1" fontWeight={600}>
                                       ⚙️ 任务设置
                                   </Typography>
       
                                      <TextField
                                       name="moduleId"
                                       select
                                       variant="standard"
                                       label="模块（可选）"
                                       defaultValue={moduleList ? moduleList[0].name : ''}
                                   >
                                        {  (
                                            moduleList.map(({ id, name }) => (
                                            <MenuItem key={id} value={name}>
                                                {name}
                                            </MenuItem>
                                            ))
                                        ) }
                                   </TextField>
                                    
       
                                   <TextField
                                       name="taskPriority"
                                       select
                                       variant="standard"
                                       label="优先级"
                                       required
                                       defaultValue={TaskPriorityValues[0]}
                                   >
                                       {TaskPriorityValues.map((data) => (
                                           <MenuItem key={data} value={data}>
                                               {data.charAt(0).toUpperCase() + data.slice(1)}
                                           </MenuItem>
                                       ))}
                                   </TextField>
       
                                   <DatePicker
                                       
                                       onChange={(newValue) => {
                                           setDueDate( dayjs(newValue).utc().format("YYYY-MM-DDTHH:mm:ss") )
                                       }}
       
                                   />
                               </Box>
                           </LocalizationProvider>
        </CardContent>
      
       </Card> 
    )
}