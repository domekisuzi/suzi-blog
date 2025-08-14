import { Box } from '@mui/material'
import React from 'react'
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
const Sidebar : React.FC=() => {
    const [open, setOpen] = React.useState(true);
//  "#484c7f"    rgb(59 130 246 / .5)
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <Box height="100vh"  width="260px">
                <List              
            sx ={{ 'width' :"260px", 'backgroundColor':"rgb(59 130 246 / .5)",  'borderRadius':"1.1rem" ,'flex-grow': 0,height:'calc(100vh - 50px)', zIndex: 99999, transition:'.1s ease','overflow-y': 'auto',
                    'scroll-behavior': 'smooth','scrollbar-width': 'none',order:"1",position:"fixed", 
                    top:"22.5px"}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader sx={{'backgroundColor':"rgb(59 130 246 / .5)"}} component="div" id="nested-list-subheader">
                Nested List Items
                </ListSubheader>
            }
            >
            <ListItemButton>
                <ListItemIcon>
                <SendIcon />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
            </ListItemButton>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                    <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Starred" />
                </ListItemButton>
                </List>
            </Collapse>
            </List>        
        </Box>
    )
}

export default Sidebar
