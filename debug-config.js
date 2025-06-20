const path = require('path');
const os = require('os');
const fs = require('fs');

async function debugConfig() {
  console.log('🔍 EZ-Deploy Configuration Debug\n');
  
  // Check all possible config locations
  const locations = [
    path.join(os.homedir(), '.ezdeploy', 'config.json'),
    path.join(os.homedir(), '.ez-deploy', 'vault.encrypted'),
    path.join(os.homedir(), '.ez-deploy', 'config.json'),
    path.join(process.cwd(), '.ezdeploy.json')
  ];
  
  console.log('Checking configuration files:');
  for (const loc of locations) {
    const exists = fs.existsSync(loc);
    console.log(`${exists ? '✅' : '❌'} ${loc}`);
    
    if (exists) {
      const stats = fs.statSync(loc);
      console.log(`   Size: ${stats.size} bytes`);
      console.log(`   Modified: ${stats.mtime}`);
    }
  }
  
  // Check what credential manager is looking for
  console.log('\n📂 Directory contents:');
  
  const ezdeployDir = path.join(os.homedir(), '.ezdeploy');
  if (fs.existsSync(ezdeployDir)) {
    const files = fs.readdirSync(ezdeployDir);
    console.log('\n.ezdeploy directory:', files);
  }
  
  const ezDeployDir = path.join(os.homedir(), '.ez-deploy');
  if (fs.existsSync(ezDeployDir)) {
    const files = fs.readdirSync(ezDeployDir);
    console.log('\n.ez-deploy directory:', files);
  }
  
  // Try to load the config directly
  console.log('\n📄 Config contents:');
  const configPath = path.join(os.homedir(), '.ez-deploy', 'config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('Username:', config.github?.username);
    console.log('Email:', config.github?.email || config.author?.email);
    console.log('Token:', config.github?.token ? '***' + config.github.token.slice(-4) : 'NOT FOUND');
  }
  
  // Also check .ezdeploy (without dash)
  const configPath2 = path.join(os.homedir(), '.ezdeploy', 'config.json');
  if (fs.existsSync(configPath2)) {
    console.log('\n📄 Found config in .ezdeploy (no dash):');
    const config = JSON.parse(fs.readFileSync(configPath2, 'utf8'));
    console.log('Username:', config.github?.username);
    console.log('Email:', config.github?.email || config.author?.email);
    console.log('Token:', config.github?.token ? '***' + config.github.token.slice(-4) : 'NOT FOUND');
  }
}

debugConfig().catch(console.error);
