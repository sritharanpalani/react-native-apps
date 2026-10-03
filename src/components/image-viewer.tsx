import { Image } from 'expo-image';
import { ImageSourcePropType, StyleSheet } from 'react-native';

type props = {
    imgSource: ImageSourcePropType;
    selectedImage?: string;
};

export default function ImageViewer({imgSource, selectedImage} : props )  {
    const imageSource = selectedImage ? { uri: selectedImage } : imgSource;
    return <Image  source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
    image: {
    width: 320,
    height: 440,
    borderRadius: 18,
    },
});