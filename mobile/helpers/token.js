import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

export const storeToken = async (accessToken) => {
  await AsyncStorage.setItem("authToken", accessToken);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem("authToken");
};
