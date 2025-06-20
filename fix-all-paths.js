#!/usr/bin/env node

/**
 * Comprehensive path fix for JobBoardPWA
 * Fixes all deployment path issues across the entire project
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_PATH = '/JobBoardPWA/';
const OLD_PATHS = [
    '/JobBoardPWA/JobBoardPWA/JobBoardPWA/JobBoardPWA/job-hunter-app/',
    '/JobBoardPWA/JobBoardPWA/JobBoardPWA/job-hunter-app/',
    '/JobBoardPWA/JobBoardPWA/job-hunter-app/',
    '/JobBoardPWA/job-hunter-app/',
    '/job-hunter-app/'
];

// Files to update
const filesToUpdate = [
    'index.html',
    'manifest.json',
    'sw.js',
    'src/js/app.js',
    'src/js/config/quickstart.js',
    'src/views/dashboard.js',
    'src/views/login.js',
    'src/views/job-listings.js',
    'src/views/onboarding.js',
    'src/views/resume-manager.js',
    'src/views/applications.js',
    'src/views/admin-dashboard.js',
    'src/views/settings.js',
    'src/components/ai-assistant.js'
];

console.log(`🔧 Comprehensive Path Fix for JobBoardPWA`);
console.log(`📝 Replacing all incorrect paths with "${PROJECT_PATH}"`);
console.log('');

let totalReplacements = 0;
let filesFixed = 0;

// Function to fix paths in a file
function fixPaths(filePath) {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${filePath} (file not found)`);
        return;
    }
    
    try {
        let content = fs.readFileSync(fullPath, 'utf8');
        let fileReplacements = 0;
        
        // Replace all variations of incorrect paths
        OLD_PATHS.forEach(oldPath => {
            const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const matches = (content.match(regex) || []).length;
            
            if (matches > 0) {
                content = content.replace(regex, PROJECT_PATH);
                fileReplacements += matches;
                console.log(`   - Replaced "${oldPath}" → "${PROJECT_PATH}" (${matches} times)`);
            }
        });
        
        // Special fix for service worker registration
        content = content.replace(
            /navigator\.serviceWorker\.register\("([^"]+)"\)/g,
            (match, path) => {
                if (!path.endsWith('sw.js')) {
                    return match;
                }
                const newPath = PROJECT_PATH + 'sw.js';
                if (path !== newPath) {
                    fileReplacements++;
                    console.log(`   - Fixed service worker path: "${path}" → "${newPath}"`);
                    return `navigator.serviceWorker.register("${newPath}")`;
                }
                return match;
            }
        );
        
        if (fileReplacements > 0) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`✅ ${filePath} - Fixed ${fileReplacements} path${fileReplacements > 1 ? 's' : ''}`);
            totalReplacements += fileReplacements;
            filesFixed++;
        } else {
            console.log(`✓  ${filePath} - No changes needed`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

// Process all files
filesToUpdate.forEach(filePath => {
    fixPaths(filePath);
});

// Also scan src directories for any other JavaScript files
console.log('\n🔍 Scanning for additional JavaScript files...\n');

function scanDirectory(dir) {
    const fullPath = path.join(__dirname, dir);
    
    if (!fs.existsSync(fullPath)) {
        return;
    }
    
    const files = fs.readdirSync(fullPath);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fullFilePath = path.join(__dirname, filePath);
        const stat = fs.statSync(fullFilePath);
        
        if (stat.isDirectory()) {
            scanDirectory(filePath);
        } else if (file.endsWith('.js') && !filesToUpdate.includes(filePath)) {
            fixPaths(filePath);
        }
    });
}

// Scan src directory
scanDirectory('src');

console.log('');
console.log(`🎉 Complete! Fixed ${totalReplacements} path${totalReplacements !== 1 ? 's' : ''} across ${filesFixed} files.`);

// Additional validation
console.log('\n🔍 Validating critical paths...\n');

// Check if icons exist
const iconPaths = ['icon-192.png', 'icon-512.png', 'assets/icons/icon-32.png', 'assets/icons/icon-16.png', 'assets/icons/icon-180.png'];
iconPaths.forEach(iconPath => {
    const fullPath = path.join(__dirname, iconPath);
    if (fs.existsSync(fullPath)) {
        console.log(`✅ Icon found: ${iconPath}`);
    } else {
        console.log(`⚠️  Icon missing: ${iconPath} - Make sure to generate icons!`);
    }
});

// Final instructions
console.log('\n📋 Next steps:');
console.log('1. Generate icons if missing (use create-professional-icons.html)');
console.log('2. Test locally with: python -m http.server 8080');
console.log('3. Deploy to GitHub:');
console.log('   git add -A');
console.log('   git commit -m "Fixed all deployment paths"');
console.log('   git push origin main');
console.log('');
console.log(`📱 Your PWA will be available at: https://[username].github.io${PROJECT_PATH}`);
