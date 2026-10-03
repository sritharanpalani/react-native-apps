import Button from '@/components/button';
import CircleButton from '@/components/circle-button';
import EmojiList from '@/components/emoji-list';
import EmojiPicker from '@/components/emoji-picker';
import EmojiSticker from '@/components/emoji-sticker';
import IconButton from '@/components/icon-button';
import ImageViewer from '@/components/image-viewer';
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';


const PlaceHolderImage = require('@/assets/images/background-image.png');

export default function Index() {

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptins, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined > (undefined); 
  const [permissionResponse, requestPermission ] = ImagePicker.useMediaLibraryPermissions();
  const imageRef = useRef<View>(null);


  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, []);


  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

     if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
     }else {
      alert('you did not select any image.') 
     }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync =  async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1, 
      });

      const savePath = await MediaLibrary.Asset.create(localUri);

      if(localUri){
        alert('saved');
      } 
      
    } catch (e) {
        console.log(e);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
        <ImageViewer imgSource={PlaceHolderImage} selectedImage={selectedImage} />
        { pickedEmoji && <EmojiSticker  imageSize={40} stickerSource={pickedEmoji}/>}
        </View>
      </View>
      {
        showAppOptins ? ( 
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon='refresh' label='Reset' onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon='save-alt' label='Save' onPress={onSaveImageAsync}/>
            </View>
          </View>
        ) : (
            <View style={styles.footerContainer}>
              <Button 
              theme="primary"
              label='Choose a photo'
              onPress={pickImageAsync}/>
              <Button   
                label='use this photo' 
                onPress={() => setShowAppOptions(true)}
              />
            </View> 
            )
      }
      
        <EmojiPicker  isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor:'#25292e',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
