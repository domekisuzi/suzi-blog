import React from 'react';
import { Task } from './types';
import { Card,CardContent,Button} from '@mui/material';
import Typography from '@mui/material/Typography';
import { dateUtils } from '../../utils/DateUtil';
import { Box } from '@mui/system';
import Chip from '@mui/material/Chip';  
import Divider from '@mui/material/Divider';
import EventIcon from '@mui/icons-material/Event';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FolderIcon from '@mui/icons-material/Folder';
import DoneIcon from '@mui/icons-material/Done';
import CardActionArea from '@mui/material/CardActionArea';


interface Props {
    task: Task
    onDelete:(nowTask: Task) => void  
    onEdit: (nowTask: Task) => void  
    onClick: () => void // this function is used for clicking the task, it is optional, if not set, the task will not be clickable
    sx ?: React.CSSProperties // this is used for setting the style of the task card, it is optional, if not set, the default style will be used
}
/**
 * component for displaying the main task information,and is used in the task list
 * @param task   give a task object, which is used to display the task information
*  @returns 
 */

export default function TaskMain({task,onClick,onDelete,onEdit,sx}:Props){

    return (    
           <Card  sx={sx} >
            <CardActionArea  component="div" onClick={onClick} >
                    <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FolderIcon color='primary' sx={{ fontSize: 16 }} />
                            <Typography variant="subtitle2" color="text.secondary">{task.module ? task.module.name : "" }</Typography>
                        </Box>
                    <Chip
                        label={task.completed ? "Completed" : "In Progress"}
                        icon={task.completed ? <DoneIcon /> : <AccessTimeIcon/>}
                        color={task.completed ? "success" : "warning"}
                        size="small"
                    />
                    </Box>
                    
                    <Box alignItems="center" display="flex" justifyContent="space-between"  mb={1}>
                        <Typography  variant="h6" gutterBottom>
                            {task.title}
                        </Typography>
                        <Button variant="outlined" size="small" color="success"  >
                            Add Subtask
                        </Button>   
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1} justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                    {task.description}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>


                    <IconButton edge="end" aria-label="edit"  onClick={
                                                    (e)=>{
                                                        e.stopPropagation()
                                                        onEdit(task) // call the onEdit function if it is set
                                                    }
                                                }>
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={
                                                    (e)=>{
                                                        e.stopPropagation()   //stop event propagation to prevent the parent click event
                            
                                                        onDelete(task) // call the onDelete function if it is set
                                                    }
                                                }>
                                                    <DeleteIcon/>
                                                </IconButton>
                                                </Box> 
                    </Box>
                    <Divider sx={{ my: 1 }} />

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <EventIcon fontSize="small" />
                        <Typography variant="body2">
                            {
                                task.dueDate  
                            }
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        {/* 自定义优先级图标 */}
                        {task.priority === "high" && <PriorityHighIcon sx={{ color: 'red' }} />}
                        {task.priority === "medium" && <ArrowUpwardIcon sx={{ color: 'orange' }} />}
                        {task.priority === "low" && <ArrowDownwardIcon sx={{ color: 'gray' }} />}
                        <Typography variant="body2">{task.priority}</Typography>
                    </Box>
                    </Box>
                    <Box mt={1}>
                        <LinearProgress sx={{borderRadius:5, height:10, 
                        backgroundColor: '#e0e0e0'}} 
                        variant="determinate"
                        value={task.completed ? 100 : 40} />
                    </Box>
                  
                </CardContent>
            </CardActionArea>
               
        </Card>
    )
}

