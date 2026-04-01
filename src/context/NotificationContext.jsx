import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  notifications as mockNotifications,
  addNotification as mockAddNotification,
  markNotificationRead as mockMarkRead,
} from "../utils/mockData";

const NotificationContext = createContext();

const getNotificationStorageKey = (user) =>
  `asthma_shield_notifications_${user?.email || "guest"}`;

const readStoredNotifications = (storageKey) => {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const dedupeAndLimitNotifications = (notifications, incomingNotification) => {
  const recent24h = notifications.filter(
    (notification) =>
      new Date() - new Date(notification.timestamp || notification.createdAt) <
      24 * 60 * 60 * 1000,
  );
  const duplicate = recent24h.some(
    (notification) => notification.message === incomingNotification.message,
  );

  if (duplicate) {
    return notifications;
  }

  return [incomingNotification, ...notifications].slice(0, 10);
};

const getDefaultNotificationsForUser = (user) => {
  if (!user) return [];

  if (user.role === "admin") {
    return [
      {
        id: "admin-seed-1",
        userId: user.id,
        message: "3 new user registrations are waiting for verification.",
        type: "info",
        read: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: "admin-seed-2",
        userId: user.id,
        message: "Air quality alerts increased by 18% across Kigali today.",
        type: "warning",
        read: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: "admin-seed-3",
        userId: user.id,
        message: "Content review reminder: 2 education articles need approval.",
        type: "info",
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ];
  }

  const matchedNotifications = mockNotifications
    .filter(
      (notification) =>
        notification.userId === user.id || notification.userId === Number(user.id),
    )
    .slice(-10)
    .map((notification) => ({
      ...notification,
      timestamp: notification.createdAt || new Date().toISOString(),
    }));

  return matchedNotifications;
};

const initialState = { notifications: [] };

const notificationReducer = (state, action) => {
  let newNotifications;
  switch (action.type) {
    case "LOAD":
      newNotifications = action.payload;
      break;
    case "ADD":
      newNotifications = dedupeAndLimitNotifications(
        state.notifications,
        action.payload,
      );
      if (newNotifications === state.notifications) return state;

      // Sync to mockData for compatibility
      mockAddNotification(
        action.payload.userId || "demo",
        action.payload.message,
        action.payload.type,
      );
      break;
    case "MARK_READ":
      newNotifications = state.notifications.map((n) =>
        n.id === action.id ? { ...n, read: true } : n,
      );
      mockMarkRead(action.id);
      break;
    case "MARK_ALL_READ":
      newNotifications = state.notifications.map((n) => ({ ...n, read: true }));
      break;
    case "CLEAR_ALL":
      newNotifications = [];
      break;
    default:
      return state;
  }

  return { ...state, notifications: newNotifications };
};

export const NotificationProvider = ({ children, dashboardData = {} }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = useAuth();
  const [riskScore, setRiskScore] = useState(0);
  const [environment, setEnvironment] = useState({});
  const [medication, setMedication] = useState({});
  const [symptoms, setSymptoms] = useState({});
  const storageKey = getNotificationStorageKey(user);

  // Load mocks on user change
  useEffect(() => {
    if (!user) {
      dispatch({ type: "LOAD", payload: [] });
      return;
    }

    const storedNotifications = readStoredNotifications(storageKey);
    const nextNotifications =
      storedNotifications.length > 0
        ? storedNotifications
        : getDefaultNotificationsForUser(user);

    dispatch({ type: "LOAD", payload: nextNotifications });
  }, [storageKey, user]);

  useEffect(() => {
    if (!user) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(state.notifications));
    } catch (error) {
      console.warn("Failed to persist notifications:", error);
    }
  }, [state.notifications, storageKey, user]);

  // AI Auto-generate notifications based on rules (debounced)
  useEffect(() => {
    if (riskScore === 0) return;

    const timeoutId = setTimeout(() => {
      const now = new Date().toISOString();

      // Risk score alerts
      if (riskScore >= 70) {
        addNotification(
          "🚨 HIGH RISK: Asthma attack likely. Follow emergency action plan IMMEDIATELY. Keep rescue inhaler ready and contact doctor.",
          "danger",
        );
      } else if (riskScore >= 40) {
        addNotification(
          "⚠️ MODERATE RISK: Increased symptoms expected. Take controller medication, avoid triggers, monitor closely.",
          "warning",
        );
      }

      // Environment triggers
      if (environment.aqi > 100) {
        addNotification(
          `🌫️ POOR AIR QUALITY (AQI ${environment.aqi}): Stay indoors, use air purifier, avoid exercise.`,
          "warning",
        );
      }
      if (environment.pollen > 70) {
        addNotification(
          `🌸 HIGH POLLEN (${environment.pollen}): Take antihistamine, keep windows closed, shower after outdoors.`,
          "warning",
        );
      }

      // Medication adherence
      if (!medication.controllerTaken) {
        addNotification(
          "💊 CONTROLLER MEDICATION MISSING: Take your daily controller inhaler to prevent symptoms.",
          "warning",
        );
      }
      if (medication.rescueUsed && riskScore > 50) {
        addNotification(
          "🚨 RESCUE INHALER USED + HIGH RISK: Frequent use detected. Contact healthcare provider urgently.",
          "danger",
        );
      }
    }, 2000); // Debounce 2s

    return () => clearTimeout(timeoutId);
  }, [
    riskScore,
    environment.aqi,
    environment.pollen,
    medication.controllerTaken,
    medication.rescueUsed,
  ]);

  const addNotification = (
    message,
    type = "info",
    priority = "medium",
    userId = user?.id,
  ) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    dispatch({
      type: "ADD",
      payload: {
        id,
        message,
        type,
        priority,
        timestamp,
        read: false,
        userId: userId || "demo",
      },
    });
  };

  const sendNotificationToUser = (
    targetUser,
    message,
    type = "warning",
    priority = "high",
    metadata = {},
  ) => {
    if (!targetUser?.email) {
      throw new Error("A target user with an email is required.");
    }

    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      priority,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      read: false,
      userId: targetUser.id,
      ...metadata,
    };

    const targetStorageKey = getNotificationStorageKey(targetUser);
    const existingNotifications = readStoredNotifications(targetStorageKey);
    const seededNotifications =
      existingNotifications.length > 0
        ? existingNotifications
        : getDefaultNotificationsForUser(targetUser);
    const nextNotifications = dedupeAndLimitNotifications(
      seededNotifications,
      notification,
    );

    try {
      localStorage.setItem(targetStorageKey, JSON.stringify(nextNotifications));
    } catch (error) {
      console.warn("Failed to persist target notification:", error);
    }

    mockAddNotification(targetUser.id, message, type);

    if (
      user?.email &&
      user.email.toLowerCase() === String(targetUser.email).toLowerCase()
    ) {
      dispatch({ type: "LOAD", payload: nextNotifications });
    }

    return notification;
  };

  const markRead = (id) => dispatch({ type: "MARK_READ", id });
  const markAllRead = () => dispatch({ type: "MARK_ALL_READ" });
  const clearAll = () => dispatch({ type: "CLEAR_ALL" });
  const unreadCount = state.notifications.filter((n) => !n.read).length;

  const updateDashboardData = (data) => {
    // Internal updater, called from dashboard components
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        addNotification,
        sendNotificationToUser,
        markRead,
        markAllRead,
        clearAll,
        unreadCount,
        updateDashboardData: (data) => {
          setRiskScore(data.riskScore ?? riskScore);
          setEnvironment(data.environment ?? environment);
          setMedication(data.medication ?? medication);
          setSymptoms(data.symptoms ?? symptoms);
        },
        dashboardData: {
          riskScore,
          environment,
          medication,
          symptoms,
        },
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
