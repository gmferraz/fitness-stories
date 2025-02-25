import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Icon } from '@roninoss/icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

import { Text } from '~/components/nativewindui/Text';
import { Toggle } from '~/components/nativewindui/Toggle';
import { useEnvironmentStore } from '~/features/app-setup/use-environment';
import { useColorScheme } from '~/lib/useColorScheme';
import { languageDetector } from '~/utils/i18n/languageDetector';

import StravaIcon from '~/assets/svg/strava.svg';
import AppleHealthIcon from '~/assets/svg/apple-health.svg';
import { useStravaStore } from '~/stores/use-strava-store';
import { useStrava } from '~/utils/use-strava';
import { weekStartStore } from '~/stores/use-week-start-store';
import { useAppleHealth } from '~/utils/use-apple-health';

export default function SettingsScreen() {
  const { colors, colorScheme } = useColorScheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const { isGui, isPremium, setIsPremium } = useEnvironmentStore();
  const { isAuthenticated: isStravaConnected } = useStravaStore();
  const { handleLinkStrava, handleUnlinkStrava } = useStrava();
  const { weekStartsOn, setWeekStartsOn } = weekStartStore();
  const {
    isAuthenticated: isAppleHealthConnected,
    isAvailable: isAppleHealthAvailable,
    initializeHealthKit,
    handleDisconnect: handleUnlinkAppleHealth,
  } = useAppleHealth();

  // Add new optimistic states
  const [isConnectingStrava, setIsConnectingStrava] = useState(false);
  const [isConnectingAppleHealth, setIsConnectingAppleHealth] = useState(false);

  const handleTalkWithUs = () => {
    Linking.openURL('mailto:gmedeirosferraz@me.com');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    languageDetector.cacheUserLanguage?.(newLanguage);
  };

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <ScrollView className="flex-1 bg-background">
        <View className="px-4 py-6">
          <Text variant="footnote" className="mb-2 px-4 text-gray-500">
            {t('settings.sections.general')}
          </Text>

          <View className="mb-6 rounded-lg bg-card">
            <View className="flex-row items-center justify-between border-b border-gray-400/20 px-4 py-3 dark:border-gray-200/10">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-purple-400 shadow-sm">
                  <MaterialCommunityIcons name="earth" size={24} color="white" />
                </View>
                <Text variant="body">{t('settings.language.title')}</Text>
              </View>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Pressable className="android:gap-3 flex-row items-center gap-1.5">
                    <Text variant="subhead" color="primary">
                      {t(`settings.language.options.${language}`)}
                    </Text>
                    <View className="pl-0.5">
                      <Icon name="chevron-down" color={colors.grey} size={21} />
                    </View>
                  </Pressable>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.CheckboxItem
                    key="en"
                    value={language === 'en'}
                    onValueChange={() => handleLanguageChange('en')}>
                    <DropdownMenu.ItemIndicator />
                    <DropdownMenu.ItemTitle>
                      {t('settings.language.options.en')}
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.CheckboxItem
                    key="pt"
                    value={language === 'pt'}
                    onValueChange={() => handleLanguageChange('pt')}>
                    <DropdownMenu.ItemIndicator />
                    <DropdownMenu.ItemTitle>
                      {t('settings.language.options.pt')}
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.CheckboxItem
                    key="es"
                    value={language === 'es'}
                    onValueChange={() => handleLanguageChange('es')}>
                    <DropdownMenu.ItemIndicator />
                    <DropdownMenu.ItemTitle>
                      {t('settings.language.options.es')}
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.CheckboxItem
                    key="fr"
                    value={language === 'fr'}
                    onValueChange={() => handleLanguageChange('fr')}>
                    <DropdownMenu.ItemIndicator />
                    <DropdownMenu.ItemTitle>
                      {t('settings.language.options.fr')}
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.CheckboxItem>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </View>

            <View className="flex-row items-center justify-between border-b border-gray-400/20 px-4 py-3 dark:border-gray-200/10">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-orange-400 shadow-sm">
                  <MaterialCommunityIcons name="calendar" size={24} color="white" />
                </View>
                <Text variant="body">{t('settings.weekStart.title')}</Text>
              </View>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Pressable className="android:gap-3 flex-row items-center gap-1.5">
                    <Text variant="subhead" color="primary">
                      {t(`settings.weekStart.options.${weekStartsOn === 1 ? 'monday' : 'sunday'}`)}
                    </Text>
                    <View className="pl-0.5">
                      <Icon name="chevron-down" color={colors.grey} size={21} />
                    </View>
                  </Pressable>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.CheckboxItem
                    key="monday"
                    value={weekStartsOn === 1}
                    onValueChange={() => setWeekStartsOn(1)}>
                    <DropdownMenu.ItemIndicator />
                    <DropdownMenu.ItemTitle>
                      {t('settings.weekStart.options.monday')}
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.CheckboxItem
                    key="sunday"
                    value={weekStartsOn === 0}
                    onValueChange={() => setWeekStartsOn(0)}>
                    <DropdownMenu.ItemIndicator />
                    <DropdownMenu.ItemTitle>
                      {t('settings.weekStart.options.sunday')}
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.CheckboxItem>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </View>

            <TouchableOpacity
              onPress={handleTalkWithUs}
              className="flex-row items-center justify-between px-4 py-3">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-blue-400 shadow-sm">
                  <MaterialCommunityIcons name="email-outline" size={24} color="white" />
                </View>
                <Text variant="body">{t('settings.talkWithUs.title')}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.grey} />
            </TouchableOpacity>
          </View>

          <Text variant="footnote" className="mb-2  px-4 text-gray-500">
            {t('settings.sections.premium')}
          </Text>
          <TouchableOpacity className="mb-6 flex-row items-center justify-between rounded-lg bg-card px-4 py-3">
            <View className="flex-row items-center gap-3">
              <View className="h-8 w-8 items-center justify-center rounded-md bg-[#DAA520] shadow-sm">
                <Icon name="star" size={24} color="white" />
              </View>

              <Text variant="body" color="primary">
                {t('settings.premium.title')}
              </Text>
            </View>
            <Toggle
              value={isPremium}
              onValueChange={isGui ? setIsPremium : isPremium ? null : () => null}
              trackColor={{ false: colors.grey4, true: 'green' }}
            />
          </TouchableOpacity>

          <Text variant="footnote" className="mb-2 px-4 text-gray-500">
            {t('settings.sections.connectedApps')}
          </Text>
          <View className="mb-6 rounded-lg bg-card">
            <View className="flex-row items-center justify-between border-b border-gray-400/20 px-4 py-3 dark:border-gray-200/10">
              <View className="flex-row items-center gap-4">
                <View className="h-8 w-8 rounded-sm shadow-sm">
                  <StravaIcon />
                </View>
                <Text variant="body">{t('settings.apps.strava.title')}</Text>
              </View>
              <Toggle
                value={isStravaConnected || isConnectingStrava}
                onValueChange={() => {
                  if (isStravaConnected) {
                    handleUnlinkStrava();
                  } else {
                    setIsConnectingStrava(true);
                    handleLinkStrava();
                    setTimeout(() => {
                      setIsConnectingStrava(false);
                    }, 5000);
                  }
                }}
                trackColor={{ false: colors.grey4, true: 'green' }}
              />
            </View>
            {isAppleHealthAvailable && (
              <View className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center gap-4">
                  <View className="h-8 w-8 rounded-md bg-red-100 shadow-sm">
                    <AppleHealthIcon />
                  </View>
                  <View>
                    <Text variant="body">{t('settings.apps.appleHealth.title')}</Text>
                  </View>
                </View>
                <Toggle
                  value={isAppleHealthConnected || isConnectingAppleHealth}
                  onValueChange={() => {
                    if (isAppleHealthConnected) {
                      handleUnlinkAppleHealth();
                    } else {
                      setIsConnectingAppleHealth(true);
                      initializeHealthKit();
                      setTimeout(() => {
                        setIsConnectingAppleHealth(false);
                      }, 5000);
                    }
                  }}
                  trackColor={{ false: colors.grey4, true: 'green' }}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
