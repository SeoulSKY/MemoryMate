import {BorderRadius, Colour} from "../constants";
import {StyleSheet, View} from "react-native";
import {InvalidArgumentError} from "../utils/error";

interface Props {
  progress: number;
  total: number;
}

export default function DiscreteProgressBar({progress, total}: Props) {
  if (progress < 0) {
    throw new InvalidArgumentError("Progress cannot be less than 0");
  }
  if (total <= 0) {
    throw new InvalidArgumentError("Total must be greater than 0");
  }
  if (progress > total) {
    throw new InvalidArgumentError("Progress cannot be greater than total");
  }

  return (
    <View style={styles.container}>
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "10%"
  },
  bar: {
    height: "1%",
    borderRadius: BorderRadius.medium,
    marginHorizontal: "2%"
  },
  active: {
    backgroundColor: Colour.main,
  },
  inactive: {
    backgroundColor: Colour.gray,
  },
});