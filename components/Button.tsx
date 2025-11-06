import {  Text, Pressable } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
}

export const Button = ({ onPress, title }: ButtonProps) => (
  <Pressable
    onPress={onPress}
    className="bg-blue-500 px-4 py-3 rounded-lg justify-center"
  >
    <Text className="text-white font-semibold text-center">{title}</Text>
  </Pressable>
);
