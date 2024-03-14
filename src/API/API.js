import { getQueryURL } from '../assets/utils/getQueryURL';
import useRequest from './useRequest';
import {
  rollingTeamInstance,
  rollingInstance,
  imgurInstance,
} from './APIInstance';

export const getMessageCardData = async (
  userID,
  limit = null,
  offset = null,
) => {
  const queryURL = getQueryURL(limit, offset);
  try {
    const response = await rollingTeamInstance.get(
      `/recipients/${userID}/messages/${queryURL}`,
    );
    const data = response.data.results;
    const count = response.data.count;
    return { data, count, error: null };
  } catch (error) {
    return { data: null, count: null, error: error };
  }
};

export const deleteMessageCardData = async (CardID) => {
  try {
    await rollingTeamInstance.delete(`/messages/${CardID}/`);
    return { error: null };
  } catch (error) {
    return { error: error };
  }
};

export const getRecipientData = async (userID) => {
  try {
    const { data } = await rollingTeamInstance.get(`/recipients/${userID}/`);
    const {
      name,
      backgroundColor,
      backgroundImageURL,
      messageCount,
      recentMessages,
      reactionCount,
      topReactions,
    } = data;
    return {
      name,
      backgroundColor,
      backgroundImageURL,
      messageCount,
      recentMessages,
      reactionCount,
      topReactions,
      error: null,
    };
  } catch (error) {
    return { error: error };
  }
};

export const deleteRecipient = async (userID) => {
  try {
    await rollingTeamInstance.delete(`/recipients/${userID}/`);
    return { error: null };
  } catch (error) {
    return { error: error };
  }
};

// --- List Page ---

function getRecipientsData() {
  const {
    data: getRecentPaperData,
    isLoading: isLoadingRecent,
    statusCode: status,
    error,
  } = useRequest({
    options: {
      url: 'recipients/',
      method: 'get',
    },
  });

  const { data: getPopularPaperData, isLoading: isLoadingPopular } = useRequest(
    {
      options: {
        url: 'recipients/',
        method: 'get',
        params: {
          sort: 'like',
        },
      },
    },
  );
  return {
    getPopularPaperData,
    isLoadingPopular,
    getRecentPaperData,
    isLoadingRecent,
    status,
    error,
  };
}
export default getRecipientsData;

// --- subheader
export const getEmojiData = async (userID) => {
  try {
    const response = await rollingTeamInstance.get(
      `/recipients/${userID}/reactions/`,
    );
    const { results } = response.data;

    return {
      results,
      error: null,
    };
  } catch (error) {
    return { error: error };
  }
};

export const postEmoji = async (userID, emoji) => {
  try {
    const data = {
      emoji: emoji,
      type: 'increase',
    };
    const response = await rollingTeamInstance.post(
      `/recipients/${userID}/reactions/`,
      data,
    );
    return response;
  } catch (error) {
    return { error: error };
  }
};

// --- postMessage
export const getImgUrl = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await imgurInstance.post('', formData);
    return response.data.data.link;
  } catch (error) {
    return { error: error };
  }
};
export const getProfileImages = async () => {
  try {
    const response = await rollingInstance.get(`/profile-images/`);
    return response.data.imageUrls;
  } catch (error) {
    return { error: error };
  }
};

export const postMessage = async (data) => {
  try {
    await rollingTeamInstance.post(
      `/recipients/${data.recipientId}/messages/`,
      data,
    );
    return true;
  } catch (error) {
    return { error: error };
  }
};

// --- Post Page

export const getBackgroundImages = async () => {
  try {
    const response = await rollingInstance.get('/background-images/');
    const src = response.data.imageUrls;
    return { src, error: null };
  } catch (error) {
    return { src: null, error: error };
  }
};

export const postDataToRecipient = async (postData) => {
  try {
    const response = await rollingTeamInstance.post(`/recipients/`, postData);
    const idData = response.data.id;
    return { idData, error: null };
  } catch (error) {
    return { idData: null, error: error };
  }
};
