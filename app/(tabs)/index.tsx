import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/hooks/useFirebase';

export default function HomeScreen() {
  const router = useRouter();

  // const fetchUser = async () => {
  //   const currentUser = auth.currentUser;


  
  //   if (currentUser) {
  //     setLoading(true);
  
  //     try {
  //       const usersRef = collection(store, "users");
  //       const q = query(usersRef, where("email", "==", currentUser.email));
  //       const querySnapshot = await getDocs(q);
  
  //       if (!querySnapshot.empty) {
  //         querySnapshot.forEach((doc) => {
  //           const data = doc.data();
  //           setUserData({
  //             weight: data.weight?.toString() || '',
  //             height: data.height?.toString() || '',
  //             username: data.username?.toString() || '',
  //             email: data.email?.toString() || '',
  //             followers: data.followers?.toString() || '0',
  //             pfp: data.pfp?.toString() || '',
  //             first: data.first?.toString() || '',
  //             last: data.last?.toString() || '',
  //             middle: data.middle?.toString() || '',
  //           });
            
  //           setEditHeight(data.height);

  //           setFirstForm([data.first, data.middle, data.last, data.weight, data.height].every((field) => field.trim() === ""));
  //         });
  //       } else {
  //         console.log("No matching user document found for email:", currentUser.email);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user document by email:", error);
  //     } finally {
  //       setLoading(false); 
  //     }
  //   } else {
  //     console.error("No user is currently logged in.");
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/(tabs)/pprofile');
      } else {
        router.push('/(tabs)/signup');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
