import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router'; 

import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';
import Logo from '@/components/Logo';
import TitledInputBox from '@/components/TitledInputBox';
import RoundEdgeButton from '@/components/RoundEdgeButton';
import GifLoading from '@/components/GifLoading';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProtected } from '@/hooks/API';

export default function PrivateProfile() {
  const router = useRouter();

  const [Username, SetUsername] = useState<string>("");
  const [remember, onchangeremember] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
    
  const [curUser, setCurUser] = useState<string | null>("");
  const [userData, setUserData] = useState<any>();

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchCurUser = async () => {
      try {
        const curUser_n = await AsyncStorage.getItem('curUser');
        const response = await fetchProtected('api/fetch/', 'POST', 
          JSON.stringify({
            username: curUser_n,
          })
        );

        setCurUser(curUser_n);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching curUser:');
      }
    };
  
    fetchCurUser();
  }, []); 

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: Colors.darkBackground + "FF", padding: 0 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={2}
    >
    <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: 'transparent'}} bounces={false}>
    <View style={styles.page}>
      <View style={styles.logo}>
        <Logo width={50 * vw} />
      </View>

      <Text style={{color: 'white', fontSize: 50}}>
        {userData.username}
      </Text>
    <GifLoading visible={loading} close={() => {}}/>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    height: 100*vh,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bg,
  },
  logo: {
    height: 37 * vh,
    width: '100%',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    justifyContent: 'center',
  },
  outer: {
    backgroundColor: Colors.darkBackground + 'CC',
    height: 50   * vh,
    width: '100%',
    borderTopLeftRadius: 15 * vw,
    borderTopRightRadius: 15 * vw,
    display: 'flex',
    alignItems: 'center',
  },
  head: {
    marginTop: 25,
    padding: 0,
    fontFamily: 'NuintoEBold',
    textAlign: 'center',
    color: Colors.white,
    fontSize: 30,
    width: 90 * vw,
  },
  inner: {
    marginTop: 15,
    height: (70 - 3) * vh,
    width: '100%',
    borderTopLeftRadius: 15 * vw,
    borderTopRightRadius: 15 * vw,
    backgroundColor: Colors.accent + 'FF',
    display: 'flex',
    alignItems: 'center',
  },
  bottom: {
    width: 100 * vw,
    height: 10 * vh,
    backgroundColor: Colors.bg,
    display: 'flex',
    borderTopLeftRadius: 15 * vw,
    borderTopRightRadius: 15 * vw,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  bottomimg: {
    paddingLeft: 80,
    width: 52,
    height: 52,
  },
  remember: {
    width: 90 * vw,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  opt: {
    marginTop: 10,
    padding: 0,
    fontFamily: 'Nuinto',
    fontWeight: 'light',
    textAlign: 'center',
    color: Colors.white,
    width: 80 * vw,
  },
  opt2: {
    fontFamily: 'NuintoEBold',
    color: Colors.primary,
  },
  form: {
    marginTop: 25,
    display: 'flex',
    flexDirection: 'column',
  },
  errorText: {
    fontFamily: 'NuintoEBold',
    color: Colors.primary,
    padding: 0,
    margin: 0,
    width: 90*vw,
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 2
  },
});
