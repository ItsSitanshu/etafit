import React from 'react';
import { StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

interface ABSButtonProps {
  src: ImageSourcePropType | undefined;
  onPress: () => void;
}

const ABSButton: React.FC<ABSButtonProps> = ({ src, onPress }) => {
  return (
    <TouchableOpacity style={styles.actWrap} onPress={onPress}>
      <Image 
        source={src} 
          style={styles.actImg} 
        resizeMode="contain" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actWrap: {
    position: 'absolute',
    bottom: 8*vh,
    right: 4*vw,
    padding: 0,
    width: 15*vw,
    height: 15*vw,
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6*vw,
    backgroundColor: Colors.primary,
  },
  actImg: {
    width: 8*vw,
    height: 8*vw,
    padding: 0,
    margin: 0
  },
});

export default ABSButton;
