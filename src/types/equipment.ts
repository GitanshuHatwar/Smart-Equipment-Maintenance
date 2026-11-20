export type OperationalStatus = 'Operational' | 'Under maintenance' | 'Needs attention'
export type MaintenanceKind = 'Inspection' | 'Repair' | 'Preventive maintenance'

export interface Equipment {
  id: string
  assetId: string
  name: string
  category: string
  manufacturer: string
  model: string
  serialNumber: string
  rfidUid: string
  location: string
  department: string
  status: OperationalStatus
  lastMaintenance: string
  nextMaintenance: string
  purchaseDate: string
  warranty: string
  specifications: string
}

export interface MaintenanceRecord {
  id: string
  equipmentId: string
  date: string
  kind: MaintenanceKind
  issue: string
  diagnosis: string
  action: string
  technician: string
  parts?: string
  cost?: number
  status: 'Completed' | 'Scheduled' | 'In progress'
}

export interface ScanResponse {
  success: boolean
  message: string
  equipment?: Equipment
  rfid_uid?: string
}

export interface Activity {
  id: string
  equipmentId: string
  activity: string
  technician: string
  date: string
  status: OperationalStatus
}
