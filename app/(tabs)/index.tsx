import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { vw, vh } from '@/constants/Window';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';

import { auth, store } from "@/hooks/useFirebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<null | any>(null);

  const fetchUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setLoading(true);

      try {
        const usersRef = collection(store, "users");
        const q = query(usersRef, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            setUserData({
              weight: data.weight?.toString() || '',
              height: data.height?.toString() || '',
              username: data.username?.toString() || '',
              email: data.email?.toString() || '',
              followers: data.followers?.toString() || '0',
              pfp: data.pfp?.toString() || '',
              first: data.first?.toString() || '',
              last: data.last?.toString() || '',
              middle: data.middle?.toString() || '',
            });
          });
        } else {
          console.log("No matching user document found for email:", currentUser.email);
        }
      } catch (error) {
        console.error("Error fetching user document by email:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("No user is currently logged in.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/(tabs)/signup');
      } else {
        console.log("User logged in");
        fetchUser();
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
