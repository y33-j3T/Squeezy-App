import React, {useState, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Button,
} from 'react-native';
import tailwind, {getColor} from 'tailwind-rn';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FlappyGame from '../game/FlappyGame';
import {SqueezeContext} from '../contexts/SqueezeContext';

const Stack = createNativeStackNavigator();

export default function Games() {
  const [header, setHeader] = useState(false);

  const {gameRunning} = useContext(SqueezeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: getColor('pink-100')},
      }}>
      <Stack.Screen
        name="Games Page"
        component={GamesScreen}
        options={{headerShown: false, headerTransparent: true}}
      />
      <Stack.Screen
        name="Squeezy Bird"
        component={FlappyGame}
        options={{headerShown: !gameRunning}}
      />
    </Stack.Navigator>
  );
}

function GamesScreen({navigation}) {
  const styles = StyleSheet.create({
    screen_style: {
      ...tailwind('h-full bg-blue-200'),
      flex: 1,
    },
    button_style: {
      ...tailwind(
        'w-1/2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full',
      ),
      width: '50%',
    },
  });

  return (
    <SafeAreaView style={styles.screen_style}>
      <GameShowcasePanel navigation={navigation} />
    </SafeAreaView>
  );
}

function GameShowcasePanel({navigation}) {
  const styles = StyleSheet.create({
    panel_style: {
      ...tailwind('m-4 p-4 bg-white text-center items-center justify-center'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    header_style: {
      ...tailwind('text-lg p-2 text-center text-black'),
    },
    button_style: {
      ...tailwind(
        'bg-blue-500 text-white font-medium py-2 px-4 rounded-xl text-center',
      ),
    },
  });

  return (
    <View style={styles.panel_style}>
      <Text style={styles.header_style}>First test game</Text>
      <Text
        onPress={() => navigation.navigate('Squeezy Bird')}
        title="Squeezy Bird"
        style={styles.button_style}>
        Play
      </Text>
    </View>
  );
}
