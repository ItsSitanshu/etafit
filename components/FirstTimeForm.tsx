import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Modal, Image } from 'react-native';
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

import { auth, store } from '@/hooks/useFirebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import ScrollPicker from "react-native-wheel-scrollview-picker";


interface FirstTimeFormProps {
  userData: any;
  visible: boolean;
  onClose: () => void;
  fetchUser: () => void;
}

const FirstTimeForm: React.FC<FirstTimeFormProps> = ({ userData, visible, onClose, fetchUser }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState('Male');
  const [activityLevel, setActivityLevel] = useState('Moderately active');
  const [goals, setGoals] = useState('');

  const [editWeight, setEditWeight] = useState<string>("");
  const [editYear, setYear] = useState<string>("2000");
  const today = new Date();
  const [editMonth, setMonth] = useState<string>(String(today.getMonth()));
  const [editDay, setDay] = useState<string>(String(today.getDay()));

  const [age, setAge] = useState(String(today.getFullYear() - Number(editYear)));


  const [editWeightD, setEditWeightD] = useState<string>("60");
  const [editWeightDec, setEditWeightDec] = useState<number>(.6);
  const [editHeight, setEditHeight] = useState<string>("170");


  const WEIGHT = Array.from({ length: 650 }, (_, i) => ([ (i + 1).toString()]));
  const YEARS = Array.from({ length: 2012 - 1935 + 1 }, (_, i) => [(1935 + i).toString()]);
  const HEIGHT = Array.from({ length: 272 }, (_, i) => ([ (i + 1).toString()]));

  const handleNextStep = () => {
    if (firstName == ""  || lastName == "") {
      setError("Names cant be empty");
      return;
    }

    if (step < 8) setStep(step + 1);
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
              weight: Number(editWeightD) + Number(editWeightDec),
              height: editHeight,
              age: age,
              sex: sex,
              activity: activityLevel,
              goals: goals,
            };

            const needsUpdate =
              updatedData.first !== userData.first ||
              updatedData.middle !== userData.middle ||
              updatedData.last !== userData.last ||
              updatedData.weight !== userData.weight ||
              updatedData.height !== userData.height ||
              updatedData.age !== userData.age ||
              updatedData.sex !== userData.sex ||
              updatedData.activity !== userData.activityLevel ||
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

    fetchUser();

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
                placeholderTextColor={Colors.white}
              />
              <TextInput
                style={styles.modalInput}
                value={middleName}
                onChangeText={setMiddleName}
                placeholder="Middle Name (Optional)"
                placeholderTextColor={Colors.white}
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
                placeholderTextColor={Colors.white}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.modalQuestion}>2: Enter your weight in kilograms</Text>
              <Text style={styles.modalError}>{error}</Text>
              <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
              <View style={{width: 30*vw, height: 40*vh}}>
              <ScrollPicker
              dataSource={WEIGHT}
              selectedIndex={Math.round(Number(editWeightD)) - 1}
              renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
                <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 20 : 16}}>
                  {data}
                </Text>
              )}
              onValueChange={(value: any, index: number) => {
                setEditWeightD(value[0]);
              }}
              wrapperHeight={vh * 40}
              wrapperBackground={Colors.black}
              itemHeight={(vh * 40) / 7}
              highlightColor={Colors.primary}
              highlightBorderWidth={2}
              />

              </View>
              <Text style={styles.decimal}>{'\u2B24'}</Text>
              
              <View style={{ width: 25*vw, height: 40*vh }}>
                <ScrollPicker
                  dataSource={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                  selectedIndex={editWeightDec * 10}
                  renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => {
                    return (
                      <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 20 : 16}}>
                        {data}
                      </Text>
                    );
                  }}
                  onValueChange={(value: any, index: number) => {
                    setEditWeightDec((Number(value) / 10)); 
                  }}
                  wrapperHeight={vh * 40}
                  wrapperBackground={Colors.black}
                  itemHeight={(vh * 40) / 7}
                  highlightColor={Colors.accent}
                  highlightBorderWidth={2}
                />
              </View>

              <Text style={styles.result}>{Number(editWeightD) + Number(editWeightDec)}</Text>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.modalQuestion}>3: Enter your height in centimeters</Text>
              <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                <View style={{width: 80*vw, height: 40*vh}}>
                <ScrollPicker
                dataSource={HEIGHT}
                selectedIndex={Number(editHeight) - 1}
                renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
                  <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 20 : 16}}>
                    {data}
                  </Text>
                )}
                onValueChange={(value: any, index: number) => {
                  setEditHeight(value[0]);
                }}
                wrapperHeight={vh * 40}
                wrapperBackground={Colors.black}
                itemHeight={(vh * 40) / 7}
                highlightColor={Colors.primary}
                highlightBorderWidth={2}
                />
                </View>
              </View>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={styles.modalQuestion}>4: Select your year of birth</Text>
              <View style={{width: 80*vw, height: 15*vh}}>
                <ScrollPicker
                dataSource={YEARS}
                selectedIndex={Number(editYear) - 1935}
                renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
                  <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 20 : 16}}>
                    {data}
                  </Text>
                )}
                onValueChange={(value: any, index: number) => {
                  setYear(value[0]);
                  setAge(String(today.getFullYear() - Number(value[0])));
                }}
                wrapperHeight={vh * 15}
                wrapperBackground={Colors.black}
                itemHeight={(vh * 15) / 3}
                highlightColor={Colors.primary}
                highlightBorderWidth={2}
                />
              </View>
              <Text style={styles.resultAge}>{age} years old</Text>
            </>
          )}

          {step === 5 && (
            <>
              <Text style={styles.modalQuestion}>5: Enter your biological sex</Text>
              <View style={{width: 80 * vw, height: 15 * vh}}>
                <ScrollPicker
                  dataSource={['Male', 'Female']}
                  selectedIndex={sex === 'Male' ? 0 : sex === 'Female' ? 1 : 2}
                  renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
                    <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 20 : 16}}>
                      {data}
                    </Text>
                  )}
                  onValueChange={(value: any, index: number) => {
                    setSex(value);
                  }}
                  wrapperHeight={vh * 15}
                  wrapperBackground={Colors.black}
                  itemHeight={(vh * 15) / 3}
                  highlightColor={Colors.primary}
                  highlightBorderWidth={2}
                />
              </View>
            </>
          )}

          {step === 6 && (
            <>
              <Text style={styles.modalQuestion}>6: Enter your activity level</Text>
              <View style={{width: 80 * vw, height: 25 * vh, marginBottom: 2*vh}}>
              <ScrollPicker
                dataSource={['Sedentary', 'Lightly active', 'Moderately active', 'Very active', 'Super active']}
                selectedIndex={
                  activityLevel === 'Sedentary' ? 0 :
                  activityLevel === 'Lightly active' ? 1 :
                  activityLevel === 'Moderately active' ? 2 :
                  activityLevel === 'Very active' ? 3 :
                  activityLevel === 'Super active' ? 4 : -1 
                }
                renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
                  <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 20 : 16}}>
                    {data}
                  </Text>
                )}
                onValueChange={(value: any, index: number) => {
                  setActivityLevel(value);
                }}
                wrapperHeight={vh * 25}
                wrapperBackground={Colors.black}
                itemHeight={(vh * 25) / 5}
                highlightColor={Colors.primary}
                highlightBorderWidth={2}
              />
            </View>
            </>
          )}

          {step === 7 && (
            <>
              <Text style={styles.modalQuestion}>7: Provide a brief description of your goals</Text>
              <TextInput
                style={[styles.modalInput, { height: 100 }]}
                value={goals}
                onChangeText={setGoals}
                placeholder="E.g. loose 10kgs in 1 year; run a sub 20 5K; etc."
                placeholderTextColor={Colors.white}
                multiline
              />
            </>
          )}

          <View style={styles.center}>
            {step === 1 ? 
            <>
            <View/>
            <TouchableOpacity style={styles.actWrap} onPress={handleNextStep}>
              <Image 
                source={require('@/assets/images/right_caret.png')} 
                style={styles.actImg} 
                resizeMode="contain" 
              />
            </TouchableOpacity> 
            </>
            : step === 7 ? (
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
    color: Colors.white,
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
    fontFamily: 'Nuinto',
    borderBottomWidth: 0.5,
    height: 4*vh,
    borderColor: Colors.white,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'black',
    color: Colors.white
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  actWrap: {
    padding: 0,
    width: 15*vw,
    height: 15*vw,
    backgroundColor: Colors.primary,
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6*vw,
  },
  actImg: {
    width: 8*vw,
    height: 8*vw,
    padding: 0,
    margin: 0,
  },
  modalQuestion: {
    fontFamily: 'NuintoEBold',
    color: Colors.white,
    fontSize: 18,
  },
  modalError: {
    fontFamily: 'Nuinto',
    fontWeight: 'bold',
    color: Colors.accent,
    fontSize: 16
  },
  decimal: {
    color: Colors.white,
    fontFamily: 'NuintoEBold',
    fontSize: 8,
    margin: 0,
    padding: 2
  },
  result: {
    color: Colors.white,
    fontFamily: 'NuintoEBold',
    width: 8*vw,
  },
  resultAge: {
    padding: 0,
    margin: 0,
    color: Colors.white,
    fontFamily: 'NuintoEBold',
    width: '100%',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default FirstTimeForm;
