const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Fournit le chemin vers ton app Next.js pour charger le next.config.js et le .env
    dir: './',
})

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        // Mappe le @/ vers le dossier src/
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    // Force Jest à regarder dans node_modules et src
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

module.exports = createJestConfig(customJestConfig)