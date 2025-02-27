import Share, { ShareSingleOptions, Social } from 'react-native-share';

const FACEBOOK_APP_ID = '624459493439101';

interface ShareToInstagramProps {
  backgroundUri: string;
  stickerUri: string;
  isVideo: boolean;
}

export const handleShareToInstagram = async ({
  backgroundUri,
  stickerUri,
  isVideo,
}: ShareToInstagramProps) => {
  try {
    const shareOptions: ShareSingleOptions = {
      stickerImage: stickerUri,
      backgroundBottomColor: 'rgb(0, 0, 0)',
      backgroundTopColor: 'rgb(139, 144, 160)',
      appId: FACEBOOK_APP_ID,
      attributionURL: 'https://fitstories-drab.vercel.app/',
      social: Social.InstagramStories,
    };

    if (isVideo) {
      shareOptions.backgroundVideo = backgroundUri;
    } else {
      shareOptions.backgroundImage = backgroundUri;
    }

    await Share.shareSingle(shareOptions);
  } catch (error) {
    console.error('Error in handleShareToInstagram:', error);
  }
};
