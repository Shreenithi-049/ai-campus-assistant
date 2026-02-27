# Event Registration - Quick Setup & Testing Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Deploy Firestore Security Rules

1. Open Firebase Console: https://console.firebase.google.com
2. Select your IntelliCamp project
3. Navigate to **Firestore Database** → **Rules**
4. Add this rule to the existing rules:

```javascript
// Add this inside the documents match block
match /eventRegistrations/{docId} {
  allow read: if request.auth != null && 
                resource.data.userId == request.auth.uid;
  
  allow create: if request.auth != null && 
                  request.auth.uid == request.resource.data.userId &&
                  request.resource.data.status == 'registered';
  
  allow update, delete: if false;
}
```

5. Click **Publish**

### Step 2: Add Sample Event (Optional)

If you don't have events in Firestore yet:

1. Go to **Firestore Database** → **Data**
2. Create collection: `events`
3. Add document with auto-ID:

```javascript
{
  title: "Tech Symposium 2024",
  category: "academic",
  date: "March 15, 2024",
  time: "10:00 AM",
  location: "Main Auditorium",
  attendees: 250,
  color: "#3B82F6",
  icon: "school-outline",
  description: "Annual tech event for CS students",
  registrationLink: "https://example.com/register",
  createdBy: "admin",
  createdAt: [Click "Insert field" → "timestamp" → "Now"]
}
```

### Step 3: Test the App

```bash
# Start the app
npx expo start

# Press 'w' for web or scan QR for mobile
```

---

## ✅ Testing Checklist

### Test 1: Basic Registration
1. Login with test@skcet.ac.in
2. Navigate to Events screen
3. Find an event with "Register" button
4. Click "Register"
5. ✅ Should see "Registering..." briefly
6. ✅ Should see success alert
7. ✅ Button should change to "Registered ✔" (green)

### Test 2: Duplicate Prevention
1. Click the same "Registered ✔" button again
2. ✅ Should see "Already Registered" alert
3. ✅ No duplicate in Firestore

### Test 3: My Events Filter
1. Click "My Events" filter chip
2. ✅ Should show only registered events
3. ✅ All shown events have "Registered ✔" button

### Test 4: Persistence
1. Close the app completely
2. Reopen and login
3. Go to Events screen
4. ✅ Previously registered events still show "Registered ✔"
5. ✅ "My Events" filter still works

### Test 5: Multi-User
1. Logout
2. Login with different user (e.g., test2@skcet.ac.in)
3. ✅ Should NOT see first user's registrations
4. ✅ Can register for same events independently

---

## 🔍 Verify in Firestore

After registering for an event:

1. Go to Firebase Console → Firestore
2. Open `eventRegistrations` collection
3. You should see a document like:

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

## 🐛 Common Issues & Fixes

### Issue: "Permission Denied"
**Cause:** Security rules not deployed  
**Fix:** Deploy rules from Step 1

### Issue: Button stays "Registering..."
**Cause:** Network error or Firestore connection issue  
**Fix:** Check internet connection and Firebase config

### Issue: No events showing
**Cause:** Empty events collection  
**Fix:** Add sample events (Step 2)

### Issue: Registration not persisting
**Cause:** User not authenticated  
**Fix:** Ensure user is logged in with @skcet.ac.in email

---

## 📊 Monitor Usage

### Check Total Registrations
```javascript
// In Firebase Console → Firestore → eventRegistrations
// Count documents to see total registrations
```

### Check Registrations Per Event
```javascript
// Filter by eventId field
// Shows how many users registered for specific event
```

### Check User's Registrations
```javascript
// Filter by userId field
// Shows all events a user registered for
```

---

## 🎯 Expected Behavior

### Events Screen Filters:
- **All Events** → Shows all events
- **Academic** → Shows only academic events
- **Cultural** → Shows only cultural events
- **Sports** → Shows only sports events
- **My Events** → Shows only registered events ⭐ NEW

### Register Button States:
1. **"Register"** (Blue) → Not registered, clickable
2. **"Registering..."** (Blue) → API call in progress, disabled
3. **"Registered ✔"** (Green) → Already registered, disabled

### Alerts:
- **Success:** "You are successfully registered. Event link will be shared soon."
- **Duplicate:** "You are already registered for this event."
- **Error:** "Failed to register. Please try again."

---

## 🚀 Production Deployment

Before deploying to production:

1. ✅ Test all scenarios above
2. ✅ Verify Firestore rules are deployed
3. ✅ Check Firebase quota limits
4. ✅ Test on both iOS and Android
5. ✅ Test on web browser
6. ✅ Verify with multiple test users

---

## 📈 Next Steps (Future)

### Admin Dashboard Features:
- View all registrations per event
- Export registration list to CSV
- Send notifications to registered users
- Close/open registrations
- Set registration limits

### Student Features:
- Unregister from events
- Add events to calendar
- Share events with friends
- Get reminders before events

---

## ✅ Status

**Implementation:** ✅ Complete  
**Testing:** Ready  
**Documentation:** ✅ Complete  
**Production:** 🟢 Ready to Deploy

---

**Need Help?**  
Check EVENT_REGISTRATION_GUIDE.md for detailed documentation.
