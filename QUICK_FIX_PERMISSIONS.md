# 🔧 QUICK FIX - Permission Error

## ❌ Error You're Seeing:
```
Profile listener error: FirebaseError: Missing or insufficient permissions.
```

## ✅ Solution (2 Minutes)

### Step 1: Deploy Firestore Rules

1. **Open Firebase Console**: https://console.firebase.google.com
2. **Select your project**: IntelliCamp
3. **Go to**: Firestore Database → Rules
4. **Copy the content** from `firestore.rules` file (already updated!)
5. **Paste** into Firebase Console Rules editor
6. **Click "Publish"**

### Step 2: Verify Rules Are Active

After publishing, you should see:
```
✅ Rules published successfully
```

### Step 3: Restart Your App

```bash
# Stop the app (Ctrl+C)
# Start again
npx expo start
```

---

## 📋 What Was Fixed

✅ Added `eventRegistrations` collection rules  
✅ Updated `firestore.rules` file  
✅ Ready to deploy to Firebase  

---

## 🎯 Expected Result

After deploying rules:
- ✅ No more "Permission Denied" errors
- ✅ Events screen loads correctly
- ✅ Registration works
- ✅ Profile loads successfully

---

## 🚀 Deploy Now!

The `firestore.rules` file has been updated. Just deploy it to Firebase Console!
