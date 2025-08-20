//this card is used to show vo layer modue, contains all kind of statistics
import React from 'react';
 
import {   Card, CardContent, Typography, TextField, Button, CircularProgress, SvgIcon, CardHeader, Box, Divider, LinearProgress } from '@mui/material';
import { mockModuleDetailVo, ModuleDetailVo } from '../model/module';
import { parseSvgToJson } from '../../../shared/utils/parseSvgToJson';
import { renderSvgNode } from '../../../shared/utils/renderSvg';

interface ModuleDetailProps {
    module?:ModuleDetailVo 
    sx?: React.CSSProperties
}
const ModuleDetailCard = ({ module = mockModuleDetailVo, sx }: ModuleDetailProps) => {

    const nodeJson  = module.iconSVG ?    parseSvgToJson( module.iconSVG) : null
    if (nodeJson && nodeJson.attrs) {
        if(!nodeJson.attrs.viewBox){
            nodeJson.attrs.viewBox = '0 0 24 24'; // if viewBox is not set, provide a default
        }
    }

    return (
        <Card variant='outlined' sx ={{ overflow:"visible" ,...sx}}  >
          
            <CardHeader  sx={{  display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center"}}
                avatar={
                    <Card  sx={{position: "relative",top:"-30px",backgroundColor:"#a7daff" ,width: '60px !important', height: '60px !important'}}>
                        <SvgIcon  sx={{fill:"black" , width: '60px !important', height: '60px !important'}}  >
                            {nodeJson && renderSvgNode(nodeJson)}
                        </SvgIcon>
                    </Card>
                }
            />

            <CardContent>
                <Typography variant="h6">{module.name}</Typography>
                <Typography variant="body2">Created At: {module.createdAt}</Typography>
                <Typography variant="body2">Tasks: {module.taskNumber}</Typography>
                <Typography variant="body2">Subtasks: {module.subtaskNumber}</Typography>
                <Typography variant="body2">Completed Tasks: {module.completedTaskNumber}</Typography>
                <Typography variant="body2">Completed Subtasks: {module.completedSubtaskNumber}</Typography>
                <Divider sx={{ my: 1 }} />
                <LinearProgress variant="determinate" value={parseFloat(module.completedRate)} />
            </CardContent>
        </Card>
    )
}


export default ModuleDetailCard;
