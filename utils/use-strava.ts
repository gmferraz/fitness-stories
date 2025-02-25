import * as AuthSession from 'expo-auth-session';
import { useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import { useStravaStore } from '../stores/use-strava-store';
import { decode } from '@googlemaps/polyline-codec';
import { StravaActivity } from '~/features/home/types/activity';
import * as Sentry from '@sentry/react-native';

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
    Sentry.captureMessage('No stored refresh token or expiry found', {
      level: 'warning',
      tags: { action: 'strava_token_refresh' },
    });
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (now < storedExpiry - 3600) {
    return stravaStorage.getString('strava_access_token');
  }

  Sentry.addBreadcrumb({
    category: 'auth',
    message: 'Refreshing Strava token',
    level: 'info',
  });

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
      const errorMsg = 'Token refresh failed: No access token in response';
      console.error(errorMsg);
      Sentry.captureMessage(errorMsg, {
        level: 'error',
        tags: { action: 'strava_token_refresh' },
        extra: { response: JSON.stringify(tokenResult) },
      });
      return null;
    }

    stravaStorage.set('strava_access_token', tokenResult.access_token);
    stravaStorage.set('strava_refresh_token', tokenResult.refresh_token);
    stravaStorage.set('strava_token_expiry', tokenResult.expires_at);

    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'Strava token refreshed successfully',
      level: 'info',
    });

    return tokenResult.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    Sentry.captureException(error, {
      tags: { action: 'strava_token_refresh' },
      extra: { refresh_token: storedRefreshToken ? 'present' : 'missing' },
    });
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
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Checking Strava authentication status',
        level: 'info',
      });
      const token = await maybeRefreshToken();
      setIsAuthenticated(!!token);
      Sentry.setTag('strava_authenticated', !!token);
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
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Strava auth successful, exchanging token',
        level: 'info',
      });

      const exchangeToken = async () => {
        try {
          const tokenResult = await AuthSession.exchangeCodeAsync(
            {
              clientId: request?.clientId!,
              redirectUri,
              code,
              extraParams: {
                client_secret: stravaClientSecret,
                grant_type: 'authorization_code',
              },
            },
            { tokenEndpoint: 'https://www.strava.com/oauth/token' }
          );
          if (!tokenResult) {
            const errorMsg = 'Token exchange failed: No token result';
            console.error(errorMsg);
            Sentry.captureMessage(errorMsg, {
              level: 'error',
              tags: { action: 'strava_token_exchange' },
            });
            return;
          }
          const { accessToken, refreshToken, expiresIn } = tokenResult;

          if (!accessToken) {
            const errorMsg = 'Token exchange failed: No access token in response';
            console.error(errorMsg);
            Sentry.captureMessage(errorMsg, {
              level: 'error',
              tags: { action: 'strava_token_exchange' },
              extra: { has_refresh_token: !!refreshToken },
            });
            return;
          }

          stravaStorage.set('strava_access_token', accessToken);
          stravaStorage.set('strava_refresh_token', refreshToken ?? '');
          stravaStorage.set(
            'strava_token_expiry',
            Math.floor(Date.now() / 1000) + (expiresIn ?? 1)
          );
          setIsAuthenticated(true);
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'Strava token exchange successful',
            level: 'info',
          });
          Sentry.setTag('strava_authenticated', true);
        } catch (error) {
          console.error('Token exchange failed:', error);
          Sentry.captureException(error, {
            tags: { action: 'strava_token_exchange' },
          });
        }
      };

      exchangeToken();
    } else if (
      response &&
      ['error', 'cancel', 'dismiss', 'opened', 'locked'].includes(response.type)
    ) {
      Sentry.captureMessage('Strava auth response not successful', {
        level: 'warning',
        tags: { action: 'strava_auth' },
        extra: { response_type: response.type },
      });
    }
  }, [response, setIsAuthenticated]);

  const handleLinkStrava = async () => {
    try {
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'User initiating Strava link',
        level: 'info',
      });
      await promptAsync();
    } catch (error) {
      console.error('Error linking Strava:', error);
      Sentry.captureException(error, {
        tags: { action: 'strava_link' },
      });
    }
  };

  const handleUnlinkStrava = async () => {
    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'User unlinking Strava account',
      level: 'info',
    });

    setIsAuthenticated(false);
    try {
      await AuthSession.revokeAsync(
        {
          token: stravaStorage.getString('strava_access_token')!,
        },
        discovery
      );
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Strava token revoked successfully',
        level: 'info',
      });
    } catch (error) {
      console.error('Error revoking token:', error);
      Sentry.captureException(error, {
        tags: { action: 'strava_unlink' },
      });
    }
    stravaStorage.delete('strava_access_token');
    stravaStorage.delete('strava_refresh_token');
    stravaStorage.delete('strava_token_expiry');
    Sentry.setTag('strava_authenticated', false);
  };

  const listLast10RunningExercises = async (): Promise<StravaActivity[]> => {
    const token = await maybeRefreshToken();
    if (!token) {
      const errorMsg = 'No valid access token for fetching activities';
      console.error(errorMsg);
      Sentry.captureMessage(errorMsg, {
        level: 'error',
        tags: { action: 'strava_fetch_activities' },
      });
      return [];
    }

    Sentry.addBreadcrumb({
      category: 'api',
      message: 'Fetching Strava activities',
      level: 'info',
    });

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
        const errorMsg = `Failed to fetch activities: ${response.statusText}`;
        console.error(errorMsg);
        Sentry.captureMessage(errorMsg, {
          level: 'error',
          tags: { action: 'strava_fetch_activities' },
          extra: { status: response.status },
        });
        return [];
      }

      const activities: StravaActivity[] = await response.json();
      Sentry.addBreadcrumb({
        category: 'api',
        message: `Fetched ${activities.length} Strava activities`,
        level: 'info',
      });

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
      Sentry.captureException(error, {
        tags: { action: 'strava_fetch_activities' },
      });
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
