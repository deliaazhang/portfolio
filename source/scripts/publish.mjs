// Copies the built site (source/dist) to the repository root, where GitHub Pages serves it.
import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const dist = resolve(import.meta.dirname, '../dist')
const root = resolve(import.meta.dirname, '../..')
const keep = new Set(['.git', '.gitignore', 'source', 'README.md', 'CNAME'])

if (!existsSync(join(dist, 'index.html'))) throw new Error('Build first: dist/index.html is missing')

for (const name of readdirSync(root)) if (!keep.has(name)) rmSync(join(root, name), { recursive: true, force: true })
cpSync(dist, root, { recursive: true })
writeFileSync(join(root, '.nojekyll'), '')
console.log('Published dist/ to the repository root.')
