import Layout from '../layout/Layout'
 
import React from "react";
import styles from "./layout/Layout.module.css";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import AppRoutes from './router';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useLoading } from '../context/LoadingContext';


const App = () =>{ 
    
    const { loading, setLoading } = useLoading()
    return (
        <Layout>
            <Backdrop open={loading} sx={{ zIndex: 9999 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        <AppRoutes/>
    </Layout>
    )
}
export default App