const fs = require('fs');
const path = require('path');

console.log('🍎 iOS Icon Fix for JobBoardPWA');
console.log('===============================\n');

// Check if icon directories exist
const iconDirs = [
    'assets/icons',
    'assets/icons/ios'
];

// Create directories if they don't exist
iconDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

// Check for existing icons
const requiredIcons = [
    { path: 'icon-192.png', critical: true },
    { path: 'icon-512.png', critical: true },
    { path: 'assets/icons/icon-180.png', critical: true }
];

let missingIcons = [];
requiredIcons.forEach(icon => {
    const fullPath = path.join(__dirname, icon.path);
    if (!fs.existsSync(fullPath)) {
        missingIcons.push(icon);
        console.log(`❌ Missing: ${icon.path}`);
    } else {
        console.log(`✅ Found: ${icon.path}`);
    }
});

// Update index.html with iOS meta tags
console.log('\n📝 Updating index.html with iOS meta tags...');

const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Check if iOS meta tags already exist
if (!indexContent.includes('apple-touch-icon-180x180')) {
    // Find where to insert (after existing apple-touch-icon)
    const insertAfter = '<link rel="apple-touch-icon" sizes="180x180" href="/JobBoardPWA/assets/icons/icon-180.png">';
    const replacement = `<link rel="apple-touch-icon" sizes="180x180" href="/JobBoardPWA/assets/icons/icon-180.png">
    
    <!-- iOS Specific Icons -->
    <link rel="apple-touch-icon" href="/JobBoardPWA/icon-192.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/JobBoardPWA/icon-192.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/JobBoardPWA/icon-192.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/JobBoardPWA/icon-192.png">
    
    <!-- Fallback for iOS -->
    <link rel="icon" type="image/png" href="/JobBoardPWA/icon-192.png">`;
    
    indexContent = indexContent.replace(insertAfter, replacement);
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Added iOS meta tags to index.html');
} else {
    console.log('✓ iOS meta tags already present');
}

// Instructions
console.log('\n📱 iOS Icon Setup Instructions:');
console.log('================================');

if (missingIcons.length > 0) {
    console.log('\n⚠️  You need to generate icons first!');
    console.log('1. Open generate-ios-icons.html in a browser');
    console.log('2. Click "Download All Icons"');
    console.log('3. Place the downloaded icons in the correct folders');
    console.log('4. Run this script again to verify');
} else {
    console.log('\n✅ All icons are in place!');
    console.log('\nNext steps:');
    console.log('1. Commit and push to GitHub');
    console.log('2. Wait for deployment');
    console.log('3. On iPhone: Clear Safari cache (Settings > Safari > Clear History)');
    console.log('4. Visit https://chudeemeke.github.io/JobBoardPWA/');
    console.log('5. Add to Home Screen');
    console.log('\nThe app should now show "JH" icon instead of "I"!');
}

console.log('\n💡 Tip: For best results on iOS:');
console.log('- Use Safari (not Chrome) to install');
console.log('- Clear cache before reinstalling');
console.log('- Delete old installation first if updating');
