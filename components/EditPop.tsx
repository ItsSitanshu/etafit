import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

interface EditPopProps {
  title: string;
  current: string;
  onPress: () => void;
}


const EditPop: React.FC<EditPopProps> = ({ title, current, onPress }) => {
  return (
    <TouchableOpacity 
    style={styles.editSection} 
    onPress={onPress}
    >
    <View>
      <Text style={styles.editTitle}>{title}</Text>
      <Text style={styles.editContent}>{current}</Text>
    </View>
    <Image source={require('@/assets/images/right_caret.png')} style={styles.editCaret} resizeMode="contain" />
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  editSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4*vw,
    paddingVertical: 2*vw,
    backgroundColor: Colors.black,
  },
  editTitle: {
    fontFamily: 'Nuinto',
    fontSize: 15,
    color: Colors.lightAccent
  },
  editContent: {
    fontFamily: 'Nuinto',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white
  },
  editCaret: {
    height: 2*vh,
    width: 2*vh,
    margin: 0,
    padding: 0,
  },
});


export default EditPop;
