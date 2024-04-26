import {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {useEffect} from "react";

/**
 * Returns objects to play carousel animation
 * @param xValue the value to translate the carousel by
 */
export function useCarouselAnimation(xValue: number) {
  const translateX = useSharedValue(xValue);
  const carouselStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  function playPrevious() {
    translateX.value = -xValue;
    translateX.value = withSpring(0, {damping: 10, stiffness: 70});
  }

  function playNext() {
    translateX.value = xValue;
    translateX.value = withSpring(0, {damping: 10, stiffness: 70});
  }

  useEffect(() => {
    playNext();
  }, []);

  return {carouselStyle, playPrevious, playNext};
}
