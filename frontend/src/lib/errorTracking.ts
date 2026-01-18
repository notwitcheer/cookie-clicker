interface ErrorContext {
  component?: string
  action?: string
  userAgent?: string
  timestamp?: number
  url?: string
  walletConnected?: boolean
  chainId?: number
  additional?: Record<string, unknown>
}

class ErrorTracker {
  private static instance: ErrorTracker
  private isDevelopment: boolean

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker()
    }
    return ErrorTracker.instance
  }

  /**
   * Track an error with context
   */
  trackError(error: Error, context: ErrorContext = {}) {
    const enrichedContext = this.enrichContext(context)

    // Log to console with rich information
    if (this.isDevelopment) {
      console.group('🔴 Error Tracked')
      console.error('Error:', error.message)
      console.error('Stack:', error.stack)
      console.table(enrichedContext)
      console.groupEnd()
    } else {
      // In production, log more concisely
      console.error('Error tracked:', error.message, enrichedContext)
    }

    // Could be extended to send to analytics service
    // Currently disabled - would be enabled for production monitoring
    // this.sendToAnalytics(error, enrichedContext)
  }

  /**
   * Track a warning (non-critical error)
   */
  trackWarning(message: string, context: ErrorContext = {}) {
    const enrichedContext = this.enrichContext(context)

    if (this.isDevelopment) {
      console.group('⚠️ Warning Tracked')
      console.warn('Warning:', message)
      console.table(enrichedContext)
      console.groupEnd()
    } else {
      console.warn('Warning tracked:', message, enrichedContext)
    }
  }

  /**
   * Track user action for debugging
   */
  trackAction(action: string, context: ErrorContext = {}) {
    if (!this.isDevelopment) return // Only in development

    const enrichedContext = this.enrichContext(context)

    console.group('📊 Action Tracked')
    console.info('Action:', action)
    console.table(enrichedContext)
    console.groupEnd()
  }

  /**
   * Enrich context with additional browser/app information
   */
  private enrichContext(context: ErrorContext): ErrorContext {
    return {
      ...context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      // Add wallet context if available
      ...(window.ethereum && {
        walletAvailable: !!window.ethereum,
        walletProvider: (window.ethereum as { isMetaMask?: boolean })?.isMetaMask ? 'MetaMask' : 'Unknown'
      })
    }
  }

  /**
   * In production, could send to analytics service
   * Currently commented out - would be implemented for production monitoring
   */
  // private sendToAnalytics(error: Error, context: ErrorContext) {
  //   // Example: Send to Sentry, DataDog, etc.
  //   // Sentry.captureException(error, { extra: context })
  // }
}

// Global error handler
window.addEventListener('error', (event) => {
  ErrorTracker.getInstance().trackError(event.error, {
    component: 'Global',
    action: 'Unhandled Error',
    additional: {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }
  })
})

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(event.reason)
  ErrorTracker.getInstance().trackError(error, {
    component: 'Global',
    action: 'Unhandled Promise Rejection'
  })
})

export const errorTracker = ErrorTracker.getInstance()

// Convenience functions
export const trackError = (error: Error, context?: ErrorContext) => errorTracker.trackError(error, context)
export const trackWarning = (message: string, context?: ErrorContext) => errorTracker.trackWarning(message, context)
export const trackAction = (action: string, context?: ErrorContext) => errorTracker.trackAction(action, context)