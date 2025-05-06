#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the current package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get current version
let [major, minor, patch] = packageJson.version.split('.').map(Number);

// Increment patch version
patch += 1;

// Update package.json with new version
packageJson.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Create/update version.json file for the PWA to check for updates
const versionInfo = {
  version: packageJson.version,
  buildDate: new Date().toISOString(),
  releaseNotes: process.argv[2] || 'Bug fixes and improvements',
  forceUpdate: process.argv[3] === 'true' || false
};

const versionJsonPath = path.join(__dirname, '..', 'public', 'version.json');
fs.writeFileSync(versionJsonPath, JSON.stringify(versionInfo, null, 2));

console.log(`Version updated to ${packageJson.version}`);
console.log(`Version file updated at ${versionJsonPath}`);
