import fs from 'fs';
const path = 'c:\\Users\\user\\Downloads\\NGO-donation-tracker\\frontend\\src\\pages\\DashboardPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace font-black with font-extrabold
content = content.replace(/font-black/g, 'font-extrabold');

// Remove forced italics from classes
content = content.replace(/className=(["`])([^"`]*)\s*italic\s*([^"`]*)(["`])/g, 'className=$1$2 $3$4');
content = content.replace(/\s\s+/g, ' '); // Clean up extra spaces

// Clean up specific header back to branding intent
if (!content.includes('Modern Giving.')) {
    content = content.replace(/\{t\('dashboard\.welcome'\)\},\s*<span[^>]*>\{user\?.name\?.split\(' '\)\[0\]\}<\/span>/, 'Modern Giving. <span className="text-orange-500">Easy Trust.</span>');
}

fs.writeFileSync(path, content);
console.log('Processed DashboardPage.jsx successfully');
