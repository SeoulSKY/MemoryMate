import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

/**
 * Returns objects to play shake animation
 * @param numShakes - number of shakes
 */
export function useShakeAnimation(numShakes: number = 5) {
  const offset = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  function playShake() {
    const OFFSET = 5;
    const TIME = 100;

    offset.value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), numShakes, true),
      withTiming(0, { duration: TIME / 2 })
    );
  }

  return {shakeStyle, playShake};
}
