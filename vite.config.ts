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
        if (req.url === '/api/save-md' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const { filePath, content } = JSON.parse(body);
              // filePath from glob is like "../resume-points/experience/xyz.md"
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
        next();
      });
    }
  }
}

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), localMdEditorPlugin()],
  base: command === 'build' ? '/ResumeForge/' : '/',
}))
