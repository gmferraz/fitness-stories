import * as AuthSession from 'expo-auth-session';
import { useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import { useStravaStore } from '../stores/use-strava-store';

export const stravaStorage = new MMKV({
  id: 'strava-storage',
});

const stravaClientId = process.env.EXPO_PUBLIC_STRAVA_ID!;
const stravaClientSecret = process.env.EXPO_PUBLIC_STRAVA_KEY!;

// (Redirect URI construction is assumed to be correct)
const redirectUri =
  AuthSession.makeRedirectUri({ scheme: 'com.ferrazgui.fitnessstories' }) +
  'com.ferrazgui.fitnessstories';

const discovery = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
  revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
};

export type StravaActivity = {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
};

async function maybeRefreshToken() {
  const storedRefreshToken = stravaStorage.getString('strava_refresh_token');
  const storedExpiry = stravaStorage.getNumber('strava_token_expiry');
  if (!storedRefreshToken || !storedExpiry) {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  // Use a 5-minute buffer before expiry
  if (now < storedExpiry - 300) {
    return stravaStorage.getString('strava_access_token');
  }
  try {
    const tokenResult = await AuthSession.refreshAsync(
      {
        clientId: stravaClientId,
        clientSecret: stravaClientSecret,
        refreshToken: storedRefreshToken,
        scopes: ['activity:read_all'],
      },
      discovery
    );
    if (!tokenResult) {
      console.error('Token refresh failed: No token result');
      return null;
    }
    const { accessToken, refreshToken, expiresIn } = tokenResult;
    stravaStorage.set('strava_access_token', accessToken);
    if (refreshToken) {
      stravaStorage.set('strava_refresh_token', refreshToken);
    }
    stravaStorage.set('strava_token_expiry', now + (expiresIn ?? 1));
    return accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Optionally clear tokens if refresh fails
    stravaStorage.delete('strava_access_token');
    stravaStorage.delete('strava_refresh_token');
    stravaStorage.delete('strava_token_expiry');
    return null;
  }
}

export const useStrava = () => {
  const { isAuthenticated, setIsAuthenticated } = useStravaStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await maybeRefreshToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, [setIsAuthenticated]);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: stravaClientId,
      scopes: ['activity:read_all'],
      redirectUri,
      responseType: 'code',
      extraParams: {
        approval_prompt: 'auto',
      },
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      const exchangeToken = async () => {
        try {
          const tokenResult = await AuthSession.exchangeCodeAsync(
            {
              clientId: request?.clientId!,
              redirectUri,
              code,
              extraParams: {
                client_secret: stravaClientSecret,
              },
            },
            { tokenEndpoint: 'https://www.strava.com/oauth/token' }
          );
          if (!tokenResult) {
            console.error('Token exchange failed: No token result');
            return;
          }
          const { accessToken, refreshToken, expiresIn } = tokenResult;
          stravaStorage.set('strava_access_token', accessToken);
          stravaStorage.set('strava_refresh_token', refreshToken ?? '');
          stravaStorage.set(
            'strava_token_expiry',
            Math.floor(Date.now() / 1000) + (expiresIn ?? 1)
          );
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token exchange failed:', error);
        }
      };

      exchangeToken();
    }
  }, [response, setIsAuthenticated]);

  const handleLinkStrava = () => {
    promptAsync();
  };

  const listLast10RunningExercises = async (): Promise<StravaActivity[]> => {
    const token = await maybeRefreshToken();
    if (!token) {
      console.error('No valid access token');
      return [];
    }
    const nowEpoch = Math.floor(Date.now() / 1000);
    const oneMonthAgoEpoch = nowEpoch - 30 * 24 * 3600; // last 30 days
    try {
      const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?before=${nowEpoch}&after=${oneMonthAgoEpoch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.error('Failed to fetch activities:', response.statusText);
        return [];
      }
      const activities: StravaActivity[] = await response.json();
      return activities.filter((activity) => activity.type === 'Run').slice(0, 10);
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  };

  return {
    isAuthenticated,
    handleLinkStrava,
    listLast10RunningExercises,
    request,
  };
};
