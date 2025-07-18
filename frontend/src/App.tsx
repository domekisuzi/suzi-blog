import Layout from './layout/Layout'
import AppRoutes from './router'
import React from "react";
import styles from "./layout/Layout.module.css";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";


const App = () => (
    <Layout>
        <AppRoutes/>
    </Layout>
)
export default App