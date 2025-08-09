import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Module } from './types';
import { parseSvgToJson } from '../../utils/parseSvgToJson';
import { renderSvgNode } from '../../utils/renderSvg';
 
interface ModuleProps {
  modules: Module[] | null;
  onSelect?: (moduleId: string) => void;
  selectedModuleId?: string;
}

export default function ModuleListCard({
  modules,
  onSelect,
  selectedModuleId
}: ModuleProps) {
  return (
    <Box>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          模块列表
        </Typography>
        <List>
          {modules &&
            modules.map((mod) => {

              const svgJson = mod.iconSVG ? parseSvgToJson(mod.iconSVG) : null;
                
            //   console.log("svg有无",mod.iconSVG)

            
            //   console.log("创建了", svgJson)
              return (
                <ListItemButton
                  key={mod.id}
                  selected={mod.id === selectedModuleId}
                  onClick={() => onSelect?.(mod.id)}
                >
                  {svgJson && (
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {renderSvgNode(svgJson)}
                      </Box>
                    </ListItemIcon>
                  )}
                  <ListItemText primary={mod.name} />
                </ListItemButton>
              );
            })}
        </List>
      </Box>
    </Box>
  );
}
