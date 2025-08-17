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
        )
    }, [])

    return (
        
        <Box>
            {moduleList.map(module => (
                <ModuleDetailCard key={module.id} module={module} />
            ))}
        </Box>
    );
};

export default ModulePage;