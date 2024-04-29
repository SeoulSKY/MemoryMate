import {StyleSheet, Text, View, ViewStyle} from "react-native";
import {Image, ImageStyle} from "expo-image";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";

interface Props {
  imagePath: string | number,
  name: string,
  text?: string,
  style?: ViewStyle | ViewStyle[],
  imageStyle?: ImageStyle | ImageStyle[],
}

export default function Avatar({imagePath, name, text, style, imageStyle}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarContainer}>
        <Image source={imagePath} style={[styles.profileImage, imageStyle]}/>
        <Text style={styles.name}>{name}</Text>
      </View>
      {text &&
        <View style={styles.textBackground}>
          <Text style={styles.text}>{text}</Text>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    minWidth: "100%",
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
    backgroundColor: Colour.secondary,
    borderRadius: BorderRadius.medium,
    borderTopLeftRadius: 0,
    minWidth: "100%",
  },
  text: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.robotoMedium,
    color: Colour.black,
    padding: "5%",
  },
});
