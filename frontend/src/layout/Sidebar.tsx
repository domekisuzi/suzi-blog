import { Box } from '@mui/material'
import React from 'react'


// background: var(--primary-color);
    // border-radius: 1.1rem;
    // flex-grow: 0;
    // height: calc(100vh - 50px);
    // margin: 25px;
    // order: 1;
    // overflow-y: auto;
    // scroll-behavior: smooth;
    // scrollbar-width: none;
    // transition: .1s ease;
    // width: 260px;
    // z-index: 99999;
const Sidebar : React.FC=() => {

    return (
        <Box height="100vh"  width="260px">
            <Box  width="260px"　bgcolor="#484c7f"   borderRadius="1.1rem" 
                sx ={{ 'flex-grow': 0,height:'calc(100vh - 50px)', zIndex: 99999, transition:'.1s ease','overflow-y': 'auto',
                    'scroll-behavior': 'smooth','scrollbar-width': 'none',order:"1",position:"fixed", 
                    top:"22.5px"
                }}>


            </Box>
        </Box>
    )
}

export default Sidebar
