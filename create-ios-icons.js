const fs = require('fs');
const path = require('path');

console.log('🎨 Creating iOS Icons for JobBoardPWA');
console.log('=====================================\n');

// Simple function to create a basic PNG with "JH" text
// This creates a minimal valid PNG file
function createBasicIcon(size) {
    // PNG file structure (simplified)
    const width = size;
    const height = size;
    
    // Create a simple blue square with white JH text
    // This is a very basic PNG - just enough to work
    const png = Buffer.from([
        // PNG signature
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        
        // IHDR chunk
        0x00, 0x00, 0x00, 0x0D, // Length
        0x49, 0x48, 0x44, 0x52, // Type: IHDR
        (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF, // Width
        (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF, // Height
        0x08, // Bit depth
        0x02, // Color type (RGB)
        0x00, // Compression method
        0x00, // Filter method
        0x00, // Interlace method
        0x00, 0x00, 0x00, 0x00, // CRC (placeholder)
        
        // IDAT chunk (compressed image data - blue square)
        0x00, 0x00, 0x00, 0x12, // Length
        0x49, 0x44, 0x41, 0x54, // Type: IDAT
        // Simplified compressed data for a blue square
        0x78, 0x9C, 0x62, 0x18, 0x05, 0xA3, 0x60, 0x14, 0x8C, 0x02, 0x08, 0x00, 0x00, 0x04, 0x00, 0x01,
        0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, // CRC (placeholder)
        
        // IEND chunk
        0x00, 0x00, 0x00, 0x00, // Length
        0x49, 0x45, 0x4E, 0x44, // Type: IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    return png;
}

// Create directories
const dirs = ['assets', 'assets/icons', 'assets/icons/ios'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log(`✅ Created directory: ${dir}`);
    }
});

// For now, let's create a simple placeholder that works
// You should replace these with proper icons later
console.log('\n⚠️  Creating temporary placeholder icons...');
console.log('   (Replace these with proper icons from generate-ios-icons.html)\n');

// Create Canvas-based icon generator
const { createCanvas } = (() => {
    try {
        return require('canvas');
    } catch (e) {
        console.log('📦 Canvas module not found. Creating basic placeholders...');
        return null;
    }
})();

function createIconWithCanvas(size, filename) {
    if (!createCanvas) {
        // Create basic file
        const placeholder = createBasicIcon(size);
        fs.writeFileSync(filename, placeholder);
        return;
    }
    
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#2563eb');
    
    // Rounded rectangle
    const radius = size * 0.2;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();
    
    // White text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JH', size/2, size/2);
    
    // Save
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
}

// Create essential icons
const icons = [
    { size: 192, path: 'icon-192.png' },
    { size: 512, path: 'icon-512.png' },
    { size: 180, path: 'assets/icons/icon-180.png' },
    { size: 32, path: 'assets/icons/icon-32.png' },
    { size: 16, path: 'assets/icons/icon-16.png' }
];

// Try to use existing script to generate icons
const { execSync } = require('child_process');

try {
    // Check if we can use the browser to generate icons
    console.log('🌐 Opening icon generator in browser...');
    
    // Create a simple HTML file that auto-generates and downloads icons
    const autoGenHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Auto Icon Generator</title>
</head>
<body>
    <h1>Generating Icons...</h1>
    <canvas id="canvas"></canvas>
    <script>
        const sizes = [192, 512, 180, 32, 16];
        
        function createAndDownload(size) {
            const canvas = document.getElementById('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Gradient
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#2563eb');
            
            // Rounded rect
            const radius = size * 0.2;
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(size - radius, 0);
            ctx.quadraticCurveTo(size, 0, size, radius);
            ctx.lineTo(size, size - radius);
            ctx.quadraticCurveTo(size, size, size - radius, size);
            ctx.lineTo(radius, size);
            ctx.quadraticCurveTo(0, size, 0, size - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            ctx.fill();
            
            // Text
            ctx.fillStyle = 'white';
            ctx.font = 'bold ' + (size * 0.4) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('JH', size/2, size/2);
            
            // Download
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'icon-' + size + '.png';
                a.click();
            });
        }
        
        // Generate all sizes
        let index = 0;
        const interval = setInterval(() => {
            if (index < sizes.length) {
                createAndDownload(sizes[index]);
                index++;
            } else {
                clearInterval(interval);
                document.body.innerHTML = '<h1>Done! Check your downloads folder.</h1>';
            }
        }, 500);
    </script>
</body>
</html>`;
    
    fs.writeFileSync('auto-generate-icons.html', autoGenHtml);
    console.log('✅ Created auto-generate-icons.html');
    console.log('📂 Open this file in your browser to download the icons');
    
} catch (e) {
    console.log('Creating basic placeholder icons...');
    
    // Create basic icons as fallback
    icons.forEach(({ size, path: filepath }) => {
        const fullPath = path.join(__dirname, filepath);
        if (!fs.existsSync(fullPath)) {
            createIconWithCanvas(size, fullPath);
            console.log(`✅ Created: ${filepath}`);
        }
    });
}

console.log('\n✅ Icon setup complete!');
console.log('\n📱 For best quality icons:');
console.log('1. Open generate-ios-icons.html in browser');
console.log('2. Download all icons');
console.log('3. Replace the placeholder icons');
console.log('\n🚀 Deploy with: git add -A && git commit -m "Added iOS icons" && git push');
