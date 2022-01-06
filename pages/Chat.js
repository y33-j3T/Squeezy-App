import React, {Component, useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Keyboard} from 'react-native';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {GiftedChat} from 'react-native-gifted-chat';
import tailwind from 'tailwind-rn';
import {dialogflowConfig} from '../env';

export default function Chat() {
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const styles = StyleSheet.create({
    chat_room: {
      ...tailwind('h-full w-full bg-blue-200 text-black'),
    },
    chat_area: {
      ...tailwind('h-full w-full bg-blue-200 text-black'),
      height: keyboardStatus ? '100%' : '85%',
    },
  });

  return (
    <SafeAreaView style={styles.chat_room}>
      <SafeAreaView style={styles.chat_area}>
        <ChatBot />
      </SafeAreaView>
    </SafeAreaView>
  );
}

const BOT_USER = {
  _id: 2,
  name: 'Squeezy Companion',
  avatar: 'https://i.imgur.com/7k12EPD.png',
};

class ChatBot extends Component {
  state = {
    messages: [
      {
        _id: 1,
        text: `Hi! I am your Squeezy Companion! Let's play!`,
        createdAt: new Date(),
        user: BOT_USER,
      },
    ],
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}
