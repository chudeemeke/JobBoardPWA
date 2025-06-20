const path = require('path');
const os = require('os');
const fs = require('fs');

async function deepDebug() {
  console.log('🔍 EZ-Deploy Deep Debug\n');
  
  // Check all directories and files
  const homeDir = os.homedir();
  const dirs = [
    path.join(homeDir, '.ezdeploy'),
    path.join(homeDir, '.ez-deploy')
  ];
  
  for (const dir of dirs) {
    console.log(`\n📂 Checking ${dir}:`);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      console.log('  Files:', files);
      
      // Check each file
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${stats.size} bytes)`);
        
        // Show content preview for small files
        if (stats.size < 1000 && !file.includes('vault')) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            console.log(`    Preview: ${content.substring(0, 100)}...`);
          } catch (e) {
            console.log(`    (binary or encrypted)`);
          }
        }
      }
    } else {
      console.log('  ❌ Directory does not exist');
    }
  }
  
  // Try to load credential manager and see what happens
  console.log('\n🔐 Testing credential manager:');
  try {
    const credentialManager = require('../EZ-Deploy/lib/security/credential-manager.js');
    
    console.log('Has credentials:', await credentialManager.hasCredentials());
    
    try {
      const creds = await credentialManager.getCredentials();
      console.log('Retrieved username:', creds.github?.username);
      console.log('Has token:', !!creds.github?.token);
    } catch (e) {
      console.log('Error getting credentials:', e.message);
    }
  } catch (e) {
    console.log('Error loading credential manager:', e.message);
  }
  
  // Check what configManager expects
  console.log('\n📋 Testing config manager:');
  try {
    const configManager = require('../EZ-Deploy/lib/utils/config.js');
    
    try {
      const creds = await configManager.getCredentials();
      console.log('Config manager got credentials');
    } catch (e) {
      console.log('Config manager error:', e.message);
    }
  } catch (e) {
    console.log('Error loading config manager:', e.message);
  }
}

deepDebug().catch(console.error);
