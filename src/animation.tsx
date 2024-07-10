import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesome6 } from '@expo/vector-icons';

const Animation = () => {
  const { width: screenWidth } = useWindowDimensions();
  console.log('🚀 ~ file: index.tsx:23 ~ App ~ screenWidth:', screenWidth);

  const width = useSharedValue(0);
  const opacityInitalBar = useSharedValue(1);
  const translateX = useSharedValue(0);

  const OpacityForBar = useSharedValue(1);
  const innerRedWidth = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const stylesForBar = useAnimatedStyle(() => {
    return {
      width: width.value,
      backgroundColor: interpolateColor(
        width.value,
        [0, screenWidth / 2],
        ['green', 'red'],
      ),
      opacity: opacityInitalBar.value,
    };
  });

  useAnimatedReaction(
    () => {
      return width;
    },
    prev => {
      prev.value = withTiming(
        screenWidth / 2,
        { duration: 5000 },
        (finished, current) => {
          console.log(finished);
          if (finished) {
            opacityInitalBar.value = withTiming(0);
          }
        },
      );
    },
    [opacityInitalBar.value],
  );

  const opacityForPlayBar = useDerivedValue(() => {
    if (width.value === screenWidth / 2) {
      return withTiming(1);
    }
    return withTiming(0);
  }, []);

  useAnimatedReaction(
    () => {
      return opacityForPlayBar;
    },
    () => {
      if (opacityForPlayBar.value === 1) {
        innerRedWidth.value = withTiming(screenWidth / 1.5);
        scaleX.value = withTiming(1.2);
      }
    },
  );

  const forPlayerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: opacityForPlayBar.value,
        },
        { scaleX: scaleX.value },
      ],
    };
  }, [OpacityForBar.value]);

  const forInnerPlayerStyle = useAnimatedStyle(() => {
    return {
      width: innerRedWidth.value,
    };
  }, []);

  useAnimatedReaction(
    () => innerRedWidth.value,
    curr => {
      console.log('ccurr', curr);
      if (curr === screenWidth / 1.5) {
        console.log('true');
        OpacityForBar.value = withTiming(0, { duration: 1000 }, () => {
          console.log('done');
          translateX.value = withTiming(screenWidth / 2 - 68);
        });
      }
    },
  );

  const animStyleForRedWrapper = useAnimatedStyle(() => {
    return {
      opacity: OpacityForBar.value,
    };
  });

  const animIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const redBox = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [0, screenWidth / 2 - 68],
            [-100, screenWidth / 2 - 10],
          ),
        },
      ],
    };
  });

  return (
    <View style={[styles.container]}>
      <StatusBar style="light" />

      <View
        style={{
          width: screenWidth / 1.5 + 24,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              backgroundColor: 'red',
              height: 80,
              width: 100,
              left: -100,
              borderRadius: 20,
            },
            redBox,
          ]}
        />
        <Animated.View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 4,
              height: 100,
            },
            forPlayerStyle,
          ]}>
          <Animated.View style={animIconStyle}>
            <FontAwesome6 name="play" size={24} color="white" />
          </Animated.View>
          <Animated.View
            style={[
              {
                width: screenWidth / 1.5,
                height: 6,
                borderRadius: 999,
                backgroundColor: '#E9E9E9',
                overflow: 'hidden',
              },
              animStyleForRedWrapper,
            ]}>
            <Animated.View
              style={[
                {
                  width: 0,
                  height: '100%',
                  backgroundColor: 'red',
                },
                forInnerPlayerStyle,
              ]}
            />
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={[
            {
              height: 6,
              marginLeft: 24,
              position: 'absolute',
              zIndex: 999,
              borderRadius: 9999,
            },
            stylesForBar,
          ]}
        />

        {/* <TouchableOpacity
            onPress={() => {
              opacityInitalBar.value = 1;
              translateX.value = 0;
  
              animation.value = false;
  
              OpacityForBar.value = 1;
              innerRedWidth.value = 0;
              scaleX.value = 1;
            }}
            style={{ position: 'absolute', bottom: 0, padding: 20 }}>
            <Ionicons name="refresh-circle-sharp" size={30} color="white" />
          </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',
  },
});

export { Animation };
