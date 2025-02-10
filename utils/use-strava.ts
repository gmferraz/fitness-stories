import * as AuthSession from 'expo-auth-session';
import { useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import { useStravaStore } from '../stores/use-strava-store';
import { decode } from '@googlemaps/polyline-codec';
import { StravaActivity } from '~/features/home/types/activity';

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

async function maybeRefreshToken() {
  const storedRefreshToken = stravaStorage.getString('strava_refresh_token');
  const storedExpiry = stravaStorage.getNumber('strava_token_expiry');
  if (!storedRefreshToken || !storedExpiry) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (now < storedExpiry - 3600) {
    return stravaStorage.getString('strava_access_token');
  }

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: stravaClientId,
        client_secret: stravaClientSecret,
        grant_type: 'refresh_token',
        refresh_token: storedRefreshToken,
      }),
    });

    const tokenResult = await response.json();

    if (!tokenResult.access_token) {
      console.error('Token refresh failed: No access token in response');
      return null;
    }

    stravaStorage.set('strava_access_token', tokenResult.access_token);
    stravaStorage.set('strava_refresh_token', tokenResult.refresh_token);
    stravaStorage.set('strava_token_expiry', tokenResult.expires_at);

    return tokenResult.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
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

  const handleLinkStrava = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error linking Strava:', error);
    }
  };

  const handleUnlinkStrava = async () => {
    setIsAuthenticated(false);
    try {
      await AuthSession.revokeAsync(
        {
          token: stravaStorage.getString('strava_access_token')!,
        },
        discovery
      );
    } catch (error) {
      console.error('Error revoking token:', error);
    }
    stravaStorage.delete('strava_access_token');
    stravaStorage.delete('strava_refresh_token');
    stravaStorage.delete('strava_token_expiry');
  };

  const listLast10RunningExercises = async (): Promise<StravaActivity[]> => {
    const token = await maybeRefreshToken();
    if (!token) {
      console.error('No valid access token');
      return [];
    }
    const nowEpoch = Math.floor(Date.now() / 1000);
    const oneMonthAgoEpoch = nowEpoch - 86400 * 150; // last 150 days
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
      return activities.map((activity) => ({
        ...activity,
        id: `strava-${activity.id}`,
        root: 'strava' as const,
        map: activity.map && {
          ...activity.map,
          coordinates: activity.map.summary_polyline
            ? decode(activity.map.summary_polyline).map(([lat, lng]) => ({
                latitude: lat,
                longitude: lng,
              }))
            : undefined,
        },
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  };

  return {
    isAuthenticated,
    handleLinkStrava,
    handleUnlinkStrava,
    listLast10RunningExercises,
    request,
  };
};
