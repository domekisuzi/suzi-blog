import React from 'react';
 
import { Card, CardContent, Button } from '@mui/material';
import { Box, TextField, Typography } from '@mui/material';
import { Subtask } from '../model/taskTypes';
 import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
interface subtaskProps {
    subtask: Subtask 
}

export default function SubtaskCard ({subtask}:subtaskProps ){
    
    return (
        <Card sx={{width:"85%",borderRadius:"12px"}}>
            <CardContent  sx={{   display: 'flex', flexDirection: 'row',margin:0,alignItems: 'center',justifyContent: 'space-between',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
            }}>
                <Box  display="flex"   flexDirection="row" >
                    {subtask.completed ? <CheckCircleOutlineOutlinedIcon sx={{ fill: 'green','&:hover': { fill: 'gray' }}} /> : <CheckCircleOutlineOutlinedIcon sx={{'&:hover': { fill: 'red' }}}/>} 
                    <Typography sx={{fontSize:"1em",marginLeft:"8px"}} >{subtask.title}</Typography> 
                </Box>
                {subtask.dueDate ?   <Typography variant="body2">Due at : {new Date(subtask.dueDate).toLocaleDateString()}</Typography> : "null"}
            </CardContent>

        </Card>
    )
}
