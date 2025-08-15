import { Box, SvgIcon } from '@mui/material'
import React from 'react'
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
 
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
 

import {ReactComponent as  BookListIcon }from '../asserts/icon/booklist.svg'
import {ReactComponent as  ModuleIcon} from '../asserts/icon/module.svg'
import {ReactComponent as  TaskIcon} from '../asserts/icon/task.svg'
import {ReactComponent as SubTaskIcon} from '../asserts/icon/subtask.svg'
import{ReactComponent as  StatisticsIcon} from '../asserts/icon/statistics.svg'
import {ReactComponent as ProjectIcon } from '../asserts/icon/project.svg'
import { useNavigate } from "react-router-dom";

const Sidebar : React.FC=() => {
    const [open, setOpen] = React.useState(true);
//  "#484c7f"    rgb(59 130 246 / .5)
    const handleClick = () => {
        setOpen(!open);
    };
    const navigate = useNavigate();

    return (
        <Box height="100vh"  width="260px">
                <List              
            sx ={{ 'width' :"260px", 'backgroundColor':"rgb(59 130 246 / .5)",  'borderRadius':"1.1rem" ,'flex-grow': 0,height:'calc(100vh - 50px)', zIndex: 99999, transition:'.1s ease','overflow-y': 'auto',
                    'scroll-behavior': 'smooth','scrollbar-width': 'none',order:"1",position:"fixed", 
                    top:"22.5px"}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader  onClick={() => navigate('/statistics')} sx={
                    {'backgroundColor':"rgb(59 130 246 / .5)" ,alignItems:'center',justifyContent:"center"
                        ,display:"flex",
                    }
                    
                    }component="div" id="nested-list-subheader">
                        
                    <SvgIcon  sx={{height:"3em",width:"3em",margin:"5px",   cursor: "pointer",  
                    "&:hover": {color: "#FFD700", },}} component={StatisticsIcon}  inheritViewBox />  
                </ListSubheader>
            }
            >
             <ListItemButton onClick={() => navigate('/books')  }>
                <ListItemIcon>
                 <SvgIcon component={BookListIcon}  inheritViewBox/>
                </ListItemIcon>
                <ListItemText primary="Book List" />
            </ListItemButton>

            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                 <SvgIcon component={ProjectIcon}  inheritViewBox/>
                </ListItemIcon>
                <ListItemText primary="Project" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/modules')}>
                    <ListItemIcon>
                    <SvgIcon component={ModuleIcon}  inheritViewBox/>
                    </ListItemIcon>
                    <ListItemText primary="Module" />
                </ListItemButton>
                 <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/tasks')}>
                    <ListItemIcon>
                    <SvgIcon component={TaskIcon}  inheritViewBox/>
                    </ListItemIcon>
                    <ListItemText primary="Task" />
                </ListItemButton>
                 <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/subtasks')}>
                    <ListItemIcon>
                    <SvgIcon component={SubTaskIcon}  sx={{color:"#222"}} inheritViewBox/>
                    </ListItemIcon>
                    <ListItemText primary="Subtask"   />
                </ListItemButton>
                </List>
            </Collapse>
            </List>        
        </Box>
    )
}

export default Sidebar
