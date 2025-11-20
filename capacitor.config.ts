import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yavirac.jsv',
  appName: 'jordysc',
  webDir: 'www',
  server: {
    androidScheme: 'http'
  },
  plugins: {
  PushNotifications: {
    presentationOptions: ["badge", "sound", "alert"]
  }
}
};

export default config; 

