import {useAnimatedStyle, useSharedValue, withRepeat, withTiming} from "react-native-reanimated";
import {useEffect} from "react";

/**
 * Returns objects to play pulse animation
 * @param numPulses number of pulses, -1 for infinite
 */
export function usePulseAnimation(numPulses: number = -1) {
  const scale = useSharedValue(1);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  function playPulse() {
    scale.value = withRepeat(withTiming(1.05, {duration: 500}), numPulses, true);
  }

  function stopPulse() {
    scale.value = 1;
  }

  useEffect(() => {
    playPulse();
  }, []);

  return {pulseStyle, playPulse, stopPulse};
}