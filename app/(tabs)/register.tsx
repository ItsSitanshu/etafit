import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router'; 
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';
import Logo from '@/components/Logo';
import TitledInputBox from '@/components/TitledInputBox';
import RoundEdgeButton from '@/components/RoundEdgeButton';

import { API_URL }from 'react-native-dotenv';

import GifLoading from '@/components/GifLoading';

export default function Register() {
  const router = useRouter();

  const [Username, SetUsername] = useState('');
  const [email, onchangeemail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswordStrength = (password: string) => {
    const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]{8,}$/;
    return passwordStrengthRegex.test(password);
  };

  const handleEmailChange = (buf: string) => {
    onchangeemail(buf);
    if (!validateEmail(buf)) {
      setError("Invalid email address");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (buf: string) => {
    setPassword(buf);
    if (!validatePasswordStrength(buf)) {
      setError(
        "Password must be at least 8 characters long, and include a number."
      );
    } else {
      setError("");
    }
  };

  const handleUsernameChange = (buf: string) => {
    SetUsername(buf);
    if (Username.length < 2) {
      setError("Username must be greater than two characters");
    } else {
      setError("");
    }
  };

  const registerAccount = async () => {
    if (error !== "") return;
  
    setLoading(true);

    const API: string = API_URL;
    console.log(API)
    
    try {
      const response = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: Username,
          password: password,
        }),
      });
  
      if (response.ok) {
        console.log('User registration data sent to server successfully');
      } else {
        const errorData = await response.json(); 
        console.error('Failed to send registration data to server:', response.statusText, errorData);
      }
    } catch (error) {
      console.error('Error during fetch:', error); 
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
        <Text style={styles.head}>Create New Account</Text>
        <View style={styles.inner}>
          <Text style={styles.opt}>
            Already have an account? <Text style={styles.opt2} onPress={() => router.push('/(tabs)/login')}>Login</Text>
          </Text>
          {error ? (<Text style={styles.errorText}>{error}</Text>) : <Text> </Text>}          
          <View style={styles.form}>
            <TitledInputBox
              title="Username"
              placeholder="eg. strongestofall"
              value={Username}
              onChangeText={SetUsername}
            />
            <TitledInputBox
              title="Email Adr."
              placeholder="eg. strongguybob@etafit.com"
              value={email}
              onChangeText={handleEmailChange}
            />

            <TitledInputBox
              title="Password"
              placeholder="eg. 2312#@7712"
              secureTextEntry={true}
              value={password}
              onChangeText={handlePasswordChange}
            />
            
          </View>
          <RoundEdgeButton title="REGISTER" onPress={registerAccount} />
        </View>
      </View>

      <View style={styles.bottom}>
        <Image source={require('@/assets/images/GOOGLE_LOGIN.png')} style={styles.bottomimg} resizeMode="contain" />
        <Image source={require('@/assets/images/APPLE_LOGIN.png')} style={styles.bottomimg} resizeMode="contain" />
        <Image source={require('@/assets/images/GITHUB_LOGIN.png')} style={styles.bottomimg} resizeMode="contain" />
      </View>

    </View>
    </ScrollView>
    <GifLoading visible={loading} close={() => {}} />
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
    height: 48 * vh,
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
    borderTopLeftRadius: 20 * vw,
    borderTopRightRadius: 20 * vw,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  bottomimg: {
    paddingLeft: 80,
    width: 52,
    height: 52,
  },
  opt: {
    margin: 0,
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
    marginTop: 1.5*vh,
    marginBottom: 0.5*vh,
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
    fontSize: 10,
    textDecorationLine: 'underline',
    marginBottom: 2
  },
});