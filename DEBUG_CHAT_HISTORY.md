# 🐛 Chat History Debug Guide

## Issue: Chat history not persisting after refresh

### Quick Diagnosis Steps

#### Step 1: Check Browser Console (F12)
Look for these errors:
- ❌ "Missing or insufficient permissions"
- ❌ "The query requires an index"
- ❌ "Error loading chat history"

#### Step 2: Check Firestore Console
1. Go to Firebase Console → Firestore Database
2. Look for `chatHistory` collection
3. Check if documents exist with your userId

#### Step 3: Check Firestore Rules
Your rules should have:
```javascript
match /chatHistory/{messageId} {
  allow read: if request.auth != null 
              && resource.data.userId == request.auth.uid;
  allow write: if request.auth != null 
               && request.resource.data.userId == request.auth.uid;
}
```

---

## 🔍 Common Issues & Fixes

### Issue 1: Firestore Index Missing
**Symptom:** Error in console: "The query requires an index"

**Fix:**
1. Click the link in the error message (it auto-creates the index)
2. OR manually create index:
   - Collection: `chatHistory`
   - Fields: `userId` (Ascending), `timestamp` (Ascending)
   - Query scope: Collection

### Issue 2: Firestore Rules Not Published
**Symptom:** "Missing or insufficient permissions"

**Fix:**
1. Go to Firebase Console → Firestore → Rules
2. Make sure the chatHistory rules are there
3. Click "Publish"
4. Wait 1-2 minutes for rules to propagate

### Issue 3: userId Not Matching
**Symptom:** No messages load, but no errors

**Fix:**
Check if the userId in Firestore matches auth.currentUser.uid:
```javascript
// Add this temporarily to ModernChatScreen.js line 85
console.log('Current User ID:', auth.currentUser?.uid);
```

Then check Firestore documents - the `userId` field should match.

### Issue 4: Timestamp Field Issues
**Symptom:** Messages save but don't load in order

**Fix:**
The query uses `orderBy('timestamp')` which requires:
1. All documents must have a `timestamp` field
2. Firestore index must exist (see Issue 1)

---

## 🧪 Manual Test

### Test 1: Send a Message
1. Open browser console (F12)
2. Go to Chat screen
3. Send message: "Test message 1"
4. Check console for errors
5. Check Firestore console - document should appear

### Test 2: Reload Page
1. Press F5 to refresh
2. Login again if needed
3. Go to Chat screen
4. Check if "Test message 1" appears
5. Check console for errors

### Test 3: Check Firestore Data
1. Firebase Console → Firestore → chatHistory
2. Find your document
3. Verify structure:
   ```
   {
     userId: "abc123...",
     message: "Test message 1",
     sender: "user",
     timestamp: February 27, 2026 at 11:35:00 AM UTC+5:30
   }
   ```

---

## 🔧 Quick Fix: Add Debug Logging

Add this to `ModernChatScreen.js` at line 85 (inside loadChatHistory):

```javascript
const loadChatHistory = async () => {
  try {
    const userId = auth.currentUser?.uid;
    console.log('🔍 Loading chat for userId:', userId); // ADD THIS
    
    if (!userId) {
      console.log('❌ No userId found'); // ADD THIS
      setIsLoading(false);
      return;
    }

    const history = await getUserChatHistory(userId);
    console.log('📜 Loaded messages:', history.length); // ADD THIS
    console.log('📜 Messages:', history); // ADD THIS
    
    if (history.length === 0) {
      const welcomeMsg = 'Hello! I\'m your CampusAI assistant. How can I help you today?';
      console.log('💾 Saving welcome message'); // ADD THIS
      await saveMessage(userId, welcomeMsg, 'bot');
      
      setMessages([{
        id: 'welcome',
        text: welcomeMsg,
        isAI: true,
        timestamp: new Date(),
      }]);
    } else {
      setMessages(history);
    }
  } catch (error) {
    console.error('❌ Error loading chat history:', error); // ALREADY THERE
    Alert.alert('Error', 'Failed to load chat history');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🎯 Expected Console Output

When working correctly, you should see:
```
🔍 Loading chat for userId: abc123xyz...
📜 Loaded messages: 3
📜 Messages: [{...}, {...}, {...}]
```

When first time (no history):
```
🔍 Loading chat for userId: abc123xyz...
📜 Loaded messages: 0
💾 Saving welcome message
```

---

## 🚨 Most Likely Issue

**The Firestore Composite Index is missing!**

When you send your first message, check the browser console. You'll likely see:
```
Error: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

**Solution:**
1. Click that link
2. Wait 2-3 minutes for index to build
3. Refresh the page
4. Chat history should now work! ✅

---

## 📞 Still Not Working?

Share these details:
1. Screenshot of browser console (F12)
2. Screenshot of Firestore chatHistory collection
3. Screenshot of Firestore Rules tab
4. What you see when you refresh the page
