import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import tailwind from 'tailwind-rn';
import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';

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
  });

  return (
    <SafeAreaView
      style={tailwind('h-full bg-blue-200 items-center justify-center flex')}>
      <View style={tailwind('h-1/2 items-center bg-blue-100 w-full py-10')}>
        <Text>Chat</Text>
      </View>
      {/* <Button color="pink" title="click me" /> */}
    </SafeAreaView>
  );
}

const Info = ({header, footer}) => {
  return (
    <View
      style={tailwind('border-2 border-blue-300 p-2 rounded-xl w-2/5 my-2')}>
      <Text>{header}</Text>
      <Text style={tailwind('text-blue-500')}>{footer}</Text>
    </View>
  );
};
