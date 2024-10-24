import React from 'react';
import { View, TextInput, Text, Modal, StyleSheet } from 'react-native';
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

import ABSButton from './ABSButton';
import RoundEdgeButton from './RoundEdgeButton';

interface EditPopModalProps {
  title: string;
  visible: boolean;
  close:  () => void;
  ABSPress: () => void;
  children?: React.ReactNode;
}


const EditPopModal: React.FC<EditPopModalProps> = ({ title, visible, close, ABSPress, children }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={close}
    >
      <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{title}</Text>
        {children}
        <View style={styles.center}>
          <RoundEdgeButton onPress={ABSPress} title='CONFIRM CHANGES' backgroundColor={Colors.black}/>        
        </View>
      </View>
      </View>
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'NuintoEBold',
    color: Colors.white
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditPopModal;