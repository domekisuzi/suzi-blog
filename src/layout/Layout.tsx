import React from 'react'
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Layout.module.css"
const Layout: React.FC<{ children: React.ReactNode }> = ({children}  ) => {
    return(
        <div className="container">
            <Header/>
            <div>{children}</div>
            <Sidebar/>
        </div>
)
}

export default Layout
