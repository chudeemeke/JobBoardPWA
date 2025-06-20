// Debug script for JobBoardPWA
// Add this to index.html temporarily to debug issues

console.log('🔍 JobBoardPWA Debug Info');
console.log('=======================');

// Check if critical dependencies loaded
console.log('✓ Dexie loaded:', typeof Dexie !== 'undefined');
console.log('✓ Config loaded:', typeof window.JOB_HUNTER_CONFIG !== 'undefined');

// Check module loading
console.log('\n📦 Module Loading:');
console.log('- Current URL:', window.location.href);
console.log('- Base path:', window.location.pathname);

// Check for common issues
if (window.location.protocol === 'file:') {
    console.error('⚠️ Running from file:// protocol - modules won\'t load!');
    console.error('   Use a local server: python -m http.server 8080');
}

// Monitor import errors
window.addEventListener('error', (e) => {
    if (e.message.includes('Failed to fetch dynamically imported module')) {
        console.error('❌ Module import failed:', e.message);
        console.error('   Check file paths and CORS settings');
    }
});

// Check service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
        console.log('\n👷 Service Worker:', regs.length > 0 ? 'Registered' : 'Not registered');
        regs.forEach(reg => {
            console.log('  - Scope:', reg.scope);
            console.log('  - Active:', reg.active?.state);
        });
    });
}

// Check IndexedDB
if ('indexedDB' in window) {
    indexedDB.databases().then(dbs => {
        console.log('\n💾 Databases:', dbs.length);
        dbs.forEach(db => console.log('  -', db.name, 'v' + db.version));
    }).catch(e => console.log('Could not list databases'));
}

console.log('\n=======================');
console.log('If you see module errors, the app may need to be served from a web server.');
console.log('GitHub Pages deployment should work fine.');
