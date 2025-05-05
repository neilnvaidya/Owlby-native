# Migration Guide

## Configuration Files

### app.json
- **Purpose:** Main Expo project configuration (name, slug, sdkVersion, etc.)
- **Migration Status:** Using minimal version from fresh Expo project. Only essential fields included. Added minimal `ios.bundleIdentifier` for compatibility with iOS simulator/dev builds.

### package.json
- **Purpose:** Manages project dependencies and scripts.
- **Migration Status:** Using minimal version from fresh Expo project. Dependencies will be added as needed.

### babel.config.js
- **Purpose:** Babel configuration for JavaScript/TypeScript transpilation.
- **Migration Status:** Using minimal version. Only add plugins (e.g., expo-router/babel) if required by codebase.

### metro.config.js
- **Purpose:** Metro bundler configuration for React Native/Expo.
- **Migration Status:** Using default from Expo. Only customize if issues arise.

### tsconfig.json
- **Purpose:** TypeScript configuration (if using TypeScript).
- **Migration Status:** Using default from Expo. Only modify if needed for codebase compatibility.

---

## Development Workflow
- **Expo Go:** Recommended for most projects. Scan the QR code in the CLI with the Expo Go app on your device. No custom native code or dev build required.
- **Development Build:** Only needed if you use custom native code or certain libraries. Requires building and installing a custom client.

---

## Migration Plan (Current)
1. **Incremental Migration:**
   - Migrate source files and assets from `old/` to the new project in small, tested increments.
   - For each file/folder, document its purpose and migration status here.
   - Only add dependencies as needed for each feature/component.
2. **Testing:**
   - After each major migration, test the app in Expo Go.
3. **Documentation:**
   - Keep this guide updated with every migration step.

---

## Next Steps
- Begin migrating source files and assets from `old/` to the new project, starting with the most essential app code (e.g., `App.js`, main navigation, core components).
- Document each migration step and any new dependencies here.
- Test with Expo Go after each step.

## Migrated Files (App Entry & Layout)

### app/index.tsx
- **Purpose:** Main entry point for the app. Redirects to the (auth) route using expo-router.
- **Migration Status:** Migrated from old/app/index.tsx. No changes needed.

### app/_layout.tsx
- **Purpose:** Main layout for navigation, fonts, splash screen, and context providers.
- **Migration Status:** Migrated from old/app/_layout.tsx. Dependencies installed. Imports AuthContext and SpaceMono font.

### src/contexts/AuthContext.tsx
- **Purpose:** Provides authentication context for the app.
- **Migration Status:** Migrated from old/src/contexts/AuthContext.tsx. No changes needed.

### assets/fonts/SpaceMono-Regular.ttf
- **Purpose:** Custom font used in the app layout.
- **Migration Status:** Migrated from old/assets/fonts/SpaceMono-Regular.ttf. No changes needed.

### app/(auth)/
- **Purpose:** Contains authentication-related routes and screens (login, register, reset-password, etc.) for the app.
- **Migration Status:** Migrated all files from old/app/(auth) to app/(auth). No changes needed.

### app/components/
- **Purpose:** Contains shared UI components for the app.
- **Migration Status:** Migrated ConnectionTest.tsx from old/app/components. No changes needed.

### app/components/auth/
- **Purpose:** Contains authentication-related UI components (AppleSignInButton, GoogleSignInButton, EmailSignInForm).
- **Migration Status:** Migrated main components from old/app/components/auth. Omitted __tests__ directory for now.

### app/constants/
- **Purpose:** Contains constants used throughout the app (e.g., Colors, Config).
- **Migration Status:** Migrated Colors.ts and Config.ts from old/app/constants. No changes needed.

### app/utils/
- **Purpose:** Contains utility functions for the app (e.g., api.ts for API calls).
- **Migration Status:** Migrated api.ts from old/app/utils. No changes needed.

### app/assets/images/
- **Purpose:** Contains image assets used in the app (e.g., logo.png, logo.svg).
- **Migration Status:** Migrated logo.png and logo.svg from old/app/assets/images. No changes needed.

### app/auth.tsx, app/chat.tsx, app/+html.tsx, app/[...missing].tsx, app/modal.tsx, app/test.tsx
- **Purpose:**
  - auth.tsx: Likely an authentication-related screen or utility.
  - chat.tsx: Likely a chat feature or screen.
  - +html.tsx: Possibly a custom HTML renderer or route.
  - [...missing].tsx: Catch-all route for missing pages.
  - modal.tsx: Modal route or component.
  - test.tsx: Test or demo screen/component.
- **Migration Status:** Migrated from old/app. No changes yet; review and further integration may be needed as migration continues.

### supabase/
- **Purpose:** Contains database schema, migrations, and related files for Supabase backend.
- **Migration Status:** Migrated all contents from old/supabase. `.temp` directory included for completeness, but can be omitted if not needed.

### backend/
- **Purpose:** Node/Express backend for the project, including all source, build, and deployment files.
- **Migration Status:** Migrated all contents from old/backend. No changes yet; review for integration with frontend as needed.

### api/
- **Purpose:** Contains API route files for serverless or edge functions.
- **Migration Status:** Migrated all .js files from old/api. No changes needed.

### plugins/
- **Purpose:** Contains plugin files for extending app functionality (e.g., withGoogleSignIn).
- **Migration Status:** Migrated withGoogleSignIn.js from old/plugins. No changes needed.

### components/
- **Purpose:** Shared UI components for the app.
- **Migration Status:** Migrated EditScreenInfo.tsx, ExternalLink.tsx, StyledText.tsx, Themed.tsx from old/components. Omitted __tests__ directory for now.

### constants/
- **Purpose:** Shared constants for the app.
- **Migration Status:** Migrated Colors.ts from old/constants. No changes needed. 