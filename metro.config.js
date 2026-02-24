// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const os = require('os');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Use more workers for faster bundling (default is often half of CPU count)
config.maxWorkers = Math.max(2, os.cpus().length - 1);

module.exports = config;
