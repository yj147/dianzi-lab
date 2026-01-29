/* eslint-disable no-console */

const { spawnSync } = require('node:child_process')
const path = require('node:path')

function mapArgs(argv) {
  const mapped = []

  for (const arg of argv) {
    if (arg === '--testPathPattern') {
      mapped.push('--testPathPatterns')
      continue
    }

    if (arg.startsWith('--testPathPattern=')) {
      mapped.push(arg.replace('--testPathPattern=', '--testPathPatterns='))
      continue
    }

    mapped.push(arg)
  }

  return mapped
}

function main() {
  // Do not use require.resolve('jest/bin/...') because Jest 30 uses package "exports"
  // and Node (>=20) will throw ERR_PACKAGE_PATH_NOT_EXPORTED for subpaths.
  const jestBin = path.resolve(
    __dirname,
    '..',
    'node_modules',
    'jest',
    'bin',
    'jest.js'
  )
  const argv = mapArgs(process.argv.slice(2))

  const result = spawnSync(process.execPath, [jestBin, ...argv], {
    stdio: 'inherit',
  })

  process.exit(result.status ?? 1)
}

main()
