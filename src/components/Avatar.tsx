import {StyleSheet, Text, View, ViewStyle} from "react-native";
import {Image} from "expo-image";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";

interface Props {
  imagePath: string | number,
  name: string,
  text: string | undefined,
  style?: ViewStyle | ViewStyle[],
}

export default function Avatar({imagePath, name, text, style}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarContainer}>
        <Image source={imagePath} style={styles.profileImage}/>
        <Text style={styles.name}>{name}</Text>
      </View>
      {text &&
        <View style={styles.textBackground}>
          <Text style={styles.text}>{text}</Text>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "2%"
  },
  profileImage: {
    width: "15%",
    aspectRatio: 1,
    borderRadius: 1000000,
  },
  name: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.robotoMedium,
    marginHorizontal: "2%",
  },
  textBackground: {
    backgroundColor: Colour.skyBlue,
    borderRadius: BorderRadius.medium,
    borderTopLeftRadius: 0,
  },
  text: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.robotoMedium,
    color: Colour.black,
    padding: "5%",
  },
});
