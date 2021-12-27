import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import entities from './entities/index';
import Physics from './physics';
import {SqueezeContext} from '../contexts/SqueezeContext';

export default function FlappyGame() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);

  const {onChangeGameRunning} = useContext(SqueezeContext);

  useEffect(() => {
    setRunning(false);
  }, []);

  const styles = StyleSheet.create({
    view_container: {
      flex: 1,
    },
    game_engine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    points: {
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      margin: 20,
    },
    start_container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    start_button: {
      backgroundColor: 'black',
      paddingHorizontal: 30,
      paddingVertical: 10,
    },
    start_button_text: {
      fontWeight: 'bold',
      color: 'white',
      fontSize: 30,
    },
  });

  return (
    <View style={styles.view_container}>
      <Text style={styles.points}>{currentPoints}</Text>
      <GameEngine
        ref={ref => {
          setGameEngine(ref);
        }}
        systems={[Physics]}
        entities={entities()}
        running={running}
        onEvent={e => {
          switch (e.type) {
            case 'game_over':
              setRunning(false);
              onChangeGameRunning(false);
              gameEngine.stop();
              break;
            case 'new_point':
              setCurrentPoints(currentPoints + 1);
              break;
          }
        }}
        style={styles.game_engine}
      />

      {!running ? (
        <View style={styles.start_container}>
          <TouchableOpacity
            style={styles.start_button}
            onPress={() => {
              setCurrentPoints(0);
              setRunning(true);
              onChangeGameRunning(true);
              gameEngine.swap(entities());
            }}>
            <Text style={styles.start_button_text}>START GAME</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
