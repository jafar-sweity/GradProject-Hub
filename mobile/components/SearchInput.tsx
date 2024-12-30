import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput } from "react-native";

interface SearchInputProps {
  onChangeText: (text: string) => void;
  onPressIcon: () => void;
  icon: any;
  onSubmitEditing: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onChangeText,
  onPressIcon,
  icon,
  onSubmitEditing,
}) => {
  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-primary">
      <TextInput
        className="text-sm mt-0.5 text-black flex-1 font-pregular"
        placeholder="Service Search"
        placeholderTextColor="#CDCDE0"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />

      <TouchableOpacity onPress={onPressIcon}>
        <Image source={icon} className="w-6 h-6" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
