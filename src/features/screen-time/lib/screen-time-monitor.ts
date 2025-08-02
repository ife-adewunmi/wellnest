/**
 * Screen Time Monitor
 * Tracks user screen time, app usage, and provides analytics
 */

export interface ScreenTimeSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  duration: number // in milliseconds
  isActive: boolean
  url: string
  userAgent: string
  deviceType: 'mobile' | 'desktop' | 'tablet'
}

export interface ScreenTimeStats {
  totalTime: number
  sessions: ScreenTimeSession[]
  averageSessionDuration: number
  longestSession: number
  shortestSession: number
  todayTime: number
  weeklyTime: number
  monthlyTime: number
}

export interface ScreenTimeThreshold {
  userId: string
  dailyLimit: number // in minutes
  weeklyLimit: number // in minutes
  breakReminder: number // in minutes
  enabled: boolean
}

class ScreenTimeMonitor {
  private currentSession: ScreenTimeSession | null = null
  private idleTimer: NodeJS.Timeout | null = null
  private idleThreshold = 5 * 60 * 1000 // 5 minutes
  private updateInterval: NodeJS.Timeout | null = null
  private lastActivity = Date.now()
  private callbacks: {
    onSessionStart?: (session: ScreenTimeSession) => void
    onSessionEnd?: (session: ScreenTimeSession) => void
    onThresholdReached?: (type: 'daily' | 'weekly' | 'break', timeSpent: number) => void
    onIdle?: () => void
    onActive?: () => void
  } = {}

  constructor() {
    this.initializeEventListeners()
  }

  private initializeEventListeners() {
    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    activityEvents.forEach(event => {
      document.addEventListener(event, this.handleActivity.bind(this), true)
    })

    // Track page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))

    // Track focus/blur events
    window.addEventListener('focus', this.handleFocus.bind(this))
    window.addEventListener('blur', this.handleBlur.bind(this))

    // Track beforeunload to save session
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this))
  }

  private handleActivity() {
    this.lastActivity = Date.now()
    this.resetIdleTimer()
  }

  private handleVisibilityChange() {
    if (document.hidden) {
      this.pauseSession()
    } else {
      this.resumeSession()
    }
  }

  private handleFocus() {
    this.resumeSession()
  }

  private handleBlur() {
    this.pauseSession()
  }

  private handleBeforeUnload() {
    this.endSession()
  }

  private resetIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
    }

    this.idleTimer = setTimeout(() => {
      this.handleIdle()
    }, this.idleThreshold)
  }

  private handleIdle() {
    if (this.currentSession && this.currentSession.isActive) {
      this.pauseSession()
      this.callbacks.onIdle?.()
    }
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const userAgent = navigator.userAgent
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet'
    }
    
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile'
    }
    
    return 'desktop'
  }

  public startSession(userId: string): ScreenTimeSession {
    // End any existing session
    if (this.currentSession) {
      this.endSession()
    }

    const session: ScreenTimeSession = {
      id: crypto.randomUUID(),
      userId,
      startTime: new Date(),
      duration: 0,
      isActive: true,
      url: window.location.href,
      userAgent: navigator.userAgent,
      deviceType: this.getDeviceType()
    }

    this.currentSession = session
    this.resetIdleTimer()
    this.startUpdateInterval()

    this.callbacks.onSessionStart?.(session)
    return session
  }

  public endSession(): ScreenTimeSession | null {
    if (!this.currentSession) return null

    const session = this.currentSession
    session.endTime = new Date()
    session.duration = session.endTime.getTime() - session.startTime.getTime()
    session.isActive = false

    this.stopUpdateInterval()
    this.clearTimers()

    this.callbacks.onSessionEnd?.(session)
    
    // Save session to database
    this.saveSession(session)

    this.currentSession = null
    return session
  }

  public pauseSession() {
    if (this.currentSession && this.currentSession.isActive) {
      this.currentSession.isActive = false
      this.stopUpdateInterval()
    }
  }

  public resumeSession() {
    if (this.currentSession && !this.currentSession.isActive) {
      this.currentSession.isActive = true
      this.resetIdleTimer()
      this.startUpdateInterval()
      this.callbacks.onActive?.()
    }
  }

  public getCurrentSession(): ScreenTimeSession | null {
    return this.currentSession
  }

  public setCallbacks(callbacks: typeof this.callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  public async getStats(userId: string): Promise<ScreenTimeStats> {
    try {
      const response = await fetch(`/api/screen-time/stats?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch stats')
      return await response.json()
    } catch (error) {
      console.error('Error fetching screen time stats:', error)
      return {
        totalTime: 0,
        sessions: [],
        averageSessionDuration: 0,
        longestSession: 0,
        shortestSession: 0,
        todayTime: 0,
        weeklyTime: 0,
        monthlyTime: 0
      }
    }
  }

  public async getThresholds(userId: string): Promise<ScreenTimeThreshold | null> {
    try {
      const response = await fetch(`/api/screen-time/thresholds?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch thresholds')
      return await response.json()
    } catch (error) {
      console.error('Error fetching screen time thresholds:', error)
      return null
    }
  }

  public async setThresholds(threshold: ScreenTimeThreshold): Promise<boolean> {
    try {
      const response = await fetch('/api/screen-time/thresholds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(threshold)
      })
      return response.ok
    } catch (error) {
      console.error('Error setting screen time thresholds:', error)
      return false
    }
  }

  private startUpdateInterval() {
    this.updateInterval = setInterval(() => {
      if (this.currentSession && this.currentSession.isActive) {
        this.currentSession.duration = Date.now() - this.currentSession.startTime.getTime()
        this.checkThresholds()
      }
    }, 60000) // Update every minute
  }

  private stopUpdateInterval() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  private clearTimers() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
      this.idleTimer = null
    }
    this.stopUpdateInterval()
  }

  private async checkThresholds() {
    if (!this.currentSession) return

    const thresholds = await this.getThresholds(this.currentSession.userId)
    if (!thresholds || !thresholds.enabled) return

    const stats = await this.getStats(this.currentSession.userId)
    
    // Check daily limit
    const dailyMinutes = stats.todayTime / (1000 * 60)
    if (dailyMinutes >= thresholds.dailyLimit) {
      this.callbacks.onThresholdReached?.('daily', dailyMinutes)
    }

    // Check weekly limit
    const weeklyMinutes = stats.weeklyTime / (1000 * 60)
    if (weeklyMinutes >= thresholds.weeklyLimit) {
      this.callbacks.onThresholdReached?.('weekly', weeklyMinutes)
    }

    // Check break reminder
    const currentSessionMinutes = this.currentSession.duration / (1000 * 60)
    if (currentSessionMinutes >= thresholds.breakReminder) {
      this.callbacks.onThresholdReached?.('break', currentSessionMinutes)
    }
  }

  private async saveSession(session: ScreenTimeSession) {
    try {
      const response = await fetch('/api/screen-time/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      })
      
      if (!response.ok) {
        console.error('Failed to save session to server')
        // Store locally for retry later
        this.storeSessionLocally(session)
      }
    } catch (error) {
      console.error('Error saving session:', error)
      this.storeSessionLocally(session)
    }
  }

  private storeSessionLocally(session: ScreenTimeSession) {
    const storedSessions = JSON.parse(localStorage.getItem('pendingScreenTimeSessions') || '[]')
    storedSessions.push(session)
    localStorage.setItem('pendingScreenTimeSessions', JSON.stringify(storedSessions))
  }

  public async syncPendingSessions() {
    const pendingSessions = JSON.parse(localStorage.getItem('pendingScreenTimeSessions') || '[]')
    
    for (const session of pendingSessions) {
      try {
        const response = await fetch('/api/screen-time/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(session)
        })
        
        if (response.ok) {
          // Remove from pending list
          const updatedPending = pendingSessions.filter((s: ScreenTimeSession) => s.id !== session.id)
          localStorage.setItem('pendingScreenTimeSessions', JSON.stringify(updatedPending))
        }
      } catch (error) {
        console.error('Error syncing pending session:', error)
      }
    }
  }

  public destroy() {
    this.endSession()
    this.clearTimers()
    
    // Remove event listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    activityEvents.forEach(event => {
      document.removeEventListener(event, this.handleActivity.bind(this), true)
    })
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    window.removeEventListener('focus', this.handleFocus.bind(this))
    window.removeEventListener('blur', this.handleBlur.bind(this))
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this))
  }
}

export default ScreenTimeMonitor
