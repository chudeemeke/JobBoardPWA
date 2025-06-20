#!/usr/bin/env node

/**
 * Fix deployment paths for GitHub Pages
 * Updates all /job-hunter-app/ references to match repository name
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OLD_PATH = '/job-hunter-app/';
const NEW_PATH = '/JobBoardPWA/';  // Change this to match your GitHub repo name

// Files to update
const filesToUpdate = [
    'index.html',
    'manifest.json',
    'sw.js',
    'src/js/app.js',
    'src/views/dashboard.js',
    'src/views/login.js',
    'src/views/job-listings.js',
    'src/views/onboarding.js',
    'src/views/resume-manager.js',
    'src/views/applications.js',
    'src/views/admin-dashboard.js',
    'src/views/settings.js'
];

console.log(`🔧 Fixing deployment paths...`);
console.log(`📝 Replacing "${OLD_PATH}" with "${NEW_PATH}"`);
console.log('');

let totalReplacements = 0;

filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${filePath} (file not found)`);
        return;
    }
    
    try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        // Count replacements
        const matches = (content.match(new RegExp(OLD_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        
        if (matches > 0) {
            // Replace all occurrences
            content = content.replace(new RegExp(OLD_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_PATH);
            
            // Write back
            fs.writeFileSync(fullPath, content, 'utf8');
            
            console.log(`✅ ${filePath} - Fixed ${matches} path${matches > 1 ? 's' : ''}`);
            totalReplacements += matches;
        } else {
            console.log(`✓  ${filePath} - No changes needed`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
});

console.log('');
console.log(`🎉 Complete! Fixed ${totalReplacements} path${totalReplacements !== 1 ? 's' : ''} across ${filesToUpdate.length} files.`);

// Additional checks
console.log('\n📋 Post-fix checklist:');
console.log('1. Verify your GitHub repository name matches the path');
console.log('2. Ensure GitHub Pages is enabled for your repository');
console.log('3. Check that icons exist in the correct location');
console.log('4. Test the PWA installation after deployment');

// Show deployment instructions
console.log('\n🚀 Ready to deploy! Run:');
console.log('   git add -A');
console.log('   git commit -m "Fixed deployment paths for GitHub Pages"');
console.log('   git push origin main');
console.log('');
console.log(`📱 Your PWA will be available at: https://[username].github.io${NEW_PATH}`);
