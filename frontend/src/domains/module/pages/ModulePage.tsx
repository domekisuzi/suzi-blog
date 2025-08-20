import React, { useEffect } from 'react'
import { Box } from '@mui/material';
import ModuleDetailCard from '../components/ModuleDetailCard';
import { fetchModuleDetails } from '../api/moduleApi';
import { ModuleDetailVo } from '../model/module';
import { set } from 'date-fns';
 
const ModulePage = () => {
    const [moduleList, setModuleList] = React.useState<ModuleDetailVo[]>([]);

    useEffect(() => {
        fetchModuleDetails().then(
            res=>{
                setModuleList(res);
                console.log(res,'module details fetched successfully');
            }
        ).catch(e=>{
            console.error(e,'module details fetched failed');
        })
    }, [])

    return (

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 ,justifyContent:'space-between'  ,flexWrap:'wrap'}}>
            {moduleList.map(module => (
                <ModuleDetailCard sx={{  flex: '0 0 30%', maxWidth: '30%'}} key={module.id} module={module} />
            ))}
        </Box>
    );
};

export default ModulePage;