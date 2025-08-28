import { List, ListItem } from "@mui/material";
import SubtaskCard from "../components/SubTaskCard";
import { Subtask } from "../model/taskTypes";
import { useEffect } from "react";
import { getAllSubtasks } from "../api/taskApi";
import React from "react";
import { set } from "date-fns";
const SubtaskPage : React.FC = () => {
    const mockSub: Subtask = { id: '1', title: "Sample Subtask", completed: false, createdAt: new Date().toISOString(), taskId: '1' }
    const mockSubtasks: Subtask[] = [mockSub, { ...mockSub, id: '2', title: "Another Subtask", completed: true }];
    const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);
    useEffect(()=>{
        getAllSubtasks().then((res) =>{
            setSubtasks(res);
            console.log(res);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const handleSubtaskDelete = ( ) => {
        // Implement delete functionality
    };

    const handleSubtaskEdit = ( subtask:Subtask ) => {
        setSubtasks((prev) =>
            prev.map((s) => (s.id === subtask.id ? { ...s, ...subtask } : s))
        );

    };

    return (
        <div>
            <List >
                <ListItem  sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2, px: 1 }}>
                     {
                        subtasks && subtasks.map((subtask) => (
                            <SubtaskCard onDelete={ handleSubtaskDelete } onEdit={  handleSubtaskEdit } key={subtask.id} subtask={subtask} />
                        ))
                     }
 
                </ListItem>
            </List>
        </div>
    )
}

export default SubtaskPage;