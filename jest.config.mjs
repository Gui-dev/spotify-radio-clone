const defaultConfig = {
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: [
    'text',
    'lcov'
  ],
  coverageThreshold: {
    global: {
      branch: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  maxWorkers: '50%',
  watchPathIgnorePatterns: [
    'node_modules'
  ],
  transformIgnorePatterns: [
    'node_modules'
  ]
}

export default {
  projects: [
    {
      ...defaultConfig,
      testEnvironment: 'node',
      displayName: 'backend',
      collectCoverageFrom: [
        'server/',
        '!server/index.js'
      ],
      transformIgnorePatterns: [
        ...defaultConfig.transformIgnorePatterns,
        'public'
      ],
      testMatch: [
        '**/server/__tests__/**/*.spec.js'
      ]
    },
    {
      ...defaultConfig,
      testEnvironment: 'jsdom',
      setupFiles: [`<rootDir>/.test/jest-shim.js`],
      displayName: 'frontend',
      collectCoverageFrom: [
        'public/',
      ],
      transformIgnorePatterns: [
        ...defaultConfig.transformIgnorePatterns,
        'server'
      ],
      testMatch: [
        '**/public/__tests__/**/*.spec.js'
      ]
    }
  ]
}
