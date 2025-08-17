import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { createModule } from '../../../api/tasks';
 
 
interface moduleProps {
    onSubmit?: () => void 
    onEditing :boolean
}

export default function ModuleCard  ({ onSubmit,onEditing = false  }:moduleProps)  {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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