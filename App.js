import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import BottomTab from './components/BottomTab';
import {SqueezeContext} from './contexts/SqueezeContext';

const App = () => {
  const [squeezyName, onChangeSqueezyName] = useState('Bob');
  const [squeezeCount, onChangeSqueeze] = useState(100);

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
