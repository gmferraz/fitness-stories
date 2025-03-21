import { LayoutType } from './get-available-layouts';

export type LayoutEditionItems =
  | 'fontFamily'
  | 'titleFontSize'
  | 'bodyFontSize'
  | 'labelFontSize'
  | 'fontColor'
  | 'padding'
  | 'opacity'
  | 'backgroundColor'
  | 'iconColor';

export const getLayoutAvailableEdition = (layout: LayoutType): LayoutEditionItems[] => {
  const baseItems = [
    'fontFamily',
    'bodyFontSize',
    'labelFontSize',
    'fontColor',
    'padding',
    'opacity',
    'backgroundColor',
  ] as const;

  switch (layout) {
    case 'minimal':
      return [...baseItems, 'titleFontSize'];
    case 'social':
      return [...baseItems];
    case 'detailed':
      return [...baseItems, 'iconColor', 'iconColor'];
    case 'achievement':
      return [...baseItems, 'titleFontSize', 'iconColor'];
    case 'weight':
      return [...baseItems, 'titleFontSize', 'iconColor'];
    case 'hiit':
      return [...baseItems, 'titleFontSize'];
    case 'hiit2':
      return [...baseItems, 'iconColor'];
    case 'period-minimal':
      return [...baseItems, 'titleFontSize', 'iconColor'];
    case 'period-stats':
      return [...baseItems, 'titleFontSize', 'iconColor'];
    case 'period-social':
      return [...baseItems, 'titleFontSize', 'iconColor'];
    case 'strava':
      return [...baseItems, 'iconColor'];
    case 'advanced-stats':
      return [...baseItems, 'iconColor'];
    case 'aesthetic':
      return [...baseItems, 'iconColor'];
    case 'progress':
      return [...baseItems, 'titleFontSize'];
    case 'map':
      return [...baseItems, 'titleFontSize', 'iconColor'];
    case 'stats':
      return [...baseItems, 'titleFontSize', 'iconColor'];
    default:
      return [...baseItems, 'titleFontSize', 'iconColor'];
  }
};
