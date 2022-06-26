import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import Slider from '@react-native-community/slider';
export default ({ value, name, minimum, maximum, step = 1, onChange }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{name}</Text>
    <Slider
      style={styles.slider}
      value={value}
      minimumValue={minimum}
      maximumValue={maximum}
      onValueChange={onChange}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    paddingLeft: 20,
    padding:15
  },
  text: { textAlign: 'center' },
  slider: { width: 200 },
});
