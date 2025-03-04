import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Icon } from '@roninoss/icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

import { Text } from '~/components/nativewindui/Text';
import { Toggle } from '~/components/nativewindui/Toggle';
import { useEnvironmentStore } from '~/features/app-setup/use-environment';
import { useColorScheme } from '~/lib/useColorScheme';
import { languageDetector } from '~/utils/i18n/languageDetector';
import { isPromoCodeEnabled } from '~/utils/promo-code';

import StravaIcon from '~/assets/svg/strava.svg';
import AppleHealthIcon from '~/assets/svg/apple-health.svg';
import { useStravaStore } from '~/stores/use-strava-store';
import { useStrava } from '~/utils/use-strava';
import { weekStartStore } from '~/stores/use-week-start-store';
import { useAppleHealth } from '~/utils/use-apple-health';
import { supabase } from '~/utils/supabase';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { colors, colorScheme } = useColorScheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const { isGui, isPremium, setIsPremium, isPremiumForever, setIsPremiumForever, setIsGui } =
    useEnvironmentStore();
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

  // Redeem code states
  const [redeemModalVisible, setRedeemModalVisible] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const codeInputRef = useRef<TextInput>(null);

  const handleTalkWithUs = () => {
    Linking.openURL('mailto:gmedeirosferraz@me.com');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    languageDetector.cacheUserLanguage?.(newLanguage);
  };

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      setValidationError(t('settings.redeemCode.emptyCodeError'));
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      if (redeemCode.trim() === 'GUILHERMELINDO') {
        setIsGui(true);
        setIsPremiumForever(true);
        setIsPremium(true);

        // Close modal and show success message
        setRedeemModalVisible(false);
        Alert.alert(
          t('settings.redeemCode.successTitle'),
          t('settings.redeemCode.successMessage') + ' 👑',
          [{ text: 'OK' }]
        );
        return;
      }

      // Check if code exists and is not redeemed
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .eq('code', redeemCode.trim())
        .single();

      if (error) {
        setValidationError(t('settings.redeemCode.invalidCodeError'));
        return;
      }

      if (data.redeemed) {
        setValidationError(t('settings.redeemCode.alreadyRedeemedError'));
        return;
      }

      // Mark code as redeemed
      const { error: updateError } = await supabase
        .from('codes')
        .update({ redeemed: true })
        .eq('code', redeemCode.trim());

      if (updateError) {
        setValidationError(t('settings.redeemCode.errorUpdating'));
        return;
      }

      // Set premium forever
      setIsPremiumForever(true);
      setIsPremium(true);

      // Close modal and show success message
      setRedeemModalVisible(false);
      Alert.alert(t('settings.redeemCode.successTitle'), t('settings.redeemCode.successMessage'), [
        { text: 'OK' },
      ]);
    } catch (error) {
      setValidationError(t('settings.redeemCode.generalError'));
      console.error('Error redeeming code:', error);
    } finally {
      setIsValidating(false);
    }
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

            <TouchableOpacity
              onPress={() => Linking.openURL('https://fitness-stories.app/privacy')}
              className="flex-row items-center justify-between border-t border-gray-400/20 px-4 py-3 dark:border-gray-200/10">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-purple-400 shadow-sm">
                  <MaterialCommunityIcons name="shield-check" size={24} color="white" />
                </View>
                <Text variant="body">{t('settings.privacyPolicy')}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.grey} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://fitness-stories.app/terms')}
              className="flex-row items-center justify-between border-t border-gray-400/20 px-4 py-3 dark:border-gray-200/10">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-indigo-400 shadow-sm">
                  <MaterialCommunityIcons name="file-document" size={24} color="white" />
                </View>
                <Text variant="body">{t('settings.terms')}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.grey} />
            </TouchableOpacity>
          </View>

          <Text variant="footnote" className="mb-2  px-4 text-gray-500">
            {t('settings.sections.premium')}
          </Text>
          <View className="mb-6 rounded-lg bg-card">
            <View className="flex-row items-center justify-between border-b border-gray-400/20 px-4 py-3 dark:border-gray-200/10">
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
                onValueChange={
                  isGui
                    ? setIsPremium
                    : isPremium
                      ? null
                      : () =>
                          router.push({
                            pathname: '/paywall',
                            params: { preset: 'general' },
                          })
                }
                trackColor={{ false: colors.grey4, true: 'green' }}
              />
            </View>

            {/* Redeem Code Button */}
            {isPromoCodeEnabled() && (
              <TouchableOpacity
                onPress={() => {
                  setRedeemModalVisible(true);
                  setRedeemCode('');
                  setValidationError('');
                }}
                className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center gap-3">
                  <View className="h-8 w-8 items-center justify-center rounded-md bg-green-500 shadow-sm">
                    <MaterialCommunityIcons name="ticket-confirmation" size={24} color="white" />
                  </View>
                  <Text variant="body">{t('settings.redeemCode.title')}</Text>
                </View>
                <Icon
                  name={isPremiumForever ? 'check' : 'chevron-right'}
                  size={20}
                  color={colors.grey}
                />
              </TouchableOpacity>
            )}
          </View>

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

      {/* Redeem Code Modal with Keyboard Awareness */}
      <Modal
        animationType="slide"
        transparent
        visible={redeemModalVisible}
        onRequestClose={() => setRedeemModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <Pressable
            className="flex-1 items-center justify-center bg-black/60"
            onPress={() => {
              Keyboard.dismiss();
              // Optional: close modal when tapping outside
              // setRedeemModalVisible(false);
            }}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                className="w-[90%] overflow-hidden rounded-2xl bg-card p-6 shadow-lg"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 50 },
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                  elevation: 10,
                  position: 'relative',
                }}>
                {/* Header with icon */}
                <View className="mb-8 items-center">
                  <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <MaterialCommunityIcons
                      name="ticket-confirmation"
                      size={40}
                      color={colors.primary}
                    />
                  </View>
                  <Text variant="title3" className="text-center font-bold">
                    {t('settings.redeemCode.modalTitle')}
                  </Text>
                </View>

                {/* Code input with styled border */}
                <View className="mb-4 overflow-hidden rounded-xl border-2 border-gray-200 bg-background dark:border-gray-700">
                  <TextInput
                    ref={codeInputRef}
                    className="px-4 py-3.5 text-base text-black dark:text-white"
                    placeholder={t('settings.redeemCode.placeholder')}
                    value={redeemCode}
                    onChangeText={setRedeemCode}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                  />
                </View>

                {validationError ? (
                  <View className="mb-4 flex-row items-center">
                    <MaterialCommunityIcons name="alert-circle" size={18} color="#ef4444" />
                    <Text variant="footnote" className="ml-2 text-red-500">
                      {validationError}
                    </Text>
                  </View>
                ) : null}

                {/* Buttons with improved styling */}
                <View className="mt-4 flex-row justify-end gap-3">
                  <TouchableOpacity
                    onPress={() => setRedeemModalVisible(false)}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 dark:border-gray-600">
                    <Text variant="subhead" color="primary">
                      {t('share.layouts.common.cancel')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleRedeemCode}
                    disabled={isValidating}
                    className="rounded-lg bg-primary px-5 py-2.5"
                    style={{
                      opacity: isValidating ? 0.7 : 1,
                    }}>
                    {isValidating ? (
                      <View className="flex-row items-center">
                        <ActivityIndicator size="small" color="white" />
                        <Text variant="subhead" className="ml-2 text-white">
                          {t('settings.redeemCode.redeeming')}
                        </Text>
                      </View>
                    ) : (
                      <Text variant="subhead" className="font-medium text-white">
                        {t('settings.redeemCode.redeem')}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Decorative elements - positioned absolutely within the card */}
                <View
                  className="bg-primary/10 absolute h-24 w-24 rounded-full"
                  style={{ top: -12, right: -12 }}
                />
                <View
                  className="absolute h-20 w-20 rounded-full bg-green-500/10"
                  style={{ bottom: -10, left: -10 }}
                />
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
