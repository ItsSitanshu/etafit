import React, { useState } from 'react';
import { Modal, View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';
import { fstore, store } from '../hooks/useFirebase';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import RoundEdgeButton from './RoundEdgeButton';
import GifLoading from './GifLoading';

interface ProfilePictureModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  userData: any;
  updateSync: () => any;
  img: string;
  setUserData: React.Dispatch<any>;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({ visible, onClose, userId, userData, updateSync, img}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    const { canceled, assets } = result;

    if (canceled) {
      alert("Image selection was canceled.");
      return;
    }

    if (assets && assets.length > 0) {
      setSelectedImage(assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);

      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const fstoreRef = ref(fstore, `pfp/${userId}.jpg`);

      await uploadBytes(fstoreRef, blob);
      const downloadURL = await getDownloadURL(fstoreRef);

      const usersRef = collection(store, "users");
      const q = query(usersRef, where("email", "==", userData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(store, 'users', userDoc.id);
        await updateDoc(userRef, { pfp: downloadURL });

      } else {
        alert('User not found.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false); 
    }

    await updateSync();

    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Upload Profile Picture</Text>
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
              <Image source={{ uri: img }} style={styles.image} />
            )}
            <RoundEdgeButton title='SELECT A NEW IMAGE' onPress={handleImagePick} backgroundColor={Colors.black}/>
          </View>
          <Button title="Upload" onPress={handleUpload} disabled={!selectedImage} color={Colors.lightAccent} />
          <Button title="Cancel" onPress={onClose} color={Colors.accent} />
        </View>
      </View>
      {loading && <GifLoading visible={loading} close={() => {}} />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 90 * vw,
    padding: 20,
    backgroundColor: Colors.bg,
    marginTop: 10 * vh,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'NuintoEBold',
    color: Colors.lightAccent,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 25 * vh,
    height: 25 * vh,
    borderRadius: 20 * vh,
    marginBottom: 10,
  },
});

export default ProfilePictureModal;
