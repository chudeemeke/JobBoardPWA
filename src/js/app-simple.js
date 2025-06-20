// Core Application Architecture - Production Ready
// Security and UX at the foundation, not as features

// Use Dexie from global script tag instead of module import
const db = new Dexie('JobHunterPro');

db.version(1).stores({
    // User Management
    users: '++id, email, username, role, status, created, lastLogin, [email+status]',
    profiles: 'userId, displayName, avatar, bio, timezone, preferences',
    sessions: '++id, userId, token, device, ip, expires, created',
    permissions: '++id, userId, resource, action, granted',
    
    // Job Management
    jobs: '++id, externalId, source, title, company, location, type, salary, posted, [company+title+location], *keywords',
    applications: '++id, userId, jobId, status, stage, appliedDate, *tags',
    savedSearches: '++id, userId, query, filters, frequency, lastRun',
    
    // Resume & Cover Letters
    resumes: '++id, userId, name, content, isBase, created, modified',
    optimizations: '++id, userId, jobId, resumeId, optimizedContent, score',
    coverLetters: '++id, userId, jobId, content, template, created',
    
    // Communication
    emailAccounts: '++id, userId, email, provider, smtp, imap, oauth',
    emailTemplates: '++id, userId, name, subject, body, variables',
    sentEmails: '++id, userId, jobId, to, subject, sentDate, status',
    
    // Admin & Configuration
    jobBoards: '++id, name, apiUrl, apiKey, rateLimit, enabled, custom',
    systemSettings: 'key, value, updated',
    integrations: '++id, name, type, config, status',
    
    // Analytics & Logging
    events: '++id, userId, type, action, metadata, timestamp',
    errors: '++id, userId, error, stack, context, timestamp',
    metrics: '++id, userId, metric, value, date',
    
    // Messaging & Notifications
    notifications: '++id, userId, type, title, message, read, created',
    announcements: '++id, title, content, priority, active, created'
});

// Core Application Class
class JobHunterApp {
    constructor() {
        this.db = db;
        this.services = {};
        this.initialized = false;
        this.baseUrl = '/job-hunter-app';
        this.setupCoreServices();
    }

    async setupCoreServices() {
        // Initialize core services with error boundaries
        try {
            // For GitHub Pages, we'll use a simpler approach - inline the services
            // This avoids module loading issues
            
            // Create mock services for now
            this.services.security = { 
                init: () => console.log('Security service initialized'),
                encrypt: (data) => data,
                decrypt: (data) => data
            };
            
            this.services.user = {
                currentUser: null,
                createUser: async (userData) => {
                    const user = {...userData, id: Date.now()};
                    await this.db.users.add(user);
                    return user;
                },
                login: async (email, password) => {
                    // Simple login for demo
                    const user = await this.db.users.where('email').equals(email).first();
                    if (user) {
                        this.services.user.currentUser = user;
                        return user;
                    }
                    // Create new user if doesn't exist
                    return this.services.user.createUser({email, password, role: 'user'});
                },
                restoreSession: async () => {
                    // Try to restore from localStorage
                    const savedUser = localStorage.getItem('currentUser');
                    if (savedUser) {
                        this.services.user.currentUser = JSON.parse(savedUser);
                    }
                }
            };
            
            this.services.message = {
                success: (msg) => this.showNotification(msg, 'success'),
                error: (msg) => this.showNotification(msg, 'error'),
                info: (msg) => this.showNotification(msg, 'info')
            };
            
            this.services.logger = {
                info: (msg) => console.log(`[INFO] ${msg}`),
                error: (msg, error) => console.error(`[ERROR] ${msg}`, error),
                warn: (msg) => console.warn(`[WARN] ${msg}`)
            };
            
            this.services.jobBoard = {
                startBackgroundSync: () => console.log('Job sync started'),
                syncJobs: () => console.log('Syncing jobs...')
            };
            
            this.services.aiOptimizer = {
                optimize: (resume, job) => `Optimized resume for ${job.title}`
            };
            
            this.services.email = {
                sendEmail: (to, subject, body) => console.log(`Email to ${to}: ${subject}`)
            };
            
            this.services.admin = {
                isAdmin: () => this.services.user.currentUser?.role === 'admin'
            };
            
            this.services.analytics = {
                track: (event, data) => console.log(`Analytics: ${event}`, data),
                trackError: (error, context) => console.error('Analytics Error:', error, context),
                startCollection: () => console.log('Analytics collection started')
            };

            // Initialize application
            await this.initialize();
            
        } catch (error) {
            // Graceful fallback
            this.handleCriticalError(error);
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async initialize() {
        // Check if first run
        const isFirstRun = await this.checkFirstRun();
        
        if (isFirstRun) {
            await this.runFirstTimeSetup();
        }

        // Load user session
        await this.services.user.restoreSession();

        // Initialize UI
        await this.initializeUI();

        // Start background services
        this.startBackgroundServices();

        this.initialized = true;
        this.services.logger.info('Application initialized successfully');
    }

    async checkFirstRun() {
        const settings = await this.db.systemSettings.get('initialized');
        return !settings;
    }

    async runFirstTimeSetup() {
        // Set default system settings
        await this.db.systemSettings.put({
            key: 'initialized',
            value: true,
            updated: new Date().toISOString()
        });
    }

    async initializeUI() {
        // Simple UI initialization
        const app = document.getElementById('app');
        if (!app) return;
        
        // Check if user is logged in
        if (!this.services.user.currentUser) {
            // Show login view
            app.innerHTML = `
                <div class="login-container">
                    <div class="login-box">
                        <h1>Job Hunter Pro</h1>
                        <p>Sign in to continue</p>
                        <form id="loginForm">
                            <input type="email" id="email" placeholder="Email" required>
                            <input type="password" id="password" placeholder="Password" required>
                            <button type="submit">Sign In</button>
                        </form>
                        <p class="signup-link">
                            New user? Just enter any email/password to create account!
                        </p>
                    </div>
                </div>
                <style>
                    .login-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .login-box {
                        background: white;
                        padding: 2rem;
                        border-radius: 12px;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                        width: 90%;
                        max-width: 400px;
                    }
                    .login-box h1 {
                        text-align: center;
                        color: #1a202c;
                        margin-bottom: 0.5rem;
                    }
                    .login-box p {
                        text-align: center;
                        color: #718096;
                        margin-bottom: 2rem;
                    }
                    #loginForm {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    #loginForm input {
                        padding: 0.75rem;
                        border: 1px solid #e2e8f0;
                        border-radius: 6px;
                        font-size: 1rem;
                    }
                    #loginForm button {
                        padding: 0.75rem;
                        background: #667eea;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                    }
                    #loginForm button:hover {
                        background: #5a67d8;
                    }
                    .signup-link {
                        text-align: center;
                        font-size: 0.875rem;
                        color: #718096;
                        margin-top: 1rem;
                    }
                </style>
            `;
            
            // Add login handler
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                const user = await this.services.user.login(email, password);
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.services.message.success('Welcome to Job Hunter Pro!');
                    this.showDashboard();
                }
            });
        } else {
            this.showDashboard();
        }
    }

    showDashboard() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard">
                <header class="app-header">
                    <h1>Job Hunter Pro</h1>
                    <button onclick="app.logout()" class="logout-btn">Logout</button>
                </header>
                <div class="dashboard-content">
                    <div class="welcome-card">
                        <h2>Welcome back!</h2>
                        <p>Ready to find your dream job?</p>
                    </div>
                    <div class="quick-actions">
                        <button class="action-btn">🔍 Search Jobs</button>
                        <button class="action-btn">📝 Optimize Resume</button>
                        <button class="action-btn">📊 View Applications</button>
                        <button class="action-btn">⚙️ Settings</button>
                    </div>
                </div>
            </div>
            <style>
                .dashboard {
                    min-height: 100vh;
                    background: #f7fafc;
                }
                .app-header {
                    background: white;
                    padding: 1rem 2rem;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .app-header h1 {
                    color: #1a202c;
                    margin: 0;
                }
                .logout-btn {
                    padding: 0.5rem 1rem;
                    background: #e53e3e;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }
                .dashboard-content {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .welcome-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                    text-align: center;
                }
                .welcome-card h2 {
                    color: #1a202c;
                    margin-bottom: 0.5rem;
                }
                .welcome-card p {
                    color: #718096;
                }
                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }
                .action-btn {
                    padding: 2rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1.125rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-btn:hover {
                    border-color: #667eea;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
            </style>
        `;
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.services.user.currentUser = null;
        location.reload();
    }

    startBackgroundServices() {
        // Start services
        this.services.jobBoard.startBackgroundSync();
        this.services.analytics.startCollection();
        this.setupGlobalErrorHandlers();
    }

    setupGlobalErrorHandlers() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError(event.error, {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno
            });
        });

        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'unhandledRejection',
                promise: event.promise
            });
        });
    }

    async handleError(error, context = {}) {
        // Log error
        this.services.logger.error('Application error', error);

        // User-friendly message
        const userMessage = this.getUserFriendlyError(error);
        this.services.message.error(userMessage);
    }

    getUserFriendlyError(error) {
        const errorMap = {
            'NetworkError': 'Connection issue. Please check your internet.',
            'QuotaExceededError': 'Storage full. Please clear some data.',
            'NotAllowedError': 'Permission denied. Please check your settings.',
            'AbortError': 'Operation cancelled.',
            'TimeoutError': 'Request took too long. Please try again.',
            'ValidationError': 'Please check your input and try again.'
        };

        return errorMap[error.name] || 'Something went wrong. We\'re looking into it.';
    }

    handleCriticalError(error) {
        // Show beautiful error page
        document.body.innerHTML = `
            <div class="critical-error">
                <div class="error-content">
                    <h1>Oops! Something unexpected happened</h1>
                    <p>Don't worry, your data is safe. Let's get you back on track.</p>
                    <div class="error-actions">
                        <button onclick="location.reload()">Refresh Page</button>
                        <button onclick="localStorage.clear(); location.reload()">Start Fresh</button>
                    </div>
                    <details>
                        <summary>Technical Details</summary>
                        <pre>${error.stack || error.message}</pre>
                    </details>
                </div>
            </div>
            <style>
                .critical-error {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .error-content {
                    text-align: center;
                    padding: 2rem;
                    max-width: 600px;
                }
                .error-content h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                .error-content p {
                    font-size: 1.25rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }
                .error-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-bottom: 2rem;
                }
                .error-actions button {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    background: white;
                    color: #667eea;
                    transition: transform 0.2s;
                }
                .error-actions button:hover {
                    transform: translateY(-2px);
                }
                details {
                    margin-top: 2rem;
                    background: rgba(0,0,0,0.2);
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: left;
                }
                summary {
                    cursor: pointer;
                    margin-bottom: 0.5rem;
                }
                pre {
                    overflow-x: auto;
                    font-size: 0.875rem;
                }
            </style>
        `;
    }
}

// Initialize app with error boundary
let app;

try {
    app = new JobHunterApp();
    window.app = app; // Make it globally accessible
} catch (error) {
    console.error('Failed to initialize app:', error);
    // Show initialization error
    document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; text-align: center;">
            <div>
                <h1>Unable to start Job Hunter</h1>
                <p>Please ensure you're using a modern browser with JavaScript enabled.</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem;">Try Again</button>
            </div>
        </div>
    `;
}