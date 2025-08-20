export interface  ModuleDetailVo  {
    id: string;
    name: string;
    createdAt: string; // ISO 8601 format
    taskNumber: number; 
    subtaskNumber: number;
    completedRate: string;  // statistics all the completed  subtask
    completedSubtaskNumber: number;
    completedTaskNumber: number;
    iconSVG?: string;
    dueDate?: string;
}


export interface ModuleDTO{
    id: string
    name: string
    iconSVG?: string
}

export const mockModuleDetailVo: ModuleDetailVo = {
    id: '1',
    name: 'This is a Mock Module',
    createdAt: (new Date()).toISOString(),
    taskNumber: 5,
    subtaskNumber: 10,
    completedRate: '63',
    iconSVG: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4caf50"><path d="M9 3v2h6V3h2v2h3v2H4V5h3V3h2zm-5 6h16v12H4V9zm2 2v8h12v-8H6z"/></svg>',
    completedSubtaskNumber: 5,
    completedTaskNumber: 3  
}
