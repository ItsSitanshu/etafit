import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Modal, Image } from 'react-native';
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

import { auth, store } from '@/hooks/useFirebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

interface FirstTimeFormProps {
  userData: any;
  visible: boolean;
  onClose: () => void;
}


const FirstTimeForm: React.FC<FirstTimeFormProps> = ({ userData, visible, onClose }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goals, setGoals] = useState('');

  const handleNextStep = () => {
    if (step < 8) setStep(step + 1); // Update to 8 steps
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        const usersRef = collection(store, "users");
        const q = query(usersRef, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            const updatedData = {
              first: firstName,
              middle: middleName,
              last: lastName,
              weight: parseFloat(weight),
              height: parseFloat(height),
              age: parseInt(age),
              sex,
              activityLevel,
              goals,
            };

            const needsUpdate =
              updatedData.first !== userData.first ||
              updatedData.middle !== userData.middle ||
              updatedData.last !== userData.last ||
              updatedData.weight !== userData.weight ||
              updatedData.height !== userData.height ||
              updatedData.age !== userData.age ||
              updatedData.sex !== userData.sex ||
              updatedData.activityLevel !== userData.activityLevel ||
              updatedData.goals !== userData.goals;

            if (needsUpdate) {
              await updateDoc(doc.ref, updatedData);
            }
          });
        } else {
          console.log("No matching user document found for email:", currentUser.email);
        }
      } catch (error) {
        console.error("Error updating user document:", error);
      }
    } else {
      console.error("No user is currently logged in.");
    }

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
          <Text style={styles.modalTitle}>Question {step} of 8</Text>
          
          {step === 1 && (
            <>
              <Text style={styles.modalQuestion}>1: Enter your first, middle (if any), and last name</Text>
              <Text style={styles.modalError}>{error}</Text>
              <TextInput
                style={styles.modalInput}
                onChangeText={(buf: string) => {
                  if (buf.trim().length > 0) {
                    setFirstName(buf);
                    setError(""); 
                  } else {
                    setFirstName(buf);
                    setError("First name is required.");
                  }
                }}
                value={firstName}
                placeholder="First Name"
              />
              <TextInput
                style={styles.modalInput}
                value={middleName}
                onChangeText={setMiddleName}
                placeholder="Middle Name (Optional)"
              />
              <TextInput
                style={styles.modalInput}
                value={lastName}
                onChangeText={(buf: string) => {
                  if (buf.trim().length > 0) {
                    setLastName(buf);
                    setError(""); 
                  } else {
                    setLastName(buf);
                    setError("Last name is required.");
                  }
                }}
                placeholder="Last Name"
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.modalQuestion}>2: Enter your weight in kilograms</Text>
              <Text style={styles.modalError}>{error}</Text>
              <TextInput
                style={styles.modalInput}
                value={weight}
                onChangeText={(buf: string) => {
                  const weightValue = Number(buf);
                  if (weightValue > 0) {
                    setWeight(buf);
                    setError("");
                  } else {
                    setWeight(buf);
                    setError("Please enter a valid weight.");
                  }
                }}
                placeholder="Enter your weight (kg)"
                keyboardType="numeric"
              />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.modalQuestion}>3: Enter your height in centimeters</Text>
              <TextInput
                style={styles.modalInput}
                value={height}
                onChangeText={(buf: string) => {
                  const heightValue = Number(buf);
                  if (heightValue > 0) {
                    setHeight(buf);
                    setError("");
                  } else {
                    setHeight(buf);
                    setError("Please enter a valid height.");
                  }
                }}
                placeholder="Enter your height (cm)"
                keyboardType="numeric"
              />
            </>
          )}

          {step === 4 && (
            <>
              <Text style={styles.modalQuestion}>4: Enter your age</Text>
              <TextInput
                style={styles.modalInput}
                value={age}
                onChangeText={(buf: string) => {
                  const ageValue = Number(buf);
                  if (ageValue > 0) {
                    setAge(buf);
                    setError("");
                  } else {
                    setAge(buf);
                    setError("Please enter a valid age.");
                  }
                }}
                placeholder="Enter your age"
                keyboardType="numeric"
              />
            </>
          )}

          {step === 5 && (
            <>
              <Text style={styles.modalQuestion}>5: Enter your sex</Text>
              <TextInput
                style={styles.modalInput}
                value={sex}
                onChangeText={setSex}
                placeholder="Enter your sex (e.g., Male, Female)"
              />
            </>
          )}

          {step === 6 && (
            <>
              <Text style={styles.modalQuestion}>6: Enter your activity level</Text>
              <TextInput
                style={styles.modalInput}
                value={activityLevel}
                onChangeText={setActivityLevel}
                placeholder="Enter your activity level (e.g., Sedentary, Active)"
              />
            </>
          )}

          {step === 7 && (
            <>
              <Text style={styles.modalQuestion}>7: Enter your goals</Text>
              <TextInput
                style={styles.modalInput}
                value={goals}
                onChangeText={setGoals}
                placeholder="Enter your goals"
              />
            </>
          )}

          <View style={styles.center}>
            {step === 8 ? (
              <>
                <TouchableOpacity style={styles.actWrap} onPress={handlePreviousStep}>
                  <Image 
                    source={require('@/assets/images/left_caret.png')} 
                    style={styles.actImg} 
                    resizeMode="contain" 
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actWrap} onPress={handleSubmit}>
                  <Image 
                    source={require('@/assets/images/check.png')} 
                    style={styles.actImg} 
                    resizeMode="contain" 
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.actWrap} onPress={handlePreviousStep}>
                  <Image 
                    source={require('@/assets/images/left_caret.png')} 
                    style={styles.actImg} 
                    resizeMode="contain" 
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actWrap} onPress={handleNextStep}>
                  <Image 
                    source={require('@/assets/images/right_caret.png')} 
                    style={styles.actImg} 
                    resizeMode="contain" 
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};



const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContainer: {
    marginTop: 10*vh,
    width: vw*90,
    backgroundColor: Colors.black,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.primary,
    fontFamily: 'NuintoEBold',
  },
  modalInput: {
    color: Colors.lightAccent,
    fontFamily: 'Nuinto',
    borderBottomWidth: 0.5,
    borderColor: Colors.white,
    marginBottom: 20,
    fontSize: 20,
    padding: 8,
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actWrap: {
    padding: 0,
    width: 15*vw,
    height: 15*vw,
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6*vw,
  },
  actImg: {
    width: 8*vw,
    height: 8*vw,
  },
  modalQuestion: {
    fontFamily: 'Nuinto',
    color: Colors.white,
    fontSize: 18,
  },
  modalError: {
    fontFamily: 'NuintoEBold',
    color: Colors.accent,
    fontSize: 16
  }
});

export default FirstTimeForm;
