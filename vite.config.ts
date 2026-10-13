import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

function localMdEditorPlugin() {
  return {
    name: 'local-md-editor',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        // Save raw markdown files in resume-points
        if (req.url === '/api/save-md' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const { filePath, content } = JSON.parse(body);
              const absolutePath = path.resolve(process.cwd(), 'src', filePath);
              fs.writeFileSync(absolutePath, content, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // Save resume content for a specific job submission
        if (req.url === '/api/save-submission' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const { company, jobId, jobName, content } = JSON.parse(body);
              if (!company || !jobId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Company and Job ID are required' }));
                return;
              }

              const sanitize = (name: string) => name.replace(/[\\/:*?"<>|]/g, '-').trim();
              const safeCompany = sanitize(company);
              const safeJobId = sanitize(jobId);
              const safeJobName = sanitize(jobName || 'Submission');

              const companyDir = path.resolve(process.cwd(), 'saved-submissions', safeCompany);
              if (!fs.existsSync(companyDir)) {
                fs.mkdirSync(companyDir, { recursive: true });
              }

              const fileName = `${safeJobId} - ${safeJobName}.md`;
              const fullPath = path.join(companyDir, fileName);

              fs.writeFileSync(fullPath, content, 'utf8');

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                filePath: `saved-submissions/${safeCompany}/${fileName}`,
                fileName,
                company: safeCompany,
                jobId: safeJobId,
                jobName: safeJobName
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // List all saved submissions grouped by company
        if (req.url?.startsWith('/api/saved-submissions') && req.method === 'GET') {
          try {
            const rootSubmissions = path.resolve(process.cwd(), 'saved-submissions');
            if (!fs.existsSync(rootSubmissions)) {
              fs.mkdirSync(rootSubmissions, { recursive: true });
            }

            const companyDirs = fs.readdirSync(rootSubmissions, { withFileTypes: true })
              .filter(dirent => dirent.isDirectory())
              .map(dirent => dirent.name);

            const result: Array<{
              company: string;
              submissions: Array<{
                company: string;
                fileName: string;
                filePath: string;
                jobId: string;
                jobName: string;
                modifiedAt: string;
                content: string;
              }>;
            }> = [];

            for (const comp of companyDirs) {
              const compPath = path.join(rootSubmissions, comp);
              const files = fs.readdirSync(compPath)
                .filter(f => f.endsWith('.md') || f.endsWith('.txt') || f.endsWith('.json'));

              const submissions = files.map(file => {
                const filePath = path.join(compPath, file);
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath, 'utf8');

                let jobId = '';
                let jobName = '';
                const nameWithoutExt = file.replace(/\.[^/.]+$/, "");
                const splitIdx = nameWithoutExt.indexOf(' - ');
                if (splitIdx !== -1) {
                  jobId = nameWithoutExt.substring(0, splitIdx).trim();
                  jobName = nameWithoutExt.substring(splitIdx + 3).trim();
                } else {
                  jobId = nameWithoutExt;
                  jobName = nameWithoutExt;
                }

                if (content.startsWith('---')) {
                  const parts = content.split('---');
                  if (parts.length >= 3) {
                    const lines = parts[1].split('\n');
                    for (const line of lines) {
                      const colon = line.indexOf(':');
                      if (colon !== -1) {
                        const k = line.substring(0, colon).trim();
                        let v = line.substring(colon + 1).trim();
                        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
                        if (k === 'jobId' && v) jobId = v;
                        if (k === 'jobName' && v) jobName = v;
                      }
                    }
                  }
                }

                return {
                  company: comp,
                  fileName: file,
                  filePath: `saved-submissions/${comp}/${file}`,
                  jobId,
                  jobName,
                  modifiedAt: stats.mtime.toISOString(),
                  content
                };
              });

              submissions.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

              if (submissions.length > 0) {
                result.push({
                  company: comp,
                  submissions
                });
              }
            }

            result.sort((a, b) => a.company.localeCompare(b.company));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, companies: result }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
          return;
        }

        // Delete a saved submission
        if (req.url === '/api/saved-submission' && req.method === 'DELETE') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const { filePath } = JSON.parse(body);
              const absolutePath = path.resolve(process.cwd(), filePath);
              const rootSubmissions = path.resolve(process.cwd(), 'saved-submissions');

              if (absolutePath.startsWith(rootSubmissions) && fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                
                // If company folder is empty, optionally remove it
                const parentDir = path.dirname(absolutePath);
                if (fs.existsSync(parentDir) && fs.readdirSync(parentDir).length === 0) {
                  fs.rmdirSync(parentDir);
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'File not found or invalid path' }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        next();
      });
    }
  }
}

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), localMdEditorPlugin()],
  base: command === 'build' ? '/ResumeForge/' : '/',
}))
