import * as StoreReview from 'expo-store-review';
import { MMKV } from 'react-native-mmkv'; // Correct import for MMKV

export const appReviewStorage = new MMKV(); // Initialize MMKV storage

const HAS_REQUESTED_REVIEW_KEY = 'hasRequestedReview';
const SHOULD_SHOW_REVIEW_ON_NEXT_OPEN_KEY = 'shouldShowReviewOnNextOpen';

export function hasRequestedReview() {
  return appReviewStorage.getBoolean(HAS_REQUESTED_REVIEW_KEY) || false; // Check storage for review request status
}

export function setShouldShowReviewOnNextOpen() {
  appReviewStorage.set(SHOULD_SHOW_REVIEW_ON_NEXT_OPEN_KEY, true);
}

export function shouldShowReviewOnNextOpen() {
  return appReviewStorage.getBoolean(SHOULD_SHOW_REVIEW_ON_NEXT_OPEN_KEY) || false;
}

export function clearShouldShowReviewOnNextOpen() {
  appReviewStorage.set(SHOULD_SHOW_REVIEW_ON_NEXT_OPEN_KEY, false);
}

export async function showRequestReview() {
  // Make function exportable
  if (hasRequestedReview()) return; // Use helper function
  try {
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview();
    }
  } catch (error) {
    console.log(
      'FOR ANDROID: Make sure you meet all conditions to be able to test and use it: https://developer.android.com/guide/playcore/in-app-review/test#troubleshooting',
      error
    );
  } finally {
    appReviewStorage.set(HAS_REQUESTED_REVIEW_KEY, true); // Store review request status
  }
}
