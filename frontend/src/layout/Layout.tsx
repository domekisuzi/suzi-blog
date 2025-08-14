import React from 'react'
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box } from '@mui/material'; 
const Layout: React.FC<{ children: React.ReactNode }> = ({children}  ) => {

    return(
        <Box bgcolor="#eee" sx={{display: 'flex',  alignItems: 'center'}}>
            <Sidebar/>
            <Box sx={{flexGrow: 1, padding: 2, flex:1, minHeight: '100vh'}}>
                <Header/>
                <div>{children}</div>
            </Box>
        </Box>
    )
}

export default Layout
