import * as StoreReview from 'expo-store-review';
import { MMKV } from 'react-native-mmkv'; // Correct import for MMKV

export const appReviewStorage = new MMKV(); // Initialize MMKV storage

export function hasRequestedReview() {
  return appReviewStorage.getBoolean('hasRequestedReview') || false; // Check storage for review request status
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
    appReviewStorage.set('hasRequestedReview', true); // Store review request status
  }
}
