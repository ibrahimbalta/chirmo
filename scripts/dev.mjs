import { spawn } from 'child_process';
import { createServer } from 'vite';
import * as esbuild from 'esbuild';
import path from 'path';
import electron from 'electron';

async function startDev() {
  // 1. Build main and preload
  await esbuild.build({
    entryPoints: ['src/main/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/main/index.js',
    external: ['electron'],
    sourcemap: 'inline',
  });

  await esbuild.build({
    entryPoints: ['src/preload/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/preload/index.js',
    external: ['electron'],
    sourcemap: 'inline',
  });

  // 2. Start Vite dev server
  const server = await createServer({
    configFile: path.resolve(process.cwd(), 'vite.config.ts'),
    server: { port: 5173 },
  });
  await server.listen();
  console.log('[Vite] Dev server running at http://localhost:5173');

  // 3. Start Electron process
  const env = { ...process.env, NODE_ENV: 'development', VITE_DEV_SERVER_URL: 'http://localhost:5173' };
  const child = spawn(electron, ['.'], { stdio: 'inherit', env });

  child.on('close', () => {
    server.close();
    process.exit();
  });
}

startDev().catch((err) => {
  console.error(err);
  process.exit(1);
});
