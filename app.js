// SubSentry - Subscription Tracker Application
// Navigation and State Management

// Import Supabase client (optional - falls back to demo mode if not configured)
let supabase, auth, db;

// Try to load Supabase
(async () => {
    try {
        const supabaseModule = await import('./lib/supabase-client.js');
        supabase = supabaseModule.supabase;
        auth = supabaseModule.auth;
        db = supabaseModule.db;
        console.log('✅ Supabase connected');
    } catch (error) {
        console.log('⚠️ Running in demo mode (Supabase not configured)', error);
    }
})();

const app = {
    currentScreen: 'login',
    subscriptions: [
        { id: 1, name: 'Netflix', icon: '🎬', amount: 15.99, frequency: 'Monthly', nextBilling: '2025-11-20', status: 'active' },
        { id: 2, name: 'Spotify', icon: '🎵', amount: 9.99, frequency: 'Monthly', nextBilling: '2025-11-18', status: 'due-soon' },
        { id: 3, name: 'Adobe Creative Cloud', icon: '🎨', amount: 54.99, frequency: 'Monthly', nextBilling: '2025-11-25', status: 'active' },
        { id: 4, name: 'Gym Membership', icon: '💪', amount: 45.00, frequency: 'Monthly', nextBilling: '2025-11-12', status: 'overdue' },
        { id: 5, name: 'Cloud Storage', icon: '☁️', amount: 11.99, frequency: 'Monthly', nextBilling: '2025-11-22', status: 'active' }
    ],
    currentSubscription: null,
    settings: {
        emailNotifications: true,
        reminderDays: 3,
        currency: 'USD'
    }
};

// Initialize app
async function init() {
    console.log('🚀 SubSentry initializing...');
    await checkAuth();
}

// Navigation function
function navigateTo(screenName, data = null) {
    app.currentScreen = screenName;
    if (data) {
        app.currentSubscription = data;
    }
    renderScreen(screenName);
}

// Render screen based on current state
function renderScreen(screenName) {
    const appContainer = document.getElementById('app');
    
    const screens = {
        'login': renderLogin,
        'dashboard': renderDashboard,
        'create': renderCreateSubscription,
        'detail': renderSubscriptionDetail,
        'reminder': renderReminderSetup,
        'confirmation': renderConfirmation,
        'settings': renderSettings
    };
    
    if (screens[screenName]) {
        appContainer.innerHTML = screens[screenName]();
        attachEventListeners();
    }
}

// Screen: Login
function renderLogin() {
    return `
        <div class="screen active" id="login-screen">
            <div class="login-container">
                <div class="login-card">
                    <div class="logo">🔔</div>
                    <h1>Welcome to SubSentry</h1>
                    <p>Take control of your subscriptions and never miss a payment again</p>
                    
                    <button class="btn-google" onclick="handleGoogleSignIn()">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
                            <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
                            <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
                            <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
                        </svg>
                        Continue with Google
                    </button>
                    
                    <div class="divider">
                        <span>or</span>
                    </div>
                    
                    <button class="btn-primary" onclick="navigateTo('dashboard')" style="width: 100%;">
                        Sign In with Email
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Screen: Dashboard
function renderDashboard() {
    const totalMonthly = app.subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const activeCount = app.subscriptions.filter(s => s.status === 'active').length;
    const dueSoonCount = app.subscriptions.filter(s => s.status === 'due-soon').length;
    const overdueCount = app.subscriptions.filter(s => s.status === 'overdue').length;
    
    return `
        <div class="screen active" id="dashboard-screen">
            <div class="app-layout">
                ${renderSidebar('dashboard')}
                <div class="main-content">
                    <div class="page-header">
                        <div class="header-left">
                            <h1>Dashboard</h1>
                            <p>You're all caught up — great job!</p>
                        </div>
                        <button class="btn-primary" onclick="navigateTo('create')">
                            <span>+</span> Add Subscription
                        </button>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-header">
                                <div>
                                    <div class="stat-value">$${totalMonthly.toFixed(2)}</div>
                                    <div class="stat-label">Total Monthly</div>
                                </div>
                                <div class="stat-icon blue">💰</div>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-header">
                                <div>
                                    <div class="stat-value">${activeCount}</div>
                                    <div class="stat-label">Active Subscriptions</div>
                                </div>
                                <div class="stat-icon green">✓</div>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-header">
                                <div>
                                    <div class="stat-value">${dueSoonCount}</div>
                                    <div class="stat-label">Due Soon</div>
                                </div>
                                <div class="stat-icon orange">⏰</div>
                            </div>
                        </div>
                    </div>
                    
                    ${overdueCount > 0 ? `
                        <div class="subscription-list" style="margin-bottom: 24px; border: 2px solid var(--error-red);">
                            <div class="list-header" style="background: #FFEBEE;">
                                <h2 style="color: var(--error-red);">⚠️ Overdue Subscriptions</h2>
                            </div>
                            ${app.subscriptions.filter(s => s.status === 'overdue').map(sub => renderSubscriptionItem(sub)).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="subscription-list">
                        <div class="list-header">
                            <h2>All Subscriptions</h2>
                        </div>
                        ${app.subscriptions.length > 0 ? 
                            app.subscriptions.map(sub => renderSubscriptionItem(sub)).join('') :
                            `<div class="empty-state">
                                <div class="empty-icon">📋</div>
                                <h3>No subscriptions yet</h3>
                                <p>Let's add your first one and start tracking your spending</p>
                                <button class="btn-primary" onclick="navigateTo('create')">Add Your First Subscription</button>
                            </div>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Subscription Item Component
function renderSubscriptionItem(sub) {
    const statusBadges = {
        'active': '<span class="badge active">Active</span>',
        'due-soon': '<span class="badge due-soon">Due Soon</span>',
        'overdue': '<span class="badge overdue">Overdue</span>'
    };
    
    return `
        <div class="subscription-item" onclick="navigateTo('detail', ${sub.id})">
            <div class="sub-icon">${sub.icon}</div>
            <div class="sub-details">
                <div class="sub-name">${sub.name}</div>
                <div class="sub-info">${sub.frequency} • Next billing: ${sub.nextBilling}</div>
            </div>
            <div class="sub-amount">$${sub.amount.toFixed(2)}</div>
            ${statusBadges[sub.status]}
            <button class="btn-secondary" onclick="event.stopPropagation(); navigateTo('reminder', ${sub.id})">
                Set Reminder
            </button>
        </div>
    `;
}

// Screen: Create Subscription
function renderCreateSubscription() {
    return `
        <div class="screen active" id="create-screen">
            <div class="app-layout">
                ${renderSidebar('dashboard')}
                <div class="main-content">
                    <a class="back-button" onclick="navigateTo('dashboard')">
                        ← Back to Dashboard
                    </a>
                    
                    <div class="page-header">
                        <div class="header-left">
                            <h1>Add New Subscription</h1>
                            <p>Track a new recurring payment</p>
                        </div>
                    </div>
                    
                    <div class="form-container">
                        <form id="subscription-form" onsubmit="handleCreateSubscription(event)">
                            <div class="form-group">
                                <label for="sub-name">Subscription Name *</label>
                                <input type="text" id="sub-name" class="form-input" placeholder="e.g., Netflix, Spotify" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="sub-amount">Amount *</label>
                                <input type="number" id="sub-amount" class="form-input" placeholder="0.00" step="0.01" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="sub-frequency">Billing Frequency *</label>
                                <select id="sub-frequency" class="form-select" required>
                                    <option value="">Select frequency</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="sub-date">Next Billing Date *</label>
                                <input type="date" id="sub-date" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="sub-icon">Icon (Emoji)</label>
                                <input type="text" id="sub-icon" class="form-input" placeholder="🎬" maxlength="2">
                            </div>
                            
                            <div class="form-group">
                                <label for="sub-notes">Notes (Optional)</label>
                                <textarea id="sub-notes" class="form-textarea" placeholder="Add any additional details..."></textarea>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-secondary" onclick="navigateTo('dashboard')">Cancel</button>
                                <button type="submit" class="btn-primary">Add Subscription</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Screen: Subscription Detail
function renderSubscriptionDetail() {
    const sub = app.subscriptions.find(s => s.id === app.currentSubscription);
    if (!sub) {
        navigateTo('dashboard');
        return '';
    }
    
    const annualCost = sub.frequency === 'Monthly' ? sub.amount * 12 : 
                       sub.frequency === 'Weekly' ? sub.amount * 52 : 
                       sub.frequency === 'Quarterly' ? sub.amount * 4 : sub.amount;
    
    return `
        <div class="screen active" id="detail-screen">
            <div class="app-layout">
                ${renderSidebar('dashboard')}
                <div class="main-content">
                    <a class="back-button" onclick="navigateTo('dashboard')">
                        ← Back to Dashboard
                    </a>
                    
                    <div class="page-header">
                        <div class="header-left">
                            <h1>${sub.icon} ${sub.name}</h1>
                            <p>Subscription details and history</p>
                        </div>
                        <button class="btn-primary" onclick="navigateTo('reminder', ${sub.id})">
                            Set Reminder
                        </button>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-header">
                                <div>
                                    <div class="stat-value">$${sub.amount.toFixed(2)}</div>
                                    <div class="stat-label">${sub.frequency} Cost</div>
                                </div>
                                <div class="stat-icon blue">💵</div>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-header">
                                <div>
                                    <div class="stat-value">$${annualCost.toFixed(2)}</div>
                                    <div class="stat-label">Annual Cost</div>
                                </div>
                                <div class="stat-icon green">📊</div>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-header">
                                <div>
                                    <div class="stat-value">${sub.nextBilling}</div>
                                    <div class="stat-label">Next Billing</div>
                                </div>
                                <div class="stat-icon orange">📅</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="subscription-list">
                        <div class="list-header">
                            <h2>Subscription Information</h2>
                        </div>
                        <div style="padding: 24px;">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>Status</h4>
                                    <p>Current subscription status</p>
                                </div>
                                <span class="badge ${sub.status}">${sub.status.replace('-', ' ').toUpperCase()}</span>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>Billing Frequency</h4>
                                    <p>How often you're charged</p>
                                </div>
                                <span>${sub.frequency}</span>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>Amount</h4>
                                    <p>Cost per billing cycle</p>
                                </div>
                                <span style="font-weight: 600;">$${sub.amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 24px; display: flex; gap: 12px;">
                        <button class="btn-secondary" onclick="handleEditSubscription(${sub.id})">Edit Subscription</button>
                        <button class="btn-secondary" style="color: var(--error-red); border-color: var(--error-red);" onclick="handleDeleteSubscription(${sub.id})">
                            Delete Subscription
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Screen: Reminder Setup
function renderReminderSetup() {
    const sub = app.subscriptions.find(s => s.id === app.currentSubscription);
    if (!sub) {
        navigateTo('dashboard');
        return '';
    }
    
    return `
        <div class="screen active" id="reminder-screen">
            <div class="app-layout">
                ${renderSidebar('dashboard')}
                <div class="main-content">
                    <a class="back-button" onclick="navigateTo('detail', ${sub.id})">
                        ← Back to Details
                    </a>
                    
                    <div class="page-header">
                        <div class="header-left">
                            <h1>Set Reminder</h1>
                            <p>Get notified before ${sub.name} renews</p>
                        </div>
                    </div>
                    
                    <div class="form-container">
                        <form id="reminder-form" onsubmit="handleSetReminder(event, ${sub.id})">
                            <div class="form-group">
                                <label for="reminder-days">Remind me before billing</label>
                                <select id="reminder-days" class="form-select" required>
                                    <option value="1">1 day before</option>
                                    <option value="3" selected>3 days before</option>
                                    <option value="7">1 week before</option>
                                    <option value="14">2 weeks before</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="reminder-method">Notification Method</label>
                                <select id="reminder-method" class="form-select" required>
                                    <option value="email">Email</option>
                                    <option value="push">Push Notification</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="reminder-message">Custom Message (Optional)</label>
                                <textarea id="reminder-message" class="form-textarea" placeholder="Add a personal note to your reminder..."></textarea>
                            </div>
                            
                            <div class="subscription-list" style="margin: 24px 0;">
                                <div style="padding: 20px; background: var(--light-blue); border-radius: 12px;">
                                    <h4 style="margin-bottom: 8px;">📧 Preview</h4>
                                    <p style="color: var(--text-primary);">
                                        You'll receive a reminder on <strong>${calculateReminderDate(sub.nextBilling, 3)}</strong> 
                                        about your ${sub.name} subscription ($${sub.amount.toFixed(2)}) renewing on ${sub.nextBilling}.
                                    </p>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-secondary" onclick="navigateTo('detail', ${sub.id})">Cancel</button>
                                <button type="submit" class="btn-primary">Set Reminder</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Screen: Confirmation
function renderConfirmation() {
    return `
        <div class="screen active" id="confirmation-screen">
            <div class="app-layout">
                ${renderSidebar('dashboard')}
                <div class="main-content">
                    <div class="confirmation-container">
                        <div class="confirmation-card">
                            <div class="success-icon">✓</div>
                            <h2>All Set!</h2>
                            <p>Your reminder has been scheduled successfully. We'll notify you before your subscription renews.</p>
                            <button class="btn-primary" onclick="navigateTo('dashboard')" style="width: 100%;">
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Screen: Settings
function renderSettings() {
    return `
        <div class="screen active" id="settings-screen">
            <div class="app-layout">
                ${renderSidebar('settings')}
                <div class="main-content">
                    <div class="page-header">
                        <div class="header-left">
                            <h1>Settings</h1>
                            <p>Manage your account and preferences</p>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3>👤 Profile</h3>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Name</h4>
                                <p>Priya Kumar</p>
                            </div>
                            <button class="btn-secondary">Edit</button>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Email</h4>
                                <p>priya.kumar@email.com</p>
                            </div>
                            <button class="btn-secondary">Edit</button>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3>🔔 Notifications</h3>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Email Notifications</h4>
                                <p>Receive reminder emails before subscriptions renew</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked onchange="toggleSetting('emailNotifications')">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Push Notifications</h4>
                                <p>Get push notifications on your device</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked onchange="toggleSetting('pushNotifications')">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Default Reminder Time</h4>
                                <p>How many days before billing to remind you</p>
                            </div>
                            <select class="form-select" style="width: 150px;" onchange="updateReminderDays(this.value)">
                                <option value="1">1 day</option>
                                <option value="3" selected>3 days</option>
                                <option value="7">7 days</option>
                                <option value="14">14 days</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3>💰 Preferences</h3>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Currency</h4>
                                <p>Display amounts in your preferred currency</p>
                            </div>
                            <select class="form-select" style="width: 150px;">
                                <option value="USD" selected>USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Theme</h4>
                                <p>Choose your preferred color theme</p>
                            </div>
                            <select class="form-select" style="width: 150px;">
                                <option value="light" selected>Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3>🔒 Security</h3>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Change Password</h4>
                                <p>Update your account password</p>
                            </div>
                            <button class="btn-secondary">Change</button>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Two-Factor Authentication</h4>
                                <p>Add an extra layer of security</p>
                            </div>
                            <button class="btn-secondary">Enable</button>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3>ℹ️ About</h3>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Version</h4>
                                <p>SubSentry v1.0.0</p>
                            </div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4>Help & Support</h4>
                                <p>Get help or contact support</p>
                            </div>
                            <button class="btn-secondary">Contact</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Sidebar Component
function renderSidebar(activeItem) {
    return `
        <div class="sidebar">
            <div class="sidebar-logo">
                <h2>🔔 SubSentry</h2>
            </div>
            <nav class="nav-menu">
                <a class="nav-item ${activeItem === 'dashboard' ? 'active' : ''}" onclick="navigateTo('dashboard')">
                    <span>📊</span> Dashboard
                </a>
                <a class="nav-item" onclick="navigateTo('create')">
                    <span>➕</span> Add Subscription
                </a>
                <a class="nav-item ${activeItem === 'settings' ? 'active' : ''}" onclick="navigateTo('settings')">
                    <span>⚙️</span> Settings
                </a>
            </nav>
        </div>
    `;
}

// Authentication Handlers
async function handleGoogleSignIn() {
    if (auth) {
        // Supabase is configured - use real authentication
        console.log('🔐 Signing in with Google...');
        const { data, error } = await auth.signInWithGoogle();
        
        if (error) {
            console.error('Authentication error:', error);
            alert('Failed to sign in with Google. Please check your Supabase configuration.');
        } else {
            console.log('✅ Redirecting to Google...');
            // Google will redirect back to your app
        }
    } else {
        // Demo mode - go straight to dashboard
        console.log('⚠️ Demo mode - skipping authentication');
        navigateTo('dashboard');
    }
}

// Check for authentication on page load
async function checkAuth() {
    if (auth) {
        console.log('🔍 Checking authentication...');
        console.log('Current URL:', window.location.href);
        
        // Check if we're returning from OAuth (has code or access_token in URL)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        const hasAccessToken = hashParams.get('access_token');
        const hasCode = searchParams.get('code');
        
        console.log('Has access_token in hash:', !!hasAccessToken);
        console.log('Has code in search:', !!hasCode);
        
        if (hasAccessToken || hasCode) {
            console.log('🔄 Processing OAuth callback...');
            // Wait for Supabase to process the session
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        const { session, error } = await auth.getSession();
        
        console.log('Session:', session);
        console.log('Error:', error);
        
        if (session) {
            console.log('✅ User is authenticated:', session.user.email);
            app.currentUser = session.user;
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            navigateTo('dashboard');
        } else {
            console.log('ℹ️ No active session');
            navigateTo('login');
        }
    } else {
        // Demo mode
        console.log('⚠️ Auth not available, using demo mode');
        navigateTo('login');
    }
}

// Event Handlers
function handleCreateSubscription(event) {
    event.preventDefault();
    
    const newSub = {
        id: app.subscriptions.length + 1,
        name: document.getElementById('sub-name').value,
        amount: parseFloat(document.getElementById('sub-amount').value),
        frequency: document.getElementById('sub-frequency').value,
        nextBilling: document.getElementById('sub-date').value,
        icon: document.getElementById('sub-icon').value || '📦',
        status: 'active'
    };
    
    app.subscriptions.push(newSub);
    navigateTo('dashboard');
}

function handleSetReminder(event, subId) {
    event.preventDefault();
    navigateTo('confirmation');
}

function handleEditSubscription(subId) {
    alert('Edit functionality would open a form similar to create, pre-filled with current values');
}

function handleDeleteSubscription(subId) {
    if (confirm('Are you sure you want to delete this subscription?')) {
        app.subscriptions = app.subscriptions.filter(s => s.id !== subId);
        navigateTo('dashboard');
    }
}

function toggleSetting(setting) {
    app.settings[setting] = !app.settings[setting];
}

function updateReminderDays(days) {
    app.settings.reminderDays = parseInt(days);
}

// Helper Functions
function calculateReminderDate(billingDate, daysBefore) {
    const date = new Date(billingDate);
    date.setDate(date.getDate() - daysBefore);
    return date.toISOString().split('T')[0];
}

function attachEventListeners() {
    // Additional event listeners can be attached here if needed
}

// Make functions globally accessible for onclick handlers
window.navigateTo = navigateTo;
window.handleGoogleSignIn = handleGoogleSignIn;
window.handleCreateSubscription = handleCreateSubscription;
window.handleSetReminder = handleSetReminder;
window.handleEditSubscription = handleEditSubscription;
window.handleDeleteSubscription = handleDeleteSubscription;
window.toggleSetting = toggleSetting;
window.updateReminderDays = updateReminderDays;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
