import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'))
const APP_VERSION = pkg.version

function versionPlugin() {
  return {
    name: 'sabha-version',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(process.cwd(), 'dist')
      const swPath = resolve(outDir, 'sw.js')
      if (existsSync(swPath)) {
        const sw = readFileSync(swPath, 'utf8')
        writeFileSync(swPath, sw.replaceAll('__APP_VERSION__', APP_VERSION))
      }
      writeFileSync(
        resolve(outDir, 'version.json'),
        JSON.stringify({ version: APP_VERSION, buildTime: new Date().toISOString() }, null, 2) + '\n'
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), versionPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
})
