import { Platform } from 'react-native';
import { stravaStorage } from '~/utils/use-strava';

export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  // Original Android URL fix
  if (
    path.includes('com.ferrazgui.fitnessstories://com.ferrazgui.fitnessstories') &&
    Platform.OS === 'android'
  ) {
    const newPath = path.replace(
      'com.ferrazgui.fitnessstories://com.ferrazgui.fitnessstories',
      'com.ferrazgui.fitnessstories://'
    );
    // Handle Strava OAuth call
    // back URLs
    if (path.includes('code=') && path.includes('scope=')) {
      console.log('OAuth callback detected');
      // Extract the code from the URL
      const codeMatch = path.match(/code=([^&]+)/);
      const code = codeMatch ? codeMatch[1] : null;
      stravaStorage.set('strava_auth_code', code ?? '');
    }

    return newPath;
  }

  return path;
}
