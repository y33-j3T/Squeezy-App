import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native';
import tailwind from 'tailwind-rn';
import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';

export default function Chat() {
  const styles = StyleSheet.create({
    info_view: {
      flexDirection: 'column',
      ...tailwind('h-1/2 items-center bg-pink-100 w-full py-6'),
    },
    info: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-evenly',
    },
    chat_room: {
      ...tailwind('h-full w-full bg-blue-200'),
    },
    chat_area: {
      ...tailwind('h-full w-full bg-blue-200'),
      height: '85%',
    },
  });

  return (
    <SafeAreaView style={styles.chat_room}>
      <SafeAreaView style={styles.chat_area}>
        <Example />
      </SafeAreaView>
    </SafeAreaView>
  );
}

function Example() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hi, how are you? I'm squeezy",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}

const AiReply = () => {
  return <Text> test </Text>;
};

const UserReply = () => {
  return <Text> test </Text>;
};

const UserInput = () => {
  return <TextInput />;
};
