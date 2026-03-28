import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
 
import { renderSvgNode } from '../../../shared/utils/renderSvg';
import { parseSvgToJson } from '../../../shared/utils/parseSvgToJson';
import { Module } from '../model/module';

// 判断是否为图片 URL
const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image');
}

// 判断是否为 SVG 字符串
const isSvgString = (str: string): boolean => {
  if (!str) return false;
  return str.trim().startsWith('<svg') || str.trim().startsWith('<?xml');
}
 
/**
 * A List to show all module, it is designed to show its task when clicked , but now it may be deprecated 
 *  */ 
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
              const iconSVG = mod.iconSVG || '';
              const isImgUrl = isImageUrl(iconSVG);
              const isSvg = isSvgString(iconSVG);
              const svgJson = isSvg ? parseSvgToJson(iconSVG) : null;
                
              return (
                <ListItemButton
                  key={mod.id}
                  selected={mod.id === selectedModuleId}
                  onClick={() => onSelect?.(mod.id)}
                >
                  {(isImgUrl || svgJson) && (
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(0,0,0,0.05)',
                        }}
                      >
                        {isImgUrl ? (
                          <img 
                            src={iconSVG} 
                            alt={mod.name}
                            style={{ 
                              width: '70%', 
                              height: '70%', 
                              objectFit: 'contain'
                            }} 
                          />
                        ) : svgJson ? (
                          <Box sx={{ width: 20, height: 20 }}>
                            {renderSvgNode(svgJson)}
                          </Box>
                        ) : null}

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
