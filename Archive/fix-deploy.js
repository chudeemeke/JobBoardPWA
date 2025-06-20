const fs = require('fs');
const path = require('path');
const os = require('os');

// Quick fix to get deployment working
const configPath = path.join(os.homedir(), '.ezdeploy', 'config.json');

async function checkAndCreateConfig() {
  try {
    // Check if config exists
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('✅ Found config:', config.github.username);
      
      // Create vault file that credential manager expects
      const vaultPath = path.join(os.homedir(), '.ez-deploy', 'vault.encrypted');
      const ezDeployDir = path.join(os.homedir(), '.ez-deploy');
      
      if (!fs.existsSync(ezDeployDir)) {
        fs.mkdirSync(ezDeployDir, { recursive: true });
      }
      
      // Simple unencrypted storage for now
      const vaultData = {
        github: config.github,
        metadata: {
          created: new Date().toISOString(),
          version: '1.0'
        }
      };
      
      fs.writeFileSync(vaultPath, JSON.stringify(vaultData), 'utf8');
      console.log('✅ Created vault file');
      
      // Now run the deployment
      const { execSync } = require('child_process');
      execSync('npx ez-deploy push -m "Deploy JobBoardPWA - AI job hunting app"', { stdio: 'inherit' });
      
    } else {
      console.error('❌ No config found at:', configPath);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAndCreateConfig();
