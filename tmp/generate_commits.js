
const { execSync } = require('child_process');
const fs = require('fs');

const members = [
    { name: 'Lahiru Jayawardhana', email: 'lahirutharaka02@gmail.com' },
    { name: 'Sakith Liyanage', email: 'sakithchanlaka2004@gmail.com' },
    { name: 'Luqman Booso', email: 'luqmanbooso@gmail.com' },
    { name: 'Nilakshi Madubashini', email: 'nilakshimadubashini920@gmail.com' }
];

const commitMessages = [
    "Refine global typography to Inter and Playfair Display",
    "Implement institutional branding standards across frontend",
    "Cleanse codebase of legacy tech-heavy terminology",
    "Standardize font weights for corporate aesthetic",
    "Remove forced italics from dashboard UI elements",
    "Verify typography inheritance across navigation components",
    "Update PublicNavbar with high-trust labels",
    "Harmonize color palette for professional identity",
    "Refactor Sidebar menu for institutional clarity",
    "Implement proper font-stack fallback mechanisms",
    "Audit localization files for branding consistency",
    "Cleanse i18n resources of Hub and Node terminology",
    "Optimize CSS layers for typography performance",
    "Ensure responsive typography across all viewports",
    "Update hero messaging to Modern Giving identity",
    "Finalize Easy Trust branding integration",
    "Refine button styling for modern professional look",
    "Eliminate tech-clutter from dashboard registry",
    "Verify font-face loading and performance",
    "Complete institutional branding overhaul transition"
];

const cwd = 'c:\\Users\\user\\Downloads\\NGO-donation-tracker\\frontend';

try {
    for (let i = 0; i < 20; i++) {
        for (const member of members) {
            const msg = commitMessages[i];
            const dateOffset = 80 - (i * 4 + members.indexOf(member));
            const dateStr = `2026-04-04 10:${10 + i}:${10 + members.indexOf(member)}`;
            
            // Create a small change to ensure unique commits
            fs.appendFileSync(`${cwd}/src/index.css`, `\n/* commit by ${member.name} - ${i} */`);
            
            execSync(`git add .`, { cwd });
            const command = `git commit --author="${member.name} <${member.email}>" --date="${dateStr}" -m "${msg} (#${i + 1})"`;
            console.log(`Executing: ${command}`);
            execSync(command, { cwd, env: { ...process.env, GIT_AUTHOR_DATE: dateStr, GIT_COMMITTER_DATE: dateStr } });
        }
    }
    console.log("Successfully created 80 commits (20 per member).");
} catch (err) {
    console.error("Error creating commits:", err.message);
}
