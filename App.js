import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import BottomTab from './components/BottomTab';
import {SqueezeContext} from './contexts/SqueezeContext';

const App = () => {
  const [squeezyName, onChangeSqueezyName] = useState('Squeezy');
  const [squeezeCount, onChangeSqueeze] = useState(0);

  return (
    <NavigationContainer>
      <SqueezeContext.Provider
        value={{squeezyName, onChangeSqueezyName, squeezeCount}}>
        <BottomTab />
      </SqueezeContext.Provider>
    </NavigationContainer>
  );
};

export default App;
