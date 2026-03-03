import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, '..', 'resume-points');
const sections = ['experience', 'projects', 'education', 'skills'];

sections.forEach(section => {
    const sectionDir = path.join(baseDir, section);
    if (!fs.existsSync(sectionDir)) return;

    const items = fs.readdirSync(sectionDir);
    for (const item of items) {
        const itemPath = path.join(sectionDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            const role = item;
            const targetRoleDir = path.join(baseDir, role);
            const targetSectionDir = path.join(targetRoleDir, section);

            if (!fs.existsSync(targetRoleDir)) fs.mkdirSync(targetRoleDir, { recursive: true });
            if (!fs.existsSync(targetSectionDir)) fs.mkdirSync(targetSectionDir, { recursive: true });

            const files = fs.readdirSync(itemPath);
            for (const file of files) {
                const oldFilePath = path.join(itemPath, file);
                const newFilePath = path.join(targetSectionDir, file);
                fs.renameSync(oldFilePath, newFilePath);
            }
            fs.rmdirSync(itemPath);
        } else {
            const role = 'base';
            const targetRoleDir = path.join(baseDir, role);
            const targetSectionDir = path.join(targetRoleDir, section);

            if (!fs.existsSync(targetRoleDir)) fs.mkdirSync(targetRoleDir, { recursive: true });
            if (!fs.existsSync(targetSectionDir)) fs.mkdirSync(targetSectionDir, { recursive: true });

            const newFilePath = path.join(targetSectionDir, item);
            fs.renameSync(itemPath, newFilePath);
        }
    }
    fs.rmdirSync(sectionDir);
});

console.log("Migration complete.");
