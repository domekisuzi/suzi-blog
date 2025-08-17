import { api } from "../../../shared/utils/APIUtils"
import { ModuleDetailVo } from "../model/module"
const BASE = '/modules'
export async function fetchModuleDetails(): Promise<ModuleDetailVo[]> {
    const res = await api.get(`${BASE}/vo`)
    return res.data
}

