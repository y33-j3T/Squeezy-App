import React, {useState, useContext} from 'react';
import {SafeAreaView, StyleSheet, Text, View, TextInput} from 'react-native';
import tailwind, {getColor} from 'tailwind-rn';
import Icon, {Icons} from '../components/Icons';
import {SqueezeContext} from '../contexts/SqueezeContext';

export default function Account() {
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

  const {squeezeCount} = useContext(SqueezeContext);

  return (
    <SafeAreaView
      style={tailwind(
        'h-full w-full bg-blue-200 items-start justify-start flex p-6 flex',
      )}>
      <TextField header="Squeezy's Name" />
      <InfoField header="Squeeze Count" info={squeezeCount} />
    </SafeAreaView>
  );
}

const TextField = ({header}) => {
  const {squeezyName, onChangeSqueezyName} = useContext(SqueezeContext);
  const [editable, setEditable] = useState(false);

  return (
    <View style={tailwind('bg-gray-50 p-2 rounded-xl w-full my-2')}>
      <View style={tailwind('flex flex-row justify-between')}>
        <Text style={tailwind('text-gray-600 font-medium')}>{header}</Text>
        <View onTouchEnd={() => setEditable(!editable)}>
          <Icon
            size={18}
            type={Icons.Feather}
            name="edit"
            color={getColor('blue-400')}
          />
        </View>
      </View>
      <TextInput
        style={
          editable
            ? tailwind('text-blue-500 h-12 border border-blue-400')
            : tailwind('text-blue-500 h-12')
        }
        onChangeText={onChangeSqueezyName}
        value={squeezyName}
        keyboardType="default"
        onSubmitEditing={() => setEditable(!editable)}
        editable={editable}
      />
    </View>
  );
};

const InfoField = ({header, info}) => {
  return (
    <View style={tailwind('bg-gray-50 p-2 rounded-xl w-full my-2')}>
      <Text style={tailwind('text-gray-600 font-medium')}>{header}</Text>
      <TextInput editable={false} style={tailwind('h-12 text-blue-500')}>
        {info}
      </TextInput>
    </View>
  );
};
