import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION_NAME = 'chatHistory';

/**
 * Save a chat message to Firestore
 * @param {string} userId - User's Firebase UID
 * @param {string} message - Message text
 * @param {string} sender - "user" or "bot"
 */
export const saveMessage = async (userId, message, sender) => {
  try {
    console.log('💾 chatHistoryService: Saving message', { userId, sender, messageLength: message.length });
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      message,
      sender,
      timestamp: serverTimestamp(),
    });
    console.log('✅ chatHistoryService: Message saved with ID:', docRef.id);
  } catch (error) {
    console.error('❌ chatHistoryService: Error saving message:', error);
    console.error('❌ chatHistoryService: Error code:', error.code);
    console.error('❌ chatHistoryService: Error message:', error.message);
    throw error;
  }
};

/**
 * Get all chat messages for a user
 * @param {string} userId - User's Firebase UID
 * @returns {Array} Array of messages sorted by timestamp
 */
export const getUserChatHistory = async (userId) => {
  try {
    console.log('📖 chatHistoryService: Fetching history for userId:', userId);
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );
    
    console.log('📖 chatHistoryService: Executing query...');
    const querySnapshot = await getDocs(q);
    console.log('📖 chatHistoryService: Query returned', querySnapshot.size, 'documents');
    
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 chatHistoryService: Document', doc.id, ':', data);
      messages.push({
        id: doc.id,
        text: data.message,
        isAI: data.sender === 'bot',
        timestamp: data.timestamp?.toDate() || new Date(),
      });
    });
    
    console.log('✅ chatHistoryService: Returning', messages.length, 'messages');
    return messages;
  } catch (error) {
    console.error('❌ chatHistoryService: Error fetching chat history:', error);
    console.error('❌ chatHistoryService: Error code:', error.code);
    console.error('❌ chatHistoryService: Error message:', error.message);
    return [];
  }
};

/**
 * Clear all chat history for a user
 * @param {string} userId - User's Firebase UID
 */
export const clearUserChatHistory = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const deletePromises = [];
    
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, COLLECTION_NAME, document.id)));
    });
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};
