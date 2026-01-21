const crypto = require('node:crypto')
const path = require('node:path')
const { createInstrumenter } = require('istanbul-lib-instrument')
const { createTransformer: createNextSwcTransformer } = require('next/dist/build/swc/jest-transformer')

const TRANSFORMER_VERSION = '2'

function getJestConfig(jestOptions) {
  if (!jestOptions) return {}
  return jestOptions.config && typeof jestOptions.config === 'object' ? jestOptions.config : jestOptions
}

function createTransformer(inputOptions = {}) {
  const nextTransformer = createNextSwcTransformer(inputOptions)
  const instrumenter = createInstrumenter({ autoWrap: true, esModules: false })

  return {
    ...nextTransformer,
    getCacheKey(sourceText, sourcePath, jestOptions, transformOptions) {
      const config = getJestConfig(jestOptions)
      const rootDir = (config && config.rootDir) || process.cwd()

      return crypto
        .createHash('sha1')
        .update(TRANSFORMER_VERSION)
        .update('\0')
        .update(JSON.stringify(inputOptions))
        .update('\0')
        .update(sourceText)
        .update('\0')
        .update(sourcePath)
        .update('\0')
        .update(rootDir)
        .digest('hex')
    },
    process(src, filename, jestOptions, transformOptions) {
      const result = nextTransformer.process(src, filename, jestOptions, transformOptions)
      if (!result) return result

      const code = typeof result === 'string' ? result : result.code
      if (typeof code !== 'string') return result

      const config = getJestConfig(jestOptions)
      const rootDir = (config && config.rootDir) || process.cwd()
      const relativeFilename = path.isAbsolute(filename) ? path.relative(rootDir, filename) : filename
      const coverageFilename = relativeFilename.split(path.sep).join('/')

      return { code: instrumenter.instrumentSync(code, coverageFilename) }
    },
  }
}

module.exports = { createTransformer }
