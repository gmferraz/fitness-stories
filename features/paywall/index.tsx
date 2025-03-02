import { Icon } from '@roninoss/icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Platform } from 'react-native';
import Purchases, { PRODUCT_TYPE, PurchasesStoreProduct } from 'react-native-purchases';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEnvironmentStore } from '../app-setup/use-environment';

import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

const isAndroid = Platform.OS === 'android';

const ANNUAL_PACKAGE_ID = isAndroid ? 'rc_annual_2w0' : 'rc_annual_2w0';
const MONTHLY_PACKAGE_ID = isAndroid ? 'rc_monthly_2w0' : 'rc_monthly_2w0';

// Fixed discount percentage for annual plan
const ANNUAL_DISCOUNT = 60;

// Paywall presets
export type PaywallPreset = 'editTemplates' | 'removeAds' | 'general';

export interface PaywallContent {
  title: string;
  subtitle: string;
  iconName: string;
}

// Mock products for development
const MOCK_PRODUCTS: any[] = [
  {
    identifier: ANNUAL_PACKAGE_ID,
    title: 'Annual Premium',
    description: 'Annual subscription',
    price: 249,
    priceString: 'R$ 80,00',
    currencyCode: 'BRL',
    introPrice: null,
    discounts: [],
    productCategory: null,
    productType: PRODUCT_TYPE.AUTO_RENEWABLE_SUBSCRIPTION,
    subscriptionPeriod: 'P1Y',
    defaultOption: {} as any,
    presentedOfferingIdentifier: 'premium',
    presentedOfferingContext: null,
  },
  {
    identifier: MONTHLY_PACKAGE_ID,
    title: 'Monthly Premium',
    description: 'Monthly subscription',
    price: 59.9,
    priceString: 'R$ 14,90',
    currencyCode: 'BRL',
    introPrice: null,
    discounts: [],
    productCategory: null,
    productType: PRODUCT_TYPE.AUTO_RENEWABLE_SUBSCRIPTION,
    subscriptionPeriod: 'P1M',
    defaultOption: false,
    presentedOfferingIdentifier: 'premium',
    presentedOfferingContext: null,
  },
];

interface PaywallProps {
  preset?: PaywallPreset;
  customContent?: PaywallContent;
}

export function Paywall({ preset = 'editTemplates', customContent }: PaywallProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const { colors } = useColorScheme();
  const [packages, setPackages] = useState<PurchasesStoreProduct[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const setIsPremium = useEnvironmentStore((state) => state.setIsPremium);

  const [isLoading, setIsLoading] = useState(false);

  // Get content based on preset or custom content
  const content = customContent || {
    title: t(`paywall.presets.${preset}.title`),
    subtitle: t(`paywall.presets.${preset}.subtitle`),
    iconName: 'star',
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Use mock products in development mode
        if (__DEV__) {
          setPackages(MOCK_PRODUCTS);
          setSelectedPackage(ANNUAL_PACKAGE_ID);
          return;
        }

        const products = await Purchases.getProducts([ANNUAL_PACKAGE_ID, MONTHLY_PACKAGE_ID]);
        if (products.length > 0) {
          setPackages(products);
          setSelectedPackage(
            products.find((product) => product.identifier === ANNUAL_PACKAGE_ID)?.identifier ??
              products[0].identifier
          );
        }
      } catch (e) {
        console.error('Error fetching products:', e);
        // Fallback to mock products if there's an error
        if (__DEV__) {
          setPackages(MOCK_PRODUCTS);
          setSelectedPackage(ANNUAL_PACKAGE_ID);
        }
      }
    };

    fetchPackages();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setIsLoading(true);
    try {
      // In development mode, just simulate a successful purchase
      if (__DEV__) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsPremium(true);
        router.back();
        return;
      }

      const purchaseProduct = packages.find((product) => product.identifier === selectedPackage);
      if (purchaseProduct) {
        const { customerInfo } = await Purchases.purchaseStoreProduct(purchaseProduct);
        if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
          setIsPremium(true);
          router.back();
        }
      }
    } catch (e) {
      console.error('Error making purchase:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotiView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 300 }}>
      <View className="flex-1 px-6" style={{ paddingTop: 16 }}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
          className="mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full">
            <Icon name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </MotiView>

        {/* Feature Icon */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 400 }}
          className="my-6 items-center justify-center">
          <View
            className="h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: `${colors.primary}20` }}>
            <Icon name={content.iconName as any} size={48} color={colors.foreground} />
          </View>
        </MotiView>

        {/* Centered Title and Subtitle */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 100 }}
          className="mb-8 items-center self-center">
          <Text variant="title1" className="max-w-[80%] text-center font-bold" color="primary">
            {content.title}
          </Text>
          <Text variant="body" className="mt-2 text-center opacity-70" color="secondary">
            {content.subtitle}
          </Text>
        </MotiView>

        <View className="flex-1" />

        {/* Subscription Options - Smaller and closer to bottom */}
        <View className="mb-4">
          {packages.map((product, index) => {
            const isAnnual = product.identifier === ANNUAL_PACKAGE_ID;
            const isSelected = selectedPackage === product.identifier;

            return (
              <MotiPressable
                key={product.identifier}
                onPress={() => setSelectedPackage(product.identifier)}>
                <MotiView
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 300, delay: 200 + index * 100 }}
                  className="mb-3 overflow-hidden rounded-xl p-4"
                  style={{
                    backgroundColor: colors.card,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : 'transparent',
                  }}>
                  <View className="flex-row items-center justify-between">
                    <Text variant="callout" className="font-semibold" color="primary">
                      {isAnnual ? t('paywall.plans.annual') : t('paywall.plans.monthly')}
                    </Text>
                    <Text variant="callout" className="font-bold" color="primary">
                      {product.priceString}
                    </Text>
                  </View>

                  <View className="mt-1 flex-row items-center justify-between">
                    <Text variant="footnote" color="tertiary" className="opacity-70">
                      {isAnnual
                        ? `${product.priceString}${t('paywall.plans.perYear')}`
                        : `${product.priceString}${t('paywall.plans.perMonth')}`}
                    </Text>

                    {isAnnual && (
                      <View
                        className="rounded-full px-2 py-0.5"
                        style={{ backgroundColor: `${colors.primary}20` }}>
                        <Text variant="caption2" className="font-bold" color="primary">
                          {t('paywall.plans.discount', { discount: ANNUAL_DISCOUNT })}
                        </Text>
                      </View>
                    )}
                  </View>
                </MotiView>
              </MotiPressable>
            );
          })}
        </View>
      </View>

      {/* Subscribe Button */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300, delay: 400 }}
        className="px-6 pb-6"
        style={{ paddingBottom: bottom + 16 }}>
        <MotiPressable onPress={handlePurchase} disabled={!selectedPackage || isLoading}>
          <View
            className="h-12 items-center justify-center rounded-full"
            style={{
              backgroundColor: selectedPackage ? colors.primary : colors.grey3,
            }}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Text variant="callout" className="font-bold" style={{ color: colors.background }}>
                {t('paywall.subscribe')}
              </Text>
            )}
          </View>
        </MotiPressable>
      </MotiView>
    </MotiView>
  );
}
