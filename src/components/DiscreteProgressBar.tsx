import {BorderRadius, Colour} from "../constants";
import {StyleSheet, View, ViewStyle} from "react-native";

interface Props {
  progress: number;
  total: number;
  style?: ViewStyle | ViewStyle[],
}

/**
 * A progress bar that displays progress as a series of discrete blocks.
 * @param progress The number of blocks that should be filled in.
 * @param total The total number of blocks.
 * @param style Optional style overrides for the container.
 */
export default function DiscreteProgressBar({progress, total, style}: Props) {
  return (
    <View style={[styles.container, style]}>
      {Array.from({length: total}, (_, i) => (
        <View
          key={i}
          style={[styles.bar, i < progress ? styles.active : styles.inactive, {flex: 1 / total}]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "1%",
  },
  bar: {
    height: "100%",
    borderRadius: BorderRadius.medium,
    marginHorizontal: "2%"
  },
  active: {
    backgroundColor: Colour.primary,
  },
  inactive: {
    backgroundColor: Colour.gray,
  },
});
