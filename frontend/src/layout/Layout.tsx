import React from 'react'
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from  "./Layout.module.css"
const Layout: React.FC<{ children: React.ReactNode }> = ({children}  ) => {

//    使用React.Fragment 会使得渲染加快但是并不清楚其中的副作用
//     return(
//         <div className={styles.container}>
//             <Header/>
//             <div>{children}</div>
//             <Sidebar/>
//         </div>
// )
    return(
        <>
            <Header/>
            <div>{children}</div>
            <Sidebar/>
        </>
    )
}

export default Layout
