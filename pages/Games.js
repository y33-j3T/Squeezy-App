import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import tailwind from 'tailwind-rn';

export default function Games() {
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
    header_text: {
      ...tailwind('text-black font-medium text-4xl'),
    },
  });

  return (
    <SafeAreaView style={tailwind('h-full bg-blue-200 p-6')}>
      <View style={tailwind('')}>
        <Text style={styles.header_text}>Games</Text>
      </View>
      <View>
        <Text>Games</Text>
      </View>
    </SafeAreaView>
  );
}
