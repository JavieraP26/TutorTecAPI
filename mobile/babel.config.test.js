/**
 * Babel config used only by Jest — excluye los plugins de Reanimated/Worklets
 * que requieren módulos nativos no disponibles en el entorno de test.
 */
module.exports = {
  presets: [
    ['babel-preset-expo', {
      jsxImportSource: undefined,
      reanimated: false,
    }],
  ],
};
