# Bolt & Expo Configuration

This folder contains configuration for the Bolt starter template and Expo.

## Structure

- **bolt/** – Bolt template metadata (`.bolt` moved here for organization)
- **expo/** – Expo app configuration (`app.json`)
- **metro.config.js** – Metro bundler config (re-exported from project root)

## Note

The project root still has minimal `app.config.js` and `metro.config.js` that delegate to these files. This is required because Expo CLI and Metro expect config at the root by default.
