import React from 'react';
import { Task,Subtask } from './types';



interface CreateSubTaskCardProps {
    taskId: string; // ID of the parent task
    onCreate: (subtask: Subtask) => void; // Callback to handle the creation of a subtask
}

export default function CreateSubTaskCard( { taskId ,onCreate  }: CreateSubTaskCardProps  ) {

    const [subTaskTitle, setSubTaskTitle] = React.useState('');

    const handleCreateSubTask = () => {
        if (subTaskTitle.trim()) {
            const newSubTask: Subtask = {
                id: "", // Temporary ID generation
                title: subTaskTitle,
                taskId: taskId, // Associate with the parent task
                completed: false,
                createdAt: (new Date()).toISOString(),
                updatedAt: (new Date()).toISOString()  
            };
            onCreate(newSubTask);
            setSubTaskTitle('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={subTaskTitle}
                onChange={(e) => setSubTaskTitle(e.target.value)}
                placeholder="Enter subtask title"
            />
            <button onClick={handleCreateSubTask}>Add Subtask</button>
        </div>
    );
}