import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAccessToken = async () => {
  return await AsyncStorage.getItem("accessToken");
};
export const getRefreshToken = async () => {
  return await AsyncStorage.getItem("refreshToken");
};
export const setTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);
};

export const deleteTokens = async () => {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
};
