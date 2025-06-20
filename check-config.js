const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔍 Checking for any remaining config files...\n');

// Check recycle bin or recently deleted
const possibleLocations = [
  path.join(os.homedir(), '.ez-deploy', 'config.json'),
  path.join(os.homedir(), '.ez-deploy', 'vault.encrypted'),
  path.join(os.homedir(), '.ezdeploy', 'config.json'),
  path.join(process.cwd(), 'Archive', '.ezdeploy-auth.json')
];

console.log('Checking locations:');
for (const loc of possibleLocations) {
  console.log(`${fs.existsSync(loc) ? '✅' : '❌'} ${loc}`);
}

// Check Archive folder
const archivePath = path.join(process.cwd(), 'Archive', '.ezdeploy-auth.json');
if (fs.existsSync(archivePath)) {
  console.log('\n📁 Found archived config!');
  const config = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
  console.log('Username:', config.github?.username);
  console.log('Has token:', !!config.github?.token);
}

// Let's recreate from the info we have
console.log('\n💡 To fix this, you have two options:');
console.log('\n1. Run init again with your credentials:');
console.log('   npx ez-deploy init');
console.log('\n2. If you still have your GitHub token, I can help restore it.');
