import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Markdown from 'react-native-markdown-display';

export const CollapsibleSection = ({ title, content }: { title: string; content: string }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View className="mb-3 bg-white rounded-2xl p-3 shadow">
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <Text className="font-bold text-lg mb-2">{title}</Text>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <Markdown>{content}</Markdown>
      </Collapsible>
    </View>
  );
};
