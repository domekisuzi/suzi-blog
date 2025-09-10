import React from "react";
import { Card, CardContent, Button, IconButton, TextField, Typography, Box } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { DeleteOutline, EditOutlined, SaveOutlined, CancelOutlined } from "@mui/icons-material";
import { deleteSubtaskById, updateSubtask, updateSubtaskByEntity } from "../api/taskApi";
import { useLoading } from "../../../context/LoadingContext";
import { Subtask } from "../model/taskTypes";
import { set } from "date-fns";
import { se } from "date-fns/locale";

interface subtaskProps {
  subtask: Subtask;
  onDelete: () => void;
  onEdit: (updated: Subtask) => void;
}

export default function SubtaskCard({ subtask, onDelete, onEdit }: subtaskProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(subtask.title);
  const [editDueDate, setEditDueDate] = React.useState(subtask.dueDate || "");
  const { loading, setLoading } = useLoading();

  // 进入编辑时同步原始数据
  React.useEffect(() => {
    if (isEditing) {
      setEditTitle(subtask.title);
      setEditDueDate(subtask.dueDate || "");
    }
  }, [isEditing, subtask.title, subtask.dueDate]);

  const handleSubtaskDelete = (subtaskId: string) => {
 
    deleteSubtaskById(subtaskId)
      .then(() => {

        onDelete();
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubtaskUpdate = () => {
    // 这里可以加校验
    console.log("Updating subtask:", subtask.id, editTitle, editDueDate);
    onEdit({
      ...subtask,
      title: editTitle,
      dueDate: editDueDate,
    });
    updateSubtaskByEntity({
      ...subtask,
      title: editTitle,
      dueDate: editDueDate,
    }).then((res) => {
        // onEdit(res);
        console.log("Subtask updated:", res);
    }).catch((e) => {
        console.log(e);
    });

    setIsEditing(false);
  };


  const handleSubtaskComplete = (completed: boolean) => {
    // 这里可以加校验
    
    onEdit({
      ...subtask,
      completed: !completed,
    });
    setLoading(true);
    updateSubtaskByEntity( {...subtask, completed: !completed})
      .then((res) => {
        console.log("Subtask completed:", res);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card  sx={{ width: "85%", borderRadius: "12px", mb: 1,   
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          } }}>
      <CardContent
        
        sx={{
          height: 60, 
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding:0,
           "&:last-child":{
            paddingBottom: 0
           },
          justifyItems: "center",
          m:1 ,
        }}

      >
        <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
          {subtask.completed ? (
            <CheckCircleOutlineOutlinedIcon sx={{ color: "green", "&:hover": { color: "gray",cursor: "pointer"} }} onClick={() => handleSubtaskComplete(subtask.completed)} />
          ) : (
            <CheckCircleOutlineOutlinedIcon sx={{ "&:hover": { color: "green" ,cursor: "pointer" } }} onClick={() => handleSubtaskComplete(subtask.completed)} />
          )}

          {isEditing ? (
            <TextField
              variant="standard"
              name="title"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              
              size="small"
              
              sx={{ ml: 2, minWidth: 0, flex: 1 }}
              onKeyDown={e => {
                if (e.key === "Enter") handleSubtaskUpdate();
              }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: "1em",
                marginLeft: "8px",
                lineHeight: 1.5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                 
                textOverflow: "ellipsis",
                '&:hover': { cursor: "pointer", color: "blue" }
              }}
              onClick={() => setIsEditing(true)}
               
            >
              {subtask.title}
            </Typography>
          )}
        </Box>

        <Box sx={{ flexShrink: 0, marginRight: 2, minWidth: 120 }}>
          {isEditing ? (
            // 如用 MUI DatePicker，替换为 <DatePicker ... />
            <TextField
              type="date"
              variant="standard"
              value={editDueDate ? editDueDate.slice(0, 10) : ""}
              onChange={e => setEditDueDate(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            />
          ) : subtask.dueDate ? (
            <Typography >
              Due at: {new Date(subtask.dueDate).toLocaleDateString()}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No due date
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {isEditing ? (
            <>
              <IconButton aria-label="save" size="small" onClick={handleSubtaskUpdate}>
                <SaveOutlined />
              </IconButton>
              <IconButton aria-label="cancel" size="small" onClick={() => setIsEditing(false)}>
                <CancelOutlined />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton aria-label="edit" size="small" onClick={() => setIsEditing(true)}>
                <EditOutlined />
              </IconButton>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => {
                  setLoading(true);
                  handleSubtaskDelete(subtask.id);
                }}
              >
                <DeleteOutline />
              </IconButton>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
