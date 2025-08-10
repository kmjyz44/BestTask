
# BestTask Mobile (Expo) — WebView Wrapper

This app wraps your deployed BestTask website so all features (auth, roles, payments, Mapbox) work out of the box.

## Configure
Create `.env` in this folder:
```
EXPO_PUBLIC_BASE_URL=https://YOUR_DEPLOYED_SITE  # e.g., https://besttask.vercel.app
```

## Run locally
```
npm i
npm run start
```
- Android emulator talks to your machine at `http://10.0.2.2:3000`.
- If your web app runs locally on port 3000, set:
  `EXPO_PUBLIC_BASE_URL=http://10.0.2.2:3000`

## Build APK/AAB & iOS (TestFlight) with EAS
1) Install EAS CLI:
```
npm i -g eas-cli
eas login
```
2) Configure project ID in `app.json` (`expo.extra.eas.projectId`). Create it with:
```
eas init
```
3) Android:
```
eas build -p android --profile production   # AAB for Play Store
eas build -p android --profile development  # APK for direct install
```
When prompted, let EAS manage credentials.

4) iOS:
```
eas build -p ios --profile production
```
EAS will guide you to create signing certificates & provisioning profiles.
After build, run:
```
eas submit -p ios --latest
eas submit -p android --latest
```
Follow prompts to connect your App Store Connect and Google Play Console.

## Notes
- Payments use Stripe inside the WebView (Elements). No extra native setup needed.
- Deep links like `besttask://worker` will route inside the web.
