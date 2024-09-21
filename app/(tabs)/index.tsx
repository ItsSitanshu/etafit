import { Image, StyleSheet, View, Text, Dimensions } from 'react-native';

import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

import Logo from '@/components/Logo';

export default function HomeScreen() {
  return (
    <View style={styles.page}>
    <View style={styles.logo}>
      <Logo width={40*vw}/>
    </View>

    <View style={styles.outer}>
      <Text>Create New Account</Text>
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    height: 40 * vh,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.accent + "CC",
    height: 60 * vh,
    width: '100%',
    
    borderTopLeftRadius: 15*vw,
    borderTopRightRadius: 15*vw,
  },
});