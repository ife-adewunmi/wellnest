// types/settings.ts
export type ToggleableItem = {
  id: string
  enabled: boolean
}

export interface DashboardWidget extends ToggleableItem {
  label: string
}

export interface NotificationSetting extends ToggleableItem {
  title: string
  description: string
}

export interface NotificationMethod extends ToggleableItem {
  label: string
}

export type SettingsInitialState = {
  widgets: DashboardWidget[]
  notifications: NotificationSetting[]
  methods: NotificationMethod[]
}
