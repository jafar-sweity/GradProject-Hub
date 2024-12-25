import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAccessToken = async () => {
  return await AsyncStorage.getItem("accessToken");
};

export const setTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.setItem("accessToken", accessToken);
};

export const deleteTokens = async () => {
  await AsyncStorage.removeItem("accessToken");
};
