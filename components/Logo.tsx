import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ASPECT_RATIO = 1783.62 / 1650.51;

type LogoProps = {
  width?: number;
  height?: number;
};

const Logo: React.FC<LogoProps> = ({ width, height}) => {
  if (width) {
    height = width / ASPECT_RATIO;
  }

  if (height) {
    width = height * ASPECT_RATIO;
  }

  return (
    <Image source={require('@/assets/images/logo.png')} style={[{ width, height }]} resizeMode="contain" />
  );
};


export default Logo;
