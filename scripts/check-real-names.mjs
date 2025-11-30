#!/usr/bin/env node

import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data = JSON.parse(fs.readFileSync(join(__dirname, '..', 'data', 'db-export.json'), 'utf8'));

console.log('MacBook models (real names, no escaping):');
console.log('='.repeat(70));
data.models.filter(m => m.slug.includes('macbook')).slice(0, 5).forEach(m => {
  console.log(m.name);
});

console.log('\niPad models (real names, no escaping):');
console.log('='.repeat(70));
data.models.filter(m => m.slug.includes('ipad')).slice(0, 5).forEach(m => {
  console.log(m.name);
});
