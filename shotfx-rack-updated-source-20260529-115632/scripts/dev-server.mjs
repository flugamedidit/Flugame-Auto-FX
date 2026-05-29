import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import './build-uxp.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const types = new Map([
  ['.html', 'text/html'],
  ['.css', 'text/css'],
  ['.js', 'text/javascript']
]);

const server = createServer((request, response) => {
  const url = request.url === '/' ? '/index.html' : request.url || '/index.html';
  const filePath = resolve(root, `.${url}`);

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  response.writeHead(200, { 'Content-Type': types.get(extname(filePath)) || 'text/plain' });
  response.end(readFileSync(filePath));
});

server.listen(5173, '127.0.0.1', () => {
  console.log('ShotFX Rack dev server running at http://127.0.0.1:5173');
});
