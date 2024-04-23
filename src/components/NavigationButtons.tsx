import {Text, TouchableOpacity, View, ViewStyle} from "react-native";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";
import {StyleSheet} from "react-native";

interface Props {
  leftDisabled?: boolean;
  rightDisabled?: boolean;
  leftText?: string;
  rightText?: string;
  onLeftPress: () => void;
  onRightPress: () => void;
  style?: ViewStyle | ViewStyle[];
}

export default function NavigationButtons(
  {
    leftDisabled = false,
    rightDisabled = false,
    leftText="Back",
    rightText="Next",
    onLeftPress,
    onRightPress,
    style,
  }: Props) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, styles.left, leftDisabled && styles.disabled]}
        disabled={leftDisabled}
        onPress={onLeftPress}
      >
        <Text style={[styles.text, styles.leftText]}>{leftText}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.right, rightDisabled && styles.disabled]}
        disabled={rightDisabled}
        onPress={onRightPress}
      >
        <Text style={[styles.text, styles.rightText]}>{rightText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    paddingHorizontal: "12%",
    paddingVertical: "4%",
    marginHorizontal: "10%",
    borderRadius: BorderRadius.large,
  },
  text: {
    fontFamily: FontFamily.gothicA1Bold,
    fontSize: FontSize.small,
  },
  disabled: {
    opacity: 0.5,
  },
  left: {
    backgroundColor: Colour.lightGray,
  },
  leftText: {
    color: Colour.gray,
  },
  right: {
    backgroundColor: Colour.main,
  },
  rightText: {
    color: Colour.white,
  },
});
