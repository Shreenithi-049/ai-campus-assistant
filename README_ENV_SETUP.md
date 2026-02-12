# Environment Variables Setup Guide

## 🔒 Security First

**NEVER commit your `.env` file to Git.** It contains sensitive credentials that could compromise your Firebase project.

## 🚀 Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click the gear icon ⚙️ → **Project Settings**
   - Scroll down to **Your apps** section
   - If you don't have a web app, click **Add app** → **Web** (</>) icon
   - Copy the config values from the `firebaseConfig` object

3. **Fill in your `.env` file:**
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

4. **Restart your Expo development server:**
   ```bash
   npm start
   ```
   (Environment variables are loaded when Expo starts)

## 📋 Required Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | Firebase Console > Project Settings > Web App Config |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth Domain | Same as above |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Project ID | Same as above |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage Bucket | Same as above |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID | Same as above |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | App ID | Same as above |

## ⚠️ Important Notes

### Why `EXPO_PUBLIC_` prefix?
- Expo requires the `EXPO_PUBLIC_` prefix for environment variables to be accessible in your app
- Variables without this prefix are only available in Node.js context (server-side)

### Environment Variables in Expo
- Environment variables are embedded at build time, not runtime
- For production builds, set variables in your CI/CD pipeline or Expo dashboard
- Never expose sensitive server-side secrets (use `EXPO_PUBLIC_` only for client-safe values)

### Team Collaboration
- Each team member should have their own `.env` file
- Use different Firebase projects for development/staging/production
- Share Firebase project access via Firebase Console, not via `.env` files

## 🐛 Troubleshooting

### "Missing Firebase configuration" error
- Make sure you've created a `.env` file (not just `.env.example`)
- Restart your Expo dev server after creating/updating `.env`
- Verify all variables start with `EXPO_PUBLIC_`
- Check for typos in variable names

### Variables not updating
- Restart Expo dev server: `npm start`
- Clear Expo cache: `expo start -c`
- Verify `.env` file is in the project root (same level as `package.json`)

## 🔐 Security Checklist

- [ ] `.env` is in `.gitignore` (already done)
- [ ] `.env.example` contains no real secrets (only placeholders)
- [ ] Never commit `.env` file
- [ ] Use different Firebase projects for dev/staging/prod
- [ ] Rotate API keys if accidentally exposed
- [ ] Review Firebase security rules regularly

## 📚 Additional Resources

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

