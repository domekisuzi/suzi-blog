import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { api } from '../../utils/APIUtils';
import { Module } from './types';
import { createModule } from '../../api/tasks';
import { withUUID } from '../../utils/DataWrap';
 
interface moduleProps {
    onSubmit?: () => void 
    onEditing :boolean
}

export default function ModuleCard  ({ onSubmit,onEditing = false  }:moduleProps)  {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // const handleCreate = async () => {
  //   if (!name.trim()) {
  //     setError('模块名称不能为空');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     createModule(name).then(
  //       (res ) =>{
  //           console.log(res,'submit module success!')
          
  //       }
  //     )
  //   } catch (e: any) {
  //     setError(e.response?.data?.message || '模块创建失败');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateSubTask = (e:React.FormEvent<HTMLFormElement>) =>{
 
                e.preventDefault()
                const formData =  new FormData(e.currentTarget)
                const nowName = formData.get('name') as string
                const module = createModule( nowName).then(
                  res=>console.log(res,'create success')
                ).catch(error => console.log(error))
  }
  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}
      id="createModuleForm"
      component="form"
      onSubmit={
        (e)=> {
               onSubmit?.()
               handleCreateSubTask(e)}}>
 
        <Typography variant="h6" gutterBottom>
          创建新模块
        </Typography>

        <TextField
          name='name'
          label="模块名称"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />

    </Box>
  );
}