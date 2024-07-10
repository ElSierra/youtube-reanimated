import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Animation } from './animation';

const App = () => {
  const [play, setPlay] = useState(false);
  const rotate = useSharedValue('0deg');
  const rotateAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: rotate.value }],
    };
  }, []);
  return (
    <View style={[styles.container]}>
      {play && <Animation />}

      <View
        style={{
          bottom: 40,
          left: 0,
          right: 0,
          width: '100%',
          position: 'absolute',

          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setPlay(false);
            cancelAnimation(rotate);
            rotate.value = withSpring('360deg', undefined, () => {
              rotate.value = '0deg';
            });

            setTimeout(() => {
              setPlay(true);
            }, 100);
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 8,
            flexDirection: 'row',

            backgroundColor: 'red',
            borderRadius: 20,
            gap: 2,
          }}>
          <Animated.View style={rotateAnimation}>
            <Ionicons name="refresh-circle-sharp" size={30} color="white" />
          </Animated.View>
          <Text style={{ color: 'white' }}>Play Animation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { App };
