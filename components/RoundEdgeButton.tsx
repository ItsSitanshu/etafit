import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

interface RoundEdgeButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
}

const RoundEdgeButton: React.FC<RoundEdgeButtonProps> = ({ title, onPress, backgroundColor = Colors.bg, textColor = Colors.white }) => {
  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: backgroundColor }]} onPress={onPress}>
      <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 60 * vw,
    height: 7 * vh,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  btnText: {
    padding: 0,
    textAlign: 'center',
    fontFamily: 'NuintoEBold',
    fontSize: 16, 
  },
});

export default RoundEdgeButton;
