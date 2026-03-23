const fs = require('fs');
const path = require('path');

const iowaFrontmatter = `---
institution: "University of Iowa"
location: "Iowa City, IA"
degree: "Masters in Computer Science (Fully Funded) | 3.9/4.0"
endDate: "May 2025"
coursework: "Applied Machine Learning, Distributed Algorithms, Independent study on Speech Synthesis"
order: "0"
---`;

const sjpFrontmatter = `---
location: "Sri Lanka"
endDate: "May 2018"
institution: "University of Sri Jayawardenepura, Sri Lanka"
degree: "B.Sc. in Computer Science"
coursework: "Algorithms"
order: "10"
---`;

function walkDir(dir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(walkDir(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

const allFiles = walkDir('resume-points').filter(f => f.includes('education'));

allFiles.forEach(file => {
    const lowercaseName = path.basename(file).toLowerCase();
    
    let targetFrontmatter = null;
    if (lowercaseName.includes('iowa')) {
        targetFrontmatter = iowaFrontmatter;
    } else if (lowercaseName.includes('sjp')) {
        targetFrontmatter = sjpFrontmatter;
    }

    if (targetFrontmatter) {
        let content = fs.readFileSync(file, 'utf-8');
        // Standardize line endings just in case
        content = content.replace(/\r\n/g, '\n');
        
        // Find the second '---'
        const firstMarker = content.indexOf('---');
        if (firstMarker !== -1) {
            const secondMarker = content.indexOf('---', firstMarker + 3);
            if (secondMarker !== -1) {
                // Determine what's after the second marker
                const body = content.substring(secondMarker + 3).trim();
                const newContent = targetFrontmatter + '\n\n' + body + '\n';
                fs.writeFileSync(file, newContent, 'utf-8');
                console.log('Updated ' + file);
            }
        }
    }
});
