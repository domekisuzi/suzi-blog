import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { createModule } from '../api/moduleApi'; 
import { Module } from '../model/module';
 
 
 
 
interface moduleProps {
    onSubmit?: (module:Module) => void 
    onEditing :boolean
}

export default function ModuleCard  ({ onSubmit,onEditing = false  }:moduleProps)  {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}
      id="createModuleForm"
      component="form"
      onSubmit={
        (e)=> {
              e.preventDefault()
              const formData =  new FormData(e.currentTarget)
              const nowName = formData.get('name') as string
              createModule( nowName).then(
                  res=>{
                  console.log(res,'create success')
                  onSubmit?.(res)
                }
                ).catch(error => console.log(error))
               
               }}>
 
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