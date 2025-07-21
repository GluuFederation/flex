// Type definitions for MAU (Monthly Active Users) functionality

export interface MauState {
  stat: any[]
  loading: boolean
  startMonth: string
  endMonth: string
}

export interface MauRequestPayload {
  action?: {
    action_data?: {
      startMonth: string
      endMonth: string
    }
  }
}

export interface MauResponsePayload {
  data?: any[]
}
