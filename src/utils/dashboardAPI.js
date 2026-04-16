// src/utils/dashboardAPI.js
import { fetchAllEnvironments } from './environmentAPI-fixed.js';

export const fetchDashboardData = async () => {
  const environment = await fetchAllEnvironments();

  // Mock other backend data
  const healthLogs = [];
  const notifications = [];
  const predictions = [{ risk: 'low' }];

  return { environment, healthLogs, notifications, predictions };
};

