 import { api } from "../../../shared/utils/APIUtils"
 
import { Module, ModuleDetailVo } from "../model/module"
const BASE = '/modules'
export async function fetchModuleDetails(): Promise<ModuleDetailVo[]> {
    const res = await api.get(`${BASE}/vo`)
    return res.data
}

export async function createModule(name:string) :Promise<Module>{
  const res = await  api.post('/modules', { name });
  return res.data
}
export async function fetchModules():Promise<Module[]>{
  const res = await api.get('/modules')
  return res.data 
}

