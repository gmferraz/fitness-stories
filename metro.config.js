// Learn more https://docs.expo.io/guides/customizing-metro
const { withNativeWind } = require('nativewind/metro');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const defaultConfig = getSentryExpoConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const mergedConfig = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...defaultConfig.resolver,
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = withNativeWind(mergedConfig, {
  input: './global.css',
  inlineRem: 16,
});
