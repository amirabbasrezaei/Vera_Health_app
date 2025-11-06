import React, { useState, useEffect, useRef } from "react";
import { TextInput, View, ScrollView, Text, StyleSheet } from "react-native";

import { parseStreamedText } from "../utils/parser";
import Markdown from "react-native-markdown-display";
import { CollapsibleSection } from "../components/CollapsibleSection";
import { Button } from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import EventSource from "react-native-sse";

export default function ChatScreen() {
  const [value, setValue] = useState("");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prompt) {
      return;
    }

    console.log("Starting SSE request with prompt:", prompt);
    setIsLoading(true);
    setError(null);
    setResponse("");

    const url = `https://vera-assignment-api.vercel.app/api/stream?prompt=${encodeURIComponent(
      prompt
    )}`;

    const es = new EventSource(url, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });

    es.addEventListener("message", (event) => {
      const data: any = JSON.parse(event.data || "");
      if (data === "[DONE]") {
        setIsLoading(false);
        setPrompt(null);
        es.removeAllEventListeners();
        es.close();
      } else {
        const response = typeof data.content === "string" ? data.content : "";
        setResponse((prev) => prev + response);
      }
    });
  }, [prompt]);

  const sections = parseStreamedText(response);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flexGrow: 1 }}
        // className="mb-4 h-[200px] bg-black w-full min-h-[200px]"
      >
        {isLoading && (
          <Text className="text-gray-500">Waiting for response...</Text>
        )}
        {error && <Text className="text-red-500">Error: {String(error)}</Text>}

        {sections.map((section, idx) =>
          section.type === "text" ? (
            <Markdown key={idx}>{section.content}</Markdown>
          ) : (
            <CollapsibleSection
              key={idx}
              title={
                section.type.charAt(0).toUpperCase() + section.type.slice(1)
              }
              content={section.content}
            />
          )
        )}

        {/* <Text>{response}</Text> */}
      </ScrollView>
      <View className="absolute bottom-0 gap-3">
        <TextInput
          placeholder="Ask something..."
          value={value}
          onChangeText={setValue}
          className="flex-1 border border-gray-300 p-3 rounded-lg"
        />
        <Button title="send" onPress={() => setPrompt(value)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
