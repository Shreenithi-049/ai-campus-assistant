import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

const DEFAULT_RESPONSE = "Sorry, I couldn't find relevant information. Please contact admin.";

/**
 * Tokenizes a query string into words
 * @param {string} query - User input query
 * @returns {string[]} Array of lowercase tokens
 */
const tokenizeQuery = (query) => {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Replace punctuation with spaces
    .split(/\s+/) // Split by whitespace
    .filter((word) => word.length > 0); // Remove empty strings
};

/**
 * Calculates match score between query tokens and FAQ keywords
 * @param {string[]} queryTokens - Tokenized user query
 * @param {string[]} keywords - FAQ keywords array
 * @returns {number} Match score (0-1)
 */
const calculateMatchScore = (queryTokens, keywords) => {
  if (!keywords || keywords.length === 0) return 0;

  const keywordSet = new Set(keywords.map((k) => k.toLowerCase()));
  let matches = 0;

  queryTokens.forEach((token) => {
    if (keywordSet.has(token)) {
      matches++;
    }
  });

  // Return score as ratio of matched tokens
  return matches / queryTokens.length;
};

/**
 * Detects intent and fetches response from Firestore FAQs
 * @param {string} userQuery - User's chat message
 * @returns {Promise<{answer: string, matched: boolean}>}
 */
export const getChatResponse = async (userQuery) => {
  try {
    if (!userQuery || userQuery.trim().length === 0) {
      return {
        answer: "Please enter a question.",
        matched: false,
      };
    }

    // Tokenize user query
    const queryTokens = tokenizeQuery(userQuery.trim());

    // Fetch all FAQs from Firestore
    const faqsRef = collection(db, "faqs");
    const faqsSnapshot = await getDocs(faqsRef);

    if (faqsSnapshot.empty) {
      return {
        answer: DEFAULT_RESPONSE,
        matched: false,
      };
    }

    let bestMatch = null;
    let bestScore = 0;

    // Find best matching FAQ
    faqsSnapshot.forEach((doc) => {
      const faqData = doc.data();
      const keywords = faqData.keywords || [];
      const answer = faqData.answer || "";

      const score = calculateMatchScore(queryTokens, keywords);

      if (score > bestScore && answer.trim().length > 0) {
        bestScore = score;
        bestMatch = {
          answer,
          score,
        };
      }
    });

    // Return best match if score is above threshold (at least 30% match)
    if (bestMatch && bestScore >= 0.3) {
      return {
        answer: bestMatch.answer,
        matched: true,
        score: bestScore,
      };
    }

    // No good match found
    return {
      answer: DEFAULT_RESPONSE,
      matched: false,
    };
  } catch (error) {
    console.error("Error fetching chat response:", error);
    return {
      answer: "An error occurred. Please try again later.",
      matched: false,
    };
  }
};

