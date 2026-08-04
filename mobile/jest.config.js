/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterFramework: ['@testing-library/react-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '(jest-)?react-native' +
      '|@react-native(-community)?' +
      '|expo(nent)?' +
      '|@expo(nent)?/.*' +
      '|@expo-google-fonts/.*' +
      '|react-navigation' +
      '|@react-navigation/.*' +
      '|expo-router' +
      '|expo-font' +
      '|expo-secure-store' +
      '|expo-status-bar' +
      '|expo-system-ui' +
      '|react-native-safe-area-context' +
      '|react-native-screens' +
      '|react-native-gesture-handler' +
      '|react-native-reanimated' +
      '))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'hooks/**/*.ts',
    '!**/__tests__/**',
  ],
};
