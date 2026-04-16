const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration for Expo Router project.
 * - Force worker threads instead of child processes because the execution
 *   environment blocks process forking (fixes `spawn EPERM` during `expo start`).
 * - Limit workers to 1 to keep resource usage low in constrained shells.
 */
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

config.transformer.unstable_workerThreads = true;
config.maxWorkers = 1;

module.exports = config;
