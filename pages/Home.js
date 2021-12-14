import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import tailwind from 'tailwind-rn';

export default function Home() {
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
        <Text style={tailwind('text-3xl text-blue-500 my-2')}>
          Hi, I'm squeezy!
        </Text>
        <TouchableHighlight
          style={tailwind(
            'my-4 w-48 h-36 rounded-full bg-blue-300 justify-center items-center py-2 my-8',
          )}
          onPress={() => alert('SQUEEZE!')}>
          <Text> squeezy </Text>
        </TouchableHighlight>
      </View>
      <View style={styles.info_view}>
        <View style={styles.info}>
          <Info header="Squeeze Count" footer="1000" />
          <Info header="Mood" footer="Great!" />
        </View>
        <View style={styles.info}>
          <Info header="Header" footer="Footer" />
          <Info header="Header" footer="Footer" />
        </View>
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
