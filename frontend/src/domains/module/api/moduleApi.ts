/**
 * Module API - 使用统一的 API 适配器
 */
import { apiAdapter } from '../../../shared/utils/APIUtils'
import { Module } from '../model/module'

/** 获取所有模块 */
export async function fetchModules(): Promise<Module[]> {
  const res = await apiAdapter.module.getAll()
  return res.data
}

/** 创建模块 */
export async function createModule(name: string, iconSVG?: string): Promise<Module> {
  const res = await apiAdapter.module.create({ name, iconSVG })
  return res.data
}

/** 更新模块 */
export async function updateModule(id: string, updates: Partial<Module>): Promise<Module> {
  const res = await apiAdapter.module.update(id, updates)
  return res.data
}

/** 删除模块 */
export async function deleteModule(id: string): Promise<void> {
  await apiAdapter.module.delete(id)
}