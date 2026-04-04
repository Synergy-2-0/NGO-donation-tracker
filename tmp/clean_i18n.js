
import fs from 'fs';
const content = fs.readFileSync('c:\\Users\\user\\Downloads\\NGO-donation-tracker\\frontend\\src\\i18n.js', 'utf8');
const processed = content
  .replace(/ Hub/g, '')
  .replace(/Hub /g, '')
  .replace(/Hub/g, '')
  .replace(/ HUB/g, '')
  .replace(/HUB /g, '')
  .replace(/HUB/g, '')
  .replace(/ Sync/g, '')
  .replace(/Sync /g, '')
  .replace(/Sync/g, '')
  .replace(/ sync/g, '')
  .replace(/sync /g, '')
  .replace(/sync/g, '')
  .replace(/ Node/g, '')
  .replace(/node /g, '')
  .replace(/ Node/g, '')
  .replace(/Node /g, '')
  .replace(/ Node/g, '');

fs.writeFileSync('c:\\Users\\user\\Downloads\\NGO-donation-tracker\\frontend\\src\\i18n.js', processed);
console.log('Processed i18n.js successfully');
