import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

interface TitledInputBoxProps {
    title: string;
    placeholder: string;
    value: string;
    secureTextEntry?: boolean;
    onChangeText?: ((text: string) => void);
}


const TitledInputBox: React.FC<TitledInputBoxProps> = ({ title, placeholder, value, secureTextEntry, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.white}
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
      marginBottom: vh * 2,
  },
  title: {
      padding: 0,

      fontFamily: 'NuintoIEBold',
      position: 'absolute',
      zIndex: 1,
      backgroundColor: Colors.accent + "FF",
      
      top: -1.01 * vh,
      left: 5 * vw,
      paddingLeft: 3,
      paddingRight: 7,
      height: 1.5 * vh,

      textAlign: 'center',
      fontSize: 1.5 * vh,
      color: Colors.white,
  },
  input: {
      width: 90 * vw,
      height: 6 * vh, 
      
      backgroundColor: 'transparent',
      paddingLeft: 4*vw,
      textAlign: 'left',

      fontSize: 16,      
      fontFamily: 'Nuinto',
      fontWeight: 'light',
      color: Colors.white,

      borderWidth: 1,
      borderRadius: 20 ,
      borderColor: Colors.white + 'BB',
  },
});



export default TitledInputBox;
