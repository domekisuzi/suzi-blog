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
        <Card  >
            <CardContent  sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6" >{subtask.title}</Typography>
                <Typography variant="body2">{subtask.completed ? <CheckCircleOutlineOutlinedIcon sx={{ fill: 'green' }} /> : <CheckCircleOutlineOutlinedIcon sx={{'&:hover': { fill: 'red' }}}/>}</Typography>
            </CardContent>
        </Card>
    )
}