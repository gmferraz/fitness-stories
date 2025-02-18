import { TFunction } from 'i18next';
import { SportType } from '../types/activity';

export const translateSportType = (t: TFunction, type: SportType): string => {
  return t(`sportTypes.${type}`);
};
