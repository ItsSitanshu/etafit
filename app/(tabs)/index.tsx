import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { vw, vh } from '@/constants/Window';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import RoundEdgeButton from '@/components/RoundEdgeButton';


export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<null | any>(null);

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: Colors.darkBackground + "FF", padding: 0 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={2}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'transparent' }} bounces={false}>
        <View style={styles.page}>
          <View style={styles.headerContainer}>
            <Text style={styles.nav}>HOME</Text>
            <Image
              source={{ uri: userData?.pfp }}
              style={styles.profileimg}
              resizeMode="cover"
            />
            <RoundEdgeButton title='LOGIN' onPress={() => router.push('/(tabs)/login')}></RoundEdgeButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 100 * vh,
    backgroundColor: Colors.bg,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 7*vh,
    paddingHorizontal: 4*vh,
    marginTop: 6 * vh,
    justifyContent: 'space-between'
  },
  profileimg: {
    height: 5.5* vh,
    width: 5.5* vh,
    borderRadius: 3 * vh,
  },
  nav: {
    fontFamily: 'Nuinto',
    color: Colors.white,
    fontSize: 3*vh,
    textAlign: 'left',
  },
  placeholderText: {
    color: Colors.white,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.darkBackground,
  },
});
