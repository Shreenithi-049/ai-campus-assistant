# 🧪 Quick Test Guide - Navigation-Based Registration

## ✅ Implementation Complete!

The registration flow has been changed to navigation-based. Here's how to test it:

---

## 🚀 Quick Test (5 Minutes)

### Step 1: Start the App
```bash
npx expo start
# Press 'w' for web or scan QR for mobile
```

### Step 2: Login
- Use: `test@skcet.ac.in`
- Navigate to Events screen

### Step 3: Test Registration Flow

#### 3.1 Click "Register" Button
- ✅ Should navigate to EventRegistrationScreen
- ✅ Should NOT save to Firestore yet

#### 3.2 View Event Details
- ✅ Event title displayed
- ✅ Date, time, location shown
- ✅ Description visible
- ✅ "Proceed to Registration" button visible

#### 3.3 Click "Proceed to Registration"
- ✅ Opens link (dummy or real)
- ✅ "I Have Completed Registration" button appears

#### 3.4 Click "I Have Completed Registration"
- ✅ Shows "Saving..." text
- ✅ Success alert appears
- ✅ Navigates back to Events screen
- ✅ Button now shows "Registered ✔" (green)

### Step 4: Test Duplicate Prevention
- Click "Registered ✔" button again
- ✅ Should do nothing (button is disabled)

### Step 5: Test My Events Filter
- Click "My Events" filter
- ✅ Shows only registered events

### Step 6: Test Persistence
- Close app completely
- Reopen and login
- ✅ Registered events still show "Registered ✔"

---

## 🎯 Expected Behavior

### Events Screen:
```
Before Registration:
[Register] ← Blue button, clickable

After Registration:
[✓ Registered] ← Green button, disabled
```

### Registration Screen:
```
Step 1: Show event details
Step 2: "Proceed to Registration" button
Step 3: Opens link
Step 4: "I Have Completed Registration" appears
Step 5: Click → Save to Firestore
Step 6: Navigate back
```

---

## 🐛 Common Issues

### Issue: "Cannot read property 'event' of undefined"
**Fix:** Make sure you're passing event object in navigation

### Issue: Link doesn't open
**Fix:** Check if registrationLink exists in event document

### Issue: Registration not saving
**Fix:** Check Firestore rules are deployed

### Issue: Button stays "Saving..."
**Fix:** Check network connection and Firestore access

---

## 📊 Verify in Firestore

After completing registration:

1. Go to Firebase Console → Firestore
2. Open `eventRegistrations` collection
3. Should see new document:
```javascript
{
  userId: "abc123...",
  eventId: "evt1",
  eventTitle: "Tech Symposium 2024",
  registeredAt: Timestamp,
  status: "registered"
}
```

---

## ✅ Success Criteria

- ✅ Navigation works smoothly
- ✅ Event details display correctly
- ✅ Link opens successfully
- ✅ Registration saves to Firestore
- ✅ Back navigation works
- ✅ Button state updates
- ✅ Duplicate prevention works
- ✅ My Events filter works
- ✅ Dark mode works
- ✅ No console errors

---

## 🎨 UI States

### EventRegistrationScreen States:

**Initial State:**
- Event details visible
- "Proceed to Registration" button enabled

**After Opening Link:**
- Event details visible
- "Proceed to Registration" button enabled
- "I Have Completed Registration" button visible

**During Save:**
- "I Have Completed Registration" shows "Saving..."
- Button disabled

**After Success:**
- Alert shown
- Navigate back to Events screen

---

## 🚀 Ready to Test!

The implementation is complete. Follow the steps above to test the new flow.

**Status:** 🟢 READY FOR TESTING
