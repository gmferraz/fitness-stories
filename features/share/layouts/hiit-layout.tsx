import React from 'react';
import { Dimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/nativewindui/Text';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';
import { formatTime } from '~/utils/formatters';
import { Activity } from '~/features/home/types/activity';
import { languageDetector } from '~/utils/i18n/languageDetector';

interface HiitLayoutProps {
  activity: Activity;
  showBackground?: boolean;
}

export function HiitLayout({ activity, showBackground = true }: HiitLayoutProps) {
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles.hiit.isEdited ? styles.hiit : DEFAULT_LAYOUT_STYLES.hiit;
  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);
  const width = Dimensions.get('window').width;
  const language = languageDetector.detect();

  return (
    <View
      className="flex-col self-center rounded-2xl p-4"
      style={{
        width: width - 48,
        backgroundColor: showBackground ? bgColor : 'transparent',
      }}>
      <Text
        style={{
          fontFamily: style.fontFamily,
          color: textColor,
          fontSize: style.labelSize,
          lineHeight: style.labelSize * 1.2,
        }}>
        {new Date().toLocaleDateString(language, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
      <Text
        numberOfLines={2}
        className="mb-6 mt-2 font-bold"
        style={{
          fontSize: style.titleSize,
          fontFamily: style.fontFamily,
          lineHeight: style.titleSize * 1.2,
          color: textColor,
        }}>
        {formatTime(activity.moving_time)}
      </Text>

      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text
            className="mb-1"
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.labelSize,
              lineHeight: style.labelSize * 1.2,
            }}>
            {t('share.layouts.common.calories')}
          </Text>
          <Text
            className="font-bold"
            style={{
              fontSize: style.bodySize,
              fontFamily: style.fontFamily,
              lineHeight: style.bodySize * 1.2,
              color: textColor,
            }}>
            {activity.calories}
          </Text>
        </View>
        {!!activity.average_heartrate && (
          <View className="ml-3 flex-1">
            <Text
              className="mb-1"
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.labelSize,
                lineHeight: style.labelSize * 1.2,
              }}>
              {t('share.layouts.common.heartRate')}
            </Text>
            <Text
              className="font-bold"
              style={{
                fontSize: style.bodySize,
                fontFamily: style.fontFamily,
                lineHeight: style.bodySize * 1.2,
                color: textColor,
              }}>
              {activity.average_heartrate}{' '}
              <Text
                style={{
                  fontSize: style.labelSize,
                  fontFamily: style.fontFamily,
                  lineHeight: style.labelSize * 1.2,
                  color: textColor,
                }}
                variant="caption2">
                bpm
              </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
