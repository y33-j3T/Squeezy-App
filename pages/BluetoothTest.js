import {Buffer} from 'buffer';
import {stringToBytes} from 'convert-string';
import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {bytesToString} from 'convert-string';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [list, setList] = useState([]);

  const peripherals = new Map();

  const handleDiscoverPeripheral = peripheral => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  };

  const handleDisconnectedPeripheral = data => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 3, true)
        .then(results => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  };

  const handleUpdateValueForCharacteristic = data => {
    setData2(JSON.stringify(data));
    // console.log(
    //   'Received data from ' +
    //     data.peripheral +
    //     ' characteristic ' +
    //     data.characteristic,
    //   data.value,
    // );
  };

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
      if (results.length == 0) {
        console.log('No connected peripherals');
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  };

  const [data, setData] = useState({});
  const [data2, setData2] = useState('test');

  async function connectAndPrepare(peripheral, service, characteristic) {
    // Connect to device
    await BleManager.connect(peripheral);
    // Before startNotification you need to call retrieveServices
    await BleManager.retrieveServices(peripheral);
    // To enable BleManagerDidUpdateValueForCharacteristic listener
    await BleManager.startNotification(peripheral, service, characteristic);
    // Add event listener
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({value, peripheral, characteristic, service}) => {
        // Convert bytes array to string
        const data = bytesToString(value);
        setData2(data);
      },
    );
    // Actions triggereng BleManagerDidUpdateValueForCharacteristic event
  }

  const connectSqueezy = peripheral => {
    const toSend = stringToBytes('1');
    // const dataByte = convertString.UTF8.stringToBytes(toSend);

    BleManager.connect(peripheral.id).then(() => {
      setData2(peripheral);
      let p = peripherals.get(peripheral.id);
      if (p) {
        p.connected = true;
        peripherals.set(peripheral.id, p);
        setList(Array.from(peripherals.values()));
      }
      console.log('Connected to ' + peripheral.id);

      setTimeout(() => {
        /* Test read current RSSI value */

        BleManager.retrieveServices(peripheral.id).then(peripheralData => {
          setData(peripheralData);
          // BleManager.startNotification(
          //   peripheral.id,
          //   peripheral.characteristics[0].service,
          //   peripheral.characteristics[0].characteristic,
          // )
          //   .then(() => {
          //     console.log('Notification started');
          //   })
          //   .catch(error => {
          //     console.log(error);
          //   });
          BleManager.write('84:CC:A8:78:E7:12', '180A', '2A57', toSend)
            .then(() => {
              console.log('Writed: ' + data);
            })
            .catch(error => {
              console.log(error);
            });
        }, 900);
      }).catch(error => {
        console.log('Connection error', error);
      });
    });
  };

  const sendSignalSqueezy = num => {
    const toSend = stringToBytes(num);
    // const dataByte = convertString.UTF8.stringToBytes(toSend);

    BleManager.connect('84:CC:A8:78:E7:12').then(() => {
      let p = peripherals.get('84:CC:A8:78:E7:12');
      if (p) {
        p.connected = true;
        peripherals.set('84:CC:A8:78:E7:12', p);
        setList(Array.from(peripherals.values()));
      }
      console.log('Connected to ' + '84:CC:A8:78:E7:12');

      setTimeout(() => {
        /* Test read current RSSI value */

        BleManager.retrieveServices('84:CC:A8:78:E7:12').then(
          peripheralData => {
            setData(peripheralData);
            // BleManager.startNotification(
            //   peripheral.id,
            //   peripheral.characteristics[0].service,
            //   peripheral.characteristics[0].characteristic,
            // )
            //   .then(() => {
            //     console.log('Notification started');
            //   })
            //   .catch(error => {
            //     console.log(error);
            //   });
            BleManager.write('84:CC:A8:78:E7:12', '180A', '2A57', toSend)
              .then(() => {
                BleManager.read('84:CC:A8:78:E7:12', '180A', '2A57')
                  .then(readData => {
                    // const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                    // const sensorData = buffer.readUInt8(1, true);
                    setData2(readData);
                  })
                  .catch(error => {
                    // Failure code
                    setData2('nil');
                  });
              })
              .catch(error => {
                console.log(error);
              });
          },
          900,
        );
      }).catch(error => {
        console.log('Connection error', error);
      });
    });
  };

  const receiveSignalSqueezy = () => {
    // const dataByte = convertString.UTF8.stringToBytes(toSend);
    BleManager.connect('84:CC:A8:78:E7:12').then(() => {
      let p = peripherals.get('84:CC:A8:78:E7:12');
      if (p) {
        p.connected = true;
        peripherals.set('84:CC:A8:78:E7:12', p);
        setList(Array.from(peripherals.values()));
      }
      console.log('Connected to ' + '84:CC:A8:78:E7:12');

      setTimeout(() => {
        /* Test read current RSSI value */
        BleManager.retrieveServices('84:CC:A8:78:E7:12').then(
          peripheralData => {
            BleManager.read('84:CC:A8:78:E7:12', '180A', '2A57')
              .then(readData => {
                if (readData === 9) {
                  setData2(data2 + readData);
                }
              })
              .catch(error => {
                console.log(error);
              });
          },
          900,
        );
      }).catch(error => {
        console.log('Connection error', error);
      });
    });
  };

  useEffect(() => {
    BleManager.start({showAlert: false});

    connectAndPrepare('84:CC:A8:78:E7:12', '180A', '2A57');

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    // bleManagerEmitter.addListener(
    //   'BleManagerDidUpdateValueForCharacteristic',
    //   receiveSignalSqueezy,
    // );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }

    return () => {
      console.log('unmount');
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
      // bleManagerEmitter.removeListener(
      //   'BleManagerDidUpdateValueForCharacteristic',
      //   handleUpdateValueForCharacteristic,
      // );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = item => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => connectSqueezy(item)}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: '#333333',
              padding: 10,
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
            }}>
            RSSI: {item.rssi}
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
              paddingBottom: 20,
            }}>
            {item.id}
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
              paddingBottom: 20,
            }}>
            {JSON.stringify(data)}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={{margin: 10}}>
              <Button
                title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                onPress={() => startScan()}
              />
            </View>

            <View style={{margin: 10}}>
              <Button
                title="Retrieve connected peripherals"
                onPress={() => retrieveConnected()}
              />
            </View>

            <View style={{margin: 10}}>
              <Button
                title="Turn on Lights"
                onPress={() => sendSignalSqueezy('1')}
              />
            </View>

            <View style={{margin: 10}}>
              <Button
                title="Turn off Lights"
                onPress={() => sendSignalSqueezy('2')}
              />
            </View>

            <View style={{margin: 10}}>
              <Button
                title="Fast Blink"
                onPress={() => sendSignalSqueezy('3')}
              />
            </View>

            <View style={{margin: 10}}>
              <Button
                title="Slow Blink"
                onPress={() => sendSignalSqueezy('4')}
              />
            </View>

            <View style={{margin: 10}}>
              <Button
                title="Recieve Start"
                onPress={() => receiveSignalSqueezy()}
              />
            </View>

            <View style={{margin: 10}}>
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'center',
                  color: 'white',
                  padding: 2,
                  paddingBottom: 20,
                  backgroundColor: 'black',
                }}>
                {data2}
              </Text>
            </View>

            {list.length == 0 && (
              <View style={{flex: 1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            )}
          </View>
        </ScrollView>
        <FlatList
          data={list}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
// const testPeripheral = peripheral => {
//   if (peripheral) {
//     if (peripheral.connected) {
//       BleManager.disconnect(peripheral.id);
//     } else {
//       BleManager.connect(peripheral.id)
//         .then(() => {
//           let p = peripherals.get(peripheral.id);
//           if (p) {
//             p.connected = true;
//             peripherals.set(peripheral.id, p);
//             setList(Array.from(peripherals.values()));
//           }
//           console.log('Connected to ' + peripheral.id);

//           setTimeout(() => {
//             /* Test read current RSSI value */
//             BleManager.retrieveServices(peripheral.id).then(
//               peripheralData => {
//                 console.log('Retrieved peripheral services', peripheralData);

//                 BleManager.readRSSI(peripheral.id).then(rssi => {
//                   console.log('Retrieved actual RSSI value', rssi);
//                   let p = peripherals.get(peripheral.id);
//                   if (p) {
//                     p.rssi = rssi;
//                     peripherals.set(peripheral.id, p);
//                     setList(Array.from(peripherals.values()));
//                   }
//                 });
//               },
//             );
//           }, 900);
//         })
//         .catch(error => {
//           console.log('Connection error', error);
//         });
//     }
//   }
// };

// async function connectAndPrepare() {
//   // Connect to device
//   await BleManager.connect('84:CC:A8:78:E7:12');
//   // Before startNotification you need to call retrieveServices
//   await BleManager.retrieveServices('84:CC:A8:78:E7:12');
//   // To enable BleManagerDidUpdateValueForCharacteristic listener
//   await BleManager.startNotification('84:CC:A8:78:E7:12', '180A', '2A58');
//   // Add event listener
//   bleManagerEmitter.addListener(
//     'BleManagerDidUpdateValueForCharacteristic',
//     ({value, characteristic}) => {
//       // Convert bytes array to string
//       setData2(value);
//       // console.log(`Recieved ${value} for characteristic ${characteristic}`);
//     },
//   );
//   // Actions triggereng BleManagerDidUpdateValueForCharacteristic event
// }

// connectAndPrepare();
