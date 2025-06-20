// Quick start configuration - prevents slow loading

window.JOB_HUNTER_CONFIG = {
    // Skip external API calls on startup
    skipInitialSync: true,
    
    // Disable community gist if not configured
    disableCommunityGist: true,
    
    // Use faster CDN for Dexie
    dexieCDN: 'https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js',
    
    // Timeout for external requests
    requestTimeout: 5000, // 5 seconds max
    
    // Enable debug mode
    debug: true
};

// Override console.log to show in UI
const originalLog = console.log;
console.log = function(...args) {
    originalLog.apply(console, args);
    
    // Show in UI if app is loaded
    if (window.app?.services?.message) {
        window.app.services.message.info(args.join(' '));
    }
};

// Add performance timing
window.APP_START_TIME = Date.now();

window.addEventListener('load', () => {
    const loadTime = Date.now() - window.APP_START_TIME;
    console.log(`Page load time: ${loadTime}ms`);
    
    if (loadTime > 10000) {
        console.error('App is taking too long to load!');
        
        // Show manual start button
        if (!window.app?.initialized) {
            document.body.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h1>Job Hunter Pro</h1>
                    <p>The app is taking longer than expected to load.</p>
                    <button onclick="window.location.reload()" style="
                        padding: 1rem 2rem;
                        font-size: 1.2rem;
                        background: #6366f1;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                    ">
                        Reload App
                    </button>
                    <br><br>
                    <details>
                        <summary>Troubleshooting</summary>
                        <ul style="text-align: left; max-width: 400px; margin: 1rem auto;">
                            <li>Clear browser cache and cookies</li>
                            <li>Disable browser extensions</li>
                            <li>Try in incognito/private mode</li>
                            <li>Check browser console for errors (F12)</li>
                        </ul>
                    </details>
                </div>
            `;
        }
    }
});

// Monitor initialization stages
window.APP_INIT_STAGES = {
    'page_loaded': false,
    'dexie_loaded': false,
    'services_loaded': false,
    'ui_loaded': false,
    'app_ready': false
};

window.markInitStage = function(stage) {
    window.APP_INIT_STAGES[stage] = true;
    const elapsed = Date.now() - window.APP_START_TIME;
    console.log(`✓ ${stage} completed in ${elapsed}ms`);
    
    // Check if all stages complete
    const allComplete = Object.values(window.APP_INIT_STAGES).every(v => v);
    if (allComplete) {
        console.log('🎉 App fully loaded!');
    }
};

// Set page loaded
window.markInitStage('page_loaded');
