# Firestore Database Schema

This document describes the Firestore collections and their structure for the AI Campus Assistant application.

## Collections

### 1. `faqs` Collection

Stores frequently asked questions and their answers for the AI chatbot.

**Document Structure:**
```javascript
{
  question: string,        // The question text (for reference)
  answer: string,          // The answer to display to users
  keywords: string[],      // Array of keywords for intent matching
  category: string,       // Optional: category (e.g., "academic", "administrative", "events")
  createdAt: Timestamp,    // When the FAQ was created
  updatedAt: Timestamp,   // Last update timestamp
  active: boolean         // Whether this FAQ is active
}
```

**Example Document:**
```javascript
{
  question: "What are the library hours?",
  answer: "The library is open Monday to Friday from 8:00 AM to 10:00 PM, and Saturday to Sunday from 9:00 AM to 6:00 PM.",
  keywords: ["library", "hours", "open", "time", "when", "schedule"],
  category: "academic",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  active: true
}
```

**Intent Matching:**
- The chatbot uses keyword matching to find relevant FAQs
- User queries are tokenized and compared against the `keywords` array
- Best match (highest score ≥ 30%) is returned
- If no match found, default response is shown

---

### 2. `notifications` Collection

Stores campus notifications and announcements.

**Document Structure:**
```javascript
{
  title: string,          // Notification title
  message: string,        // Notification content/body
  type: string,          // Type: "info" | "alert" | "success"
  createdAt: Timestamp,   // When notification was created
  read: boolean,        // Whether notification has been read (optional, for future use)
  priority: string,      // Optional: "low" | "medium" | "high"
  expiresAt: Timestamp   // Optional: expiration date
}
```

**Example Document:**
```javascript
{
  title: "Campus Event: Tech Fair 2024",
  message: "Join us for the annual Tech Fair on March 15th from 10 AM to 4 PM at the main auditorium.",
  type: "info",
  createdAt: Timestamp,
  read: false,
  priority: "medium",
  expiresAt: Timestamp
}
```

**Query Pattern:**
- Notifications are fetched ordered by `createdAt` descending
- Limited to 50 most recent by default
- Filtered by active status if `expiresAt` field exists

---

## Indexes Required

### `notifications` Collection
- **Index:** `createdAt` (descending)
  - Used for: Ordering notifications by date

---

## Setup Instructions

### 1. Create Collections in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Create the `faqs` collection
3. Create the `notifications` collection

### 2. Add Sample FAQs

Add sample FAQ documents to test the chatbot:

```javascript
// FAQ 1: Library Hours
{
  question: "What are the library hours?",
  answer: "The library is open Monday to Friday from 8:00 AM to 10:00 PM, and Saturday to Sunday from 9:00 AM to 6:00 PM.",
  keywords: ["library", "hours", "open", "time", "when", "schedule"],
  category: "academic",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  active: true
}

// FAQ 2: Registration
{
  question: "How do I register for courses?",
  answer: "You can register for courses through the student portal. Log in with your credentials, go to the 'Registration' section, and select your desired courses. Registration opens on [date].",
  keywords: ["register", "registration", "courses", "classes", "enroll", "sign up"],
  category: "academic",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  active: true
}

// FAQ 3: Parking
{
  question: "Where can I park on campus?",
  answer: "Student parking is available in lots A, B, and C. A parking permit is required and can be obtained from the administration office.",
  keywords: ["parking", "park", "car", "vehicle", "permit", "lot"],
  category: "administrative",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  active: true
}
```

### 3. Add Sample Notifications

```javascript
// Notification 1
{
  title: "Welcome to Campus Assistant",
  message: "Welcome to the AI Campus Assistant! Use the chatbot to get instant answers to your questions.",
  type: "info",
  createdAt: serverTimestamp(),
  read: false
}

// Notification 2
{
  title: "Important: Registration Deadline",
  message: "Course registration closes on March 1st. Please complete your registration before the deadline.",
  type: "alert",
  createdAt: serverTimestamp(),
  read: false,
  priority: "high"
}
```

### 4. Set Up Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // FAQs - Read only for authenticated users
    match /faqs/{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write (configure separately)
    }
    
    // Notifications - Read only for authenticated users
    match /notifications/{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write (configure separately)
    }
  }
}
```

---

## Best Practices

1. **Keywords for FAQs:**
   - Include common variations and synonyms
   - Use lowercase keywords
   - Include 5-10 keywords per FAQ for better matching
   - Think about how students might phrase questions

2. **Notifications:**
   - Keep titles concise (max 50 characters)
   - Keep messages clear and actionable
   - Use appropriate types (info, alert, success)
   - Set expiration dates for time-sensitive notifications

3. **Performance:**
   - Limit FAQ queries (currently fetches all, consider pagination for large datasets)
   - Use indexes for ordered queries
   - Consider caching frequently accessed FAQs

---

## Future Enhancements

- Add user-specific notifications
- Implement notification read/unread status per user
- Add FAQ categories and filtering
- Implement FAQ search functionality
- Add analytics for most asked questions
- Support for rich media in notifications (images, links)

