import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

import { auth, store, fstore } from "@/hooks/useFirebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";
import EditPop from '@/components/EditPop';
import ABSButton from '@/components/ABSButton';
import EditPopModal from '@/components/EdItPopModal';
import ProfilePictureModal from '@/components/ProfilePictureModal';
import GifLoading from '@/components/GifLoading';
import ScrollPicker from "react-native-wheel-scrollview-picker";
import FirstTimeForm from '@/components/FirstTimeForm';
import {Calendar, LocaleConfig} from 'react-native-calendars';

export default function HomeScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<null | any>(null);
  const [isEditing, setEditing] = useState<boolean>(false);

  const [firstForm, setFirstForm] = useState(false);

  const [pfpModalVisible, setPfpModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [nameError, setNameError] = useState("");
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [weightError, setWeightError] = useState("");
  const [heightModalVisible, setHeightModalVisible] = useState(false);
  const [heightError, setHeightError] = useState("");
  const [mainSave, setMainSave] = useState(true);

  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [sexModalVisible, setSexModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [goalsModalVisible, setGoalsModalVisible] = useState(false);


  const closePfpModal = () => setPfpModalVisible(false);
  const closeNameModal = () => setNameModalVisible(false);
  const closeWeightModal = () => setWeightModalVisible(false);
  const closeHeightModal = () => setHeightModalVisible(false);
  const closeAgeModal = () => setAgeModalVisible(false);
  const closeSexModal = () => setSexModalVisible(false);
  const closeActivityModal = () => setActivityModalVisible(false);
  const closeGoalsModal = () => setGoalsModalVisible(false);

  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [editWeight, setEditWeight] = useState<string>("");
  const [editWeightD, setEditWeightD] = useState<string>("");
  const [editWeightDec, setEditWeightDec] = useState<number>(.0);

  const [editHeight, setEditHeight] = useState<string>("");
  const [editAge, setEditAge] = useState<string>("");
  const [editSex, setEditSex] = useState<string>("");
  const [editActivity, setEditActivity] = useState<string>("");
  const [editGoals, setEditGoals] = useState<string>("");


  const WEIGHT = Array.from({ length: 650 }, (_, i) => ([ (i + 1).toString()]));
  const HEIGHT = Array.from({ length: 272 }, (_, i) => ([ (i + 1).toString()]));

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
              age: data.age?.toString() || '',
              sex: data.sex?.toString() || '',
              activity: data.activity?.toString() || '',
              goals: data.goals || '',
              username: data.username?.toString() || '',
              email: data.email?.toString() || '',
              followers: data.followers?.toString() || '0',
              pfp: data.pfp?.toString() || '',
              first: data.first?.toString() || '',
              last: data.last?.toString() || '',
              middle: data.middle?.toString() || '',
            });
            

            setEditWeight(data.weight);

            const weightParts = String(data.weight).split('.');
            const editWeightDec = weightParts[1] ? Number(weightParts[1]) : 0; 

            setEditWeightDec(editWeightDec);

            setEditWeightD(weightParts[0] || '');

            setFirstName(data.first || '');
            setMiddleName(data.middle || '');
            setLastName(data.last || '');
            setEditHeight(data.height || '');
            setEditAge(data.age || '');
            setEditSex(data.sex || '');
            setEditActivity(data.activity || '');
            setEditGoals(data.goals || '');

            setFirstForm([data.first, data.middle, data.last, data.weight, data.height, data.age, data.sex, data.activity, data.goals].every((field) => field.trim() === ""));
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
  

  const saveEdits = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        const usersRef = collection(store, "users");
        const q = query(usersRef, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            const data = doc.data();

            const updatedData = {
              weight: editWeight,
              height: editHeight,
              first: firstName,
              middle: middleName,
              last: lastName,
            };

            const needsUpdate = 
              updatedData.weight !== data.weight ||
              updatedData.height !== data.height ||
              updatedData.first !== data.first ||
              updatedData.middle !== data.middle ||
              updatedData.last !== data.last;

            if (needsUpdate) {
              await updateDoc(doc.ref, updatedData);
            }
            setEditing(false);
          });
        } else {
          console.log("No matching user document found for email:", currentUser.email);
        }
      } catch (error) {
        console.error("Error updating user document:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("No user is currently logged in.");
    }

    fetchUser();
  };

  const modifyPfP = () => {
    setPfpModalVisible(true);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: Colors.darkBackground + "FF", padding: 0 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={2}
    >
    <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: 'transparent'}} bounces={false}>
    {userData && !isEditing ? (
    <View style={styles.page}>
      <View style={styles.main}>
        <Image
          source={{ uri: userData.pfp }}
          style={styles.profileimg}
          resizeMode="cover"
        />
        <Text style={styles.username}>{userData.username}</Text>
        <Text style={styles.name}>{firstName || ''}{'' + middleName + '' || ' '}{lastName || ''}</Text>
        <Text style={styles.statline}>dec 2022  |  {userData.followers} followers  | 21 posts</Text>
      </View>
      <ABSButton onPress={() => setEditing(true)} src={require('@/assets/images/edit.png')}/>
      <GifLoading visible={loading} close={() => {setLoading(false)}} />
      <FirstTimeForm userData={userData} visible={firstForm} onClose={() => setFirstForm(false)}/>
    </View>
    ) : userData && isEditing ? (
    <View style={styles.page}>
      <View style={styles.main}>
      <View style={styles.editContainer}>
        <TouchableOpacity onPress={() => modifyPfP()} style={styles.pfpWrap}>
        <Image
          source={require('@/assets/images/camera.png')} 
          style={styles.editOverlay}
          resizeMode="cover"        
        />
        <Image
          source={{ uri: userData.pfp }}
          style={styles.pfp}
          resizeMode="cover"
        />
        </TouchableOpacity>
      </View>
      <EditPop title='Full Name' current={`${firstName || ''}${'' + middleName + '' || ' '}${lastName || ''}`} onPress={() => {setMainSave(false); setNameModalVisible(true);}}/>
      <EditPop title='Weight (kg)' current={`${editWeight}`} onPress={() => {setMainSave(false); setWeightModalVisible(true);}}/>
      <EditPop title='Height (cm)' current={`${editHeight}`} onPress={() => {setMainSave(false); setHeightModalVisible(true);}}/>
      <EditPop title='Age' current={`${editAge}`} onPress={() => { setMainSave(false); setAgeModalVisible(true); }} />
      <EditPop title='Sex' current={`${editSex}`} onPress={() => { setMainSave(false); setSexModalVisible(true); }} />
      <EditPop title='Activity Level' current={`${editActivity}`} onPress={() => { setMainSave(false); setActivityModalVisible(true); }} />
      <EditPop title='Goals' current={`${editGoals}`} onPress={() => { setMainSave(false); setGoalsModalVisible(true); }} />
      </View>
      <EditPopModal 
        title='Full Name' 
        visible={nameModalVisible} 
        close={closeNameModal} 
        ABSPress={() => { setNameModalVisible(false); setMainSave(true); }} 
      >
        <Text style={styles.errorText}>{nameError}</Text>
        <TextInput
          style={styles.modalInput}
          value={firstName}
          onChangeText={(buf: string) => {
            if (buf.trim().length > 0) {
              setFirstName(buf);
              setNameError(""); 
            } else {
              setFirstName(buf);
              setNameError("First name is required.");
            }
          }}
          placeholder="First Name"
        />

        <TextInput
          style={styles.modalInput}
          value={middleName}
          onChangeText={(buf: string) => { setMiddleName(buf); }}
          placeholder="Middle Name"
        />

        <TextInput
          style={styles.modalInput}
          value={lastName}
          onChangeText={(buf: string) => {
            if (buf.trim().length > 0) {
              setLastName(buf);
              setNameError("");
            } else {
              setLastName(buf);
              setNameError("Last name is required.");
            }
          }}
          placeholder="Last Name"
        />

      </EditPopModal>
      <EditPopModal 
        title='Weight (kg)' 
        visible={weightModalVisible}
        close={closeWeightModal} 
        ABSPress={() => { setWeightModalVisible(false); setMainSave(true); setEditWeight(editWeightD + '.' + editWeightDec); }} 
      >
        
        <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
        <View style={{width: 30*vw, height: 40*vh}}>
        <ScrollPicker
        dataSource={WEIGHT}
        selectedIndex={Math.round(Number(editWeightD)) - 1}
        renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
          <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 22 : 16}}>
            {data}
          </Text>
        )}
        onValueChange={(value: any, index: number) => {
          setEditWeightD(value[0]);
        }}
        wrapperHeight={vh * 40}
        wrapperBackground={Colors.bg}
        itemHeight={(vh * 40) / 7}
        highlightColor={Colors.primary}
        highlightBorderWidth={2}
        />

        </View>
        <Text style={styles.decimal}>{'\u2B24'}</Text>
        
        <View style={{ width: 30*vw, height: 40*vh }}>
        <ScrollPicker
          dataSource={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
          selectedIndex={editWeightDec}
          renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => {
            return (
              <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 22 : 16}}>
                {data}
              </Text>
            );
          }}
          onValueChange={(value: any, index: number) => {
            setEditWeightDec((Number(value) / 10)); 
          }}
          wrapperHeight={vh * 40}
          wrapperBackground={Colors.bg}
          itemHeight={(vh * 40) / 7}
          highlightColor={Colors.accent}
          highlightBorderWidth={2}
        />
      </View>
      <Text style={styles.result}>{editWeightD + '.' + editWeightDec}</Text>

      </View>

      </EditPopModal>
      <EditPopModal 
        title='Height (cm)' 
        visible={heightModalVisible} 
        close={closeHeightModal} 
        ABSPress={() => { setHeightModalVisible(false); setMainSave(true); }} 
      >
        <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
        <View style={{width: 80*vw, height: 40*vh}}>
        <ScrollPicker
        dataSource={HEIGHT}
        selectedIndex={Number(editHeight) - 1}
        renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
          <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 22 : 16}}>
            {data}
          </Text>
        )}
        onValueChange={(value: any, index: number) => {
          setEditHeight(value[0]);
        }}
        wrapperHeight={vh * 40}
        wrapperBackground={Colors.bg}
        itemHeight={(vh * 40) / 7}
        highlightColor={Colors.primary}
        highlightBorderWidth={2}
        />
        </View>

        </View>
      </EditPopModal>
      <EditPopModal 
        title='Sex' 
        visible={sexModalVisible} 
        close={closeSexModal} 
        ABSPress={() => { setSexModalVisible(false); setMainSave(true); }} 
      >
        <View>
          <Text style={styles.errorText}>(Biological Sex)</Text>
          <View style={{width: 80 * vw, height: 15 * vh}}>
            <ScrollPicker
              dataSource={['Male', 'Female']}
              selectedIndex={editSex === 'Male' ? 0 : editSex === 'Female' ? 1 : 2}
              renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
                <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 22 : 16}}>
                  {data}
                </Text>
              )}
              onValueChange={(value: any, index: number) => {
                setEditSex(value);
              }}
              wrapperHeight={vh * 15}
              wrapperBackground={Colors.bg}
              itemHeight={(vh * 15) / 3}
              highlightColor={Colors.primary}
              highlightBorderWidth={2}
            />
          </View>
        </View>
      </EditPopModal>
      <EditPopModal 
        title='Activity Levels' 
        visible={activityModalVisible} 
        close={closeActivityModal} 
        ABSPress={() => { setActivityModalVisible(false); setMainSave(true); }} 
      >
        <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column'}}>
          <View style={{width: 80 * vw, height: 25 * vh, marginBottom: 2*vh}}>
            <ScrollPicker
              dataSource={['Sedentary', 'Lightly active', 'Moderately active', 'Very active', 'Super active']}
              selectedIndex={
                editActivity === 'Sedentary' ? 0 :
                editActivity === 'Lightly active' ? 1 :
                editActivity === 'Moderately active' ? 2 :
                editActivity === 'Very active' ? 3 :
                editActivity === 'Super active' ? 4 : -1 
              }
              renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
                <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 22 : 16}}>
                  {data}
                </Text>
              )}
              onValueChange={(value: any, index: number) => {
                setEditActivity(value);
              }}
              wrapperHeight={vh * 25}
              wrapperBackground={Colors.bg}
              itemHeight={(vh * 25) / 5}
              highlightColor={Colors.primary}
              highlightBorderWidth={2}
            />
          </View>
        </View>
      </EditPopModal>


      {/* <EditPopModal 
        title='Age' 
        visible={ageModalVisible} 
        close={closeAgeModal} 
        ABSPress={() => { setAgeModalVisible(false); setMainSave(true); }} 
      >
        <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
        <View style={{width: 80*vw, height: 40*vh}}>
        <ScrollPicker
        dataSource={AGE}
        selectedIndex={Number(editAge) - 1}
        renderItem={(data: any, index: number, isSelected: boolean): JSX.Element => (
          <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: Colors.white, fontFamily: isSelected ? 'NuintoEBold' : 'Nuinto', fontSize: isSelected ? 22 : 16}}>
            {data}
          </Text>
        )}
        onValueChange={(value: any, index: number) => {
          setEditAge(value[0]);
        }}
        wrapperHeight={vh * 40}
        wrapperBackground={Colors.bg}
        itemHeight={(vh * 40) / 7}
        highlightColor={Colors.primary}
        highlightBorderWidth={2}
        />
        </View>

        </View>
      </EditPopModal> */}
      <FirstTimeForm userData={userData} visible={firstForm} onClose={() => setFirstForm(false)}/>
      <ProfilePictureModal
        visible={pfpModalVisible}
        onClose={closePfpModal}
        userId={userData.username}
        userData={userData}
        updateSync={async () => {
          try {
            await saveEdits();   
          } catch (error) {
            console.error('Error during saveEdits:', error);    
          } finally {
            await fetchUser();     
          }
        }}
        img={userData.pfp}
        setUserData={setUserData}
      />

      <GifLoading visible={loading} close={() => {}} />
      {mainSave ? <ABSButton onPress={() => saveEdits()} src={require('@/assets/images/save.png')}/>: <></>}
    </View>
    ) : (
      <GifLoading visible={!userData} close={() => {}} />
    )}
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
    minHeight: 100*vh,
    backgroundColor: Colors.bg,
  },
  profileimg: {
    height: 25*vh,
    width: 25*vh,
    borderRadius: 20*vh,
    padding: 0,
    margin: 0,
    marginTop: 6*vh,
    marginBottom: 15
  },
  username: {
    borderColor: Colors.primary,
    borderWidth: 0.2*vw,
    fontFamily: 'NuintoEBold',
    textAlign: 'center',
    color: Colors.white,
    fontSize: 30,
    width: 65 * vw,
    borderRadius: 5
  },
  name: {
    margin: 0,
    marginTop: 5,
    fontFamily: 'Nuinto',
    fontSize: 22,
    color: Colors.white,
    width: 65 * vw,
    textAlign: 'center',
  },
  main: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  statline: {
    fontFamily: 'Nuinto',
    fontSize: 15,
    color: Colors.primary,
    width: 93 * vw,
    textAlign: 'center',
  },
  editContainer: {
    width: 25*vh,
    height: 25*vh,
    margin: 0,
    padding: 0,
    marginBottom: 10*vh,
    backgroundColor: Colors.bg,
  },
  editOverlay: {
    margin: 0,
    padding: 0,
    height: 7 * vh,
    width: 8 * vh,
    zIndex: 1,
    position: 'absolute',
    top: '50%',  
    left: '50%', 
    transform: [
      { translateX: -8 * vh / 2 },
      { translateY: -7  * vh / 2 + (6 * vh) },
    ]
  },
  pfpWrap: {
    margin: 0,
    padding: 0,
    height: 25*vh,
    width: 25*vh,
    position: 'relative'
  },
  pfp: {
    height: 25*vh,
    width: 25*vh,
    borderRadius: 20*vh,
    padding: 0,
    margin: 0,
    marginTop: 6*vh,
    position: 'absolute',
    zIndex: 0,
  },
  modalInput: {
    fontFamily: 'NuintoEBold',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
    color: Colors.white
  },
  errorText: {
    fontFamily: 'Nuinto',
    color: Colors.lightAccent
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
  }
});