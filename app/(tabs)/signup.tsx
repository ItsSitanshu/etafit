import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router'; 
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';
import Logo from '@/components/Logo';
import TitledInputBox from '@/components/TitledInputBox';
import RoundEdgeButton from '@/components/RoundEdgeButton';

import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, store } from "@/hooks/useFirebase";
import { FirebaseError } from "firebase/app";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

export default function HomeScreen() {
  const router = useRouter();

  const [usrname, onchangeusrname] = useState('');
  const [email, onchangeemail] = useState('');
  const [pwd, onchangepwd] = useState('');

  const [usrnameError, setusrnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwdError, setPwdError] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswordStrength = (password: string) => {
    const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordStrengthRegex.test(password);
  };

  const handleEmailChange = (buf: string) => {
    onchangeemail(buf);
    if (!validateEmail(buf)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (buf: string) => {
    onchangepwd(buf);
    if (!validatePasswordStrength(buf)) {
      setPwdError(
        "Password must be at least 8 characters long, and include a number."
      );
    } else {
      setPwdError("");
    }
  };

  const handleUsernameChange = (buf: string) => {
    onchangeusrname(buf);
    if (usrname.length < 2) {
      setusrnameError("Username must be greater than two characters");
    } else {
      setusrnameError("");
    }
  };

  const createUnAuth = async (email: string, usrname: string) => {
    try {
      const usersRef = collection(store, "unauth");
      const emailQuery = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);

      if (querySnapshot.empty) {
        const newUserDocRef = doc(usersRef, email);
        await setDoc(newUserDocRef, {
          email: email,
          username: usrname,
        });
      } else {
        console.log(
          "A user document with this email already exists:",
          querySnapshot.docs[0].data()
        );
      }
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };

  const registerAccount = async () => {
    if (pwdError != "" || emailError != "" || usrnameError != "") {
      console.log("ERROR REGISTERING!" + emailError + pwdError + usrnameError);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pwd);
      const user = userCredential.user;
      await sendEmailVerification(user);
    } catch (e: any) {
      const err = e as FirebaseError;
      onchangeusrname("");
      onchangeemail("");
      onchangepwd("");
      alert("Registration Failed: " + err.message);
    } finally {
      setLoading(false);
      createUnAuth(email, usrname);
      onchangeusrname("");
      onchangeemail("");
      onchangepwd("");
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
          {usrnameError ? (
            <Text style={styles.errorText}>{usrnameError}</Text>
          ) : emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : pwdError ? (
            <Text style={styles.errorText}>{pwdError}</Text>
          ) : null}          
          <View style={styles.form}>
            <TitledInputBox
              title="Username"
              placeholder="eg. strongestofall"
              value={usrname}
              onChangeText={onchangeusrname}
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
              value={pwd}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
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
    marginTop: 15,
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