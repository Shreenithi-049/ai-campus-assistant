import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Fetches notifications from Firestore
 * @param {number} maxResults - Maximum number of notifications to fetch (default: 50)
 * @returns {Promise<Array>} Array of notification objects
 */
export const getNotifications = async (maxResults = 50) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      orderBy("createdAt", "desc"),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    const notifications = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        title: data.title || "",
        message: data.message || "",
        type: data.type || "info", // info, alert, success
        createdAt: data.createdAt?.toDate() || new Date(),
        read: data.read || false,
      });
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications. Please try again.");
  }
};

