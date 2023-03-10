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
        'server/src/',
        '!server/src/index.js'
      ],
      transformIgnorePatterns: [
        ...defaultConfig.transformIgnorePatterns,
        'web/public'
      ],
      testMatch: [
        '**/server/src/__tests__/**/*.spec.js'
      ]
    },
    {
      ...defaultConfig,
      testEnvironment: 'jsdom',
      displayName: 'frontend',
      collectCoverageFrom: [
        'web/public',
      ],
      transformIgnorePatterns: [
        ...defaultConfig.transformIgnorePatterns,
        'web/public'
      ],
      testMatch: [
        '**/web/public/__tests__/**/*.spec.js'
      ]
    }
  ]
}
