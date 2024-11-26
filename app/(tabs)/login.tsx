import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router'; 

import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';
import Logo from '@/components/Logo';
import TitledInputBox from '@/components/TitledInputBox';
import RoundEdgeButton from '@/components/RoundEdgeButton';

import BouncyCheckbox from "react-native-bouncy-checkbox";
import GifLoading from '@/components/GifLoading';

import Cookies from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL }from 'react-native-dotenv';


function SetTimeoutAsync(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export default function HomeScreen() {
  const router = useRouter();

  const [usrname, onchangeusrname] = useState<string>("");
  const [remember, onchangeremember] = useState<boolean>(false);
  const [pwd, onchangepwd] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwdError, setPwdError] = useState("");

  const [loading, setLoading] = useState(false);

  const rememberMe = (opt: boolean) => {
    onchangeremember(opt);
  };


  const loginAccount = async () => {
    setEmailError("");
    setPwdError("");
  
    if (!usrname) {
      setEmailError("Username is required");
      return;
    }
  
    if (!pwd) {
      setPwdError("Password is required");
      return;
    }
  
    setLoading(true);
    const API = API_URL as string;
    console.log(API);
  
    try {
      const response = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          password: pwd,
          username: usrname,
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const accessToken = responseData.accessToken;
  
        await AsyncStorage.setItem('accessToken', accessToken);
        
        router.push('/(tabs)/pprofile');
      } else {
        const errorData = await response.json();
        setEmailError('Invalid credentials');
      }
    } catch (error) {
      setEmailError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

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

      <View style={styles.outer}>
        <Text style={styles.head}>Login to Your Account</Text>
        <View style={styles.inner}>
          <Text style={styles.opt}>
            Dont have an acoount? <Text style={styles.opt2} onPress={() => router.push('/(tabs)/signup')}>Register</Text>
          </Text>      
          { emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : pwdError ? (
            <Text style={styles.errorText}>{pwdError}</Text>
          ) : null}          
          <View style={styles.form}>
            <TitledInputBox
              title="Username"
              placeholder="eg. stronguy918"
              value={usrname}
              onChangeText={(buf: string) => {onchangeusrname(buf)}}
            />
            <TitledInputBox
              title="Password"
              placeholder="eg. iamsuperstrong@3121"
              secureTextEntry={true}
              value={pwd}
              onChangeText={(buf: string) => {onchangepwd(buf)}}
            />
          </View>
          <View style={styles.remember}>
          <BouncyCheckbox
            size={25}
            fillColor={Colors.primary}
            unFillColor="#FFFFFF"
            text="Remember me"
            style={{width: 40*vw}}
            iconStyle={{ borderColor: Colors.accent }}
            innerIconStyle={{ borderWidth: 4, backgroundColor: Colors.accent }}
            textStyle={{ fontFamily: 'Nuinto', color: Colors.white, textDecorationLine: 'none', padding: 0, marginLeft: -10 }}
            onPress={(opt: boolean) => rememberMe(opt)}
            />
            <Text style={styles.opt2} onPress={() => router.push('/(tabs)/')}>Forgot Password?</Text>
            </View>
          <RoundEdgeButton title="LOGIN" onPress={async () => await loginAccount()} />
        </View>
      </View>

      <View style={styles.bottom}>
        <Image source={require('@/assets/images/GOOGLE_LOGIN.png')} style={styles.bottomimg} resizeMode="contain" />
        <Image source={require('@/assets/images/APPLE_LOGIN.png')} style={styles.bottomimg} resizeMode="contain" />
        <Image source={require('@/assets/images/GITHUB_LOGIN.png')} style={styles.bottomimg} resizeMode="contain" />
      </View>
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
