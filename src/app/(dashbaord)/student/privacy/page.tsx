"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Eye, Lock, Download, Trash2 } from "lucide-react"

export default function StudentPrivacyPage() {
  const [settings, setSettings] = useState({
    shareDataWithCounselor: true,
    allowPushNotifications: true,
    shareScreenTimeData: false,
    allowLocationTracking: false,
    enableAnalytics: true
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleExportData = () => {
    // Mock export functionality
    console.log("Exporting user data...")
  }

  const handleDeleteAccount = () => {
    // Mock delete functionality
    console.log("Deleting account...")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Privacy Settings</h1>
        <p className="text-muted-foreground">Manage your privacy and data settings</p>
      </div>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="share-data">Share Data with Counselor</Label>
              <p className="text-sm text-muted-foreground">
                Allow your counselor to access your mood check-ins and session data
              </p>
            </div>
            <Switch
              id="share-data"
              checked={settings.shareDataWithCounselor}
              onCheckedChange={(checked) => handleSettingChange('shareDataWithCounselor', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for appointments and reminders
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.allowPushNotifications}
              onCheckedChange={(checked) => handleSettingChange('allowPushNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="screen-time">Share Screen Time Data</Label>
              <p className="text-sm text-muted-foreground">
                Allow sharing of screen time monitoring data for analysis
              </p>
            </div>
            <Switch
              id="screen-time"
              checked={settings.shareScreenTimeData}
              onCheckedChange={(checked) => handleSettingChange('shareScreenTimeData', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="location">Location Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Enable location tracking for emergency situations
              </p>
            </div>
            <Switch
              id="location"
              checked={settings.allowLocationTracking}
              onCheckedChange={(checked) => handleSettingChange('allowLocationTracking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="analytics">Usage Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Help improve the app by sharing anonymous usage data
              </p>
            </div>
            <Switch
              id="analytics"
              checked={settings.enableAnalytics}
              onCheckedChange={(checked) => handleSettingChange('enableAnalytics', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Export Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your data
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Data Retention</h3>
              <p className="text-sm text-muted-foreground">
                Your data is retained for 7 years or until you delete your account
              </p>
            </div>
            <Button variant="outline" disabled>
              <Lock className="h-4 w-4 mr-2" />
              Secured
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-destructive rounded-lg">
            <h3 className="font-medium text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button 
              variant="destructive" 
              className="mt-4"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button>
          Save Settings
        </Button>
      </div>
    </div>
  )
}
