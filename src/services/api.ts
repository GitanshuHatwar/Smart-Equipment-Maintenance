import { activities as mockActivities, equipment as mockEquipment, maintenanceRecords as mockRecords } from '../data/mockData'
import type { Activity, Equipment, MaintenanceRecord, ScanResponse } from '../types/equipment'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json() as Promise<T>
}

export const api = {
  async getEquipment(): Promise<Equipment[]> { return DEMO_MODE ? mockEquipment : request('/api/devices') },
  async getEquipmentStats() {
    const list = await this.getEquipment()
    return { total: list.length, operational: list.filter((item) => item.status === 'Operational').length, maintenance: list.filter((item) => item.status === 'Under maintenance').length, attention: list.filter((item) => item.status === 'Needs attention').length }
  },
  async getRecentActivity(): Promise<Activity[]> { return DEMO_MODE ? mockActivities : request('/api/activity/recent') },
  async getScannerStatus(): Promise<{ connected: boolean; deviceId: string; lastScan: string }> { return DEMO_MODE ? { connected: true, deviceId: 'ESP32_01', lastScan: 'Today, 9:42 AM' } : request('/api/scanner/status') },
  async scanDevice(payload: { rfid_uid: string; device_id: string }): Promise<ScanResponse> {
    if (DEMO_MODE) { const match = mockEquipment.find((item) => item.rfidUid === payload.rfid_uid); return match ? { success: true, message: 'Device identified successfully.', equipment: match, rfid_uid: payload.rfid_uid } : { success: false, message: 'Device not registered. Please contact the administrator.' } }
    return request('/api/device/scan', { method: 'POST', body: JSON.stringify(payload) })
  },
  async getEquipmentById(id: string): Promise<Equipment | undefined> { return DEMO_MODE ? mockEquipment.find((item) => item.id === id) : request(`/api/devices/${encodeURIComponent(id)}`) },
  async getMaintenanceHistory(id: string): Promise<MaintenanceRecord[]> { return DEMO_MODE ? mockRecords.filter((record) => record.equipmentId === id) : request(`/api/devices/${encodeURIComponent(id)}/maintenance`) },
  async createMaintenanceRecord(record: Omit<MaintenanceRecord, 'id'>): Promise<MaintenanceRecord> {
    if (DEMO_MODE) { const saved = { ...record, id: `m-${Date.now()}` }; mockRecords.unshift(saved); return saved }
    return request(`/api/devices/${encodeURIComponent(record.equipmentId)}/maintenance`, { method: 'POST', body: JSON.stringify(record) })
  },
  subscribeToScans(onScan: (event: { rfid_uid: string; device_id: string }) => void): () => void {
    if (DEMO_MODE || typeof EventSource === 'undefined') return () => undefined
    const source = new EventSource(`${API_BASE}/api/device/events`)
    source.onmessage = (message) => { try { onScan(JSON.parse(message.data)) } catch { /* Ignore invalid event payloads. */ } }
    return () => source.close()
  },
}
