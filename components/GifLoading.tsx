import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, Modal, StyleSheet, Easing } from 'react-native';
import { vw, vh } from '@/constants/Window';
import { Colors } from '@/constants/Colors';

import { Wander} from 'react-native-animated-spinkit'

interface GifLoadingProps {
  visible: boolean;
  close:  () => void;
}


const GifLoading: React.FC<GifLoadingProps> = ({ visible, close }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current; 

  const responses = [
    "Running to the servers",
    "Benching two plates",
    "Putting weights on the bar",
    "Cycling through the code",
    "Swimming in requests",
    "Doing squats with your data",
    "Lifting server weights",
    "Stretching the bandwidth",
    "Sprinting to the database",
    "Tying up my running shoes",
    "Gearing up for a long ride",
    "Climbing hills in the background",
    "Paddling through packets",
    "Counting server reps",
    "Swimming laps through your data",
    "Logging miles on the track",
    "Putting on the swim cap",
    "Refueling with some protein code",
    "Drafting behind the firewall",
    "Running a marathon of processes",
    "Spinning up the gears",
    "Fixing a flat tire in the code",
    "Setting up for a triathlon",
    "Pulling data like a backstroke",
    "Braking hard on a server hill",
    "Sweating through the queries",
    "Dodging potholes in the code",
    "Riding the headwind of data",
    "Hydrating with more bandwidth",
    "Pushing through the last set of code",
    "Transitioning to bike mode",
    "Surfing the waves of requests",
    "Stepping onto the server treadmill",
    "Warming up with dynamic stretches",
    "Getting ready for a power interval",
    "Drinking data like Gatorade",
    "Pumping up tires on the server bike",
    "Zipping up the wetsuit for requests",
    "Tuning up the database chain",
    "Speeding through the data highway",
    "Hammering the pedals on the server",
    "Sprinting to the finish line of code",
    "Fueling up with some high-protein queries",
    "Racking up miles on the code track",
    "Swimming freestyle through requests",
    "Kicking hard in the final stretch of code",
    "Gearing down for the cool-down queries",
    "Drafting the fastest server wind",
    "Washing off the server sweat",
    "Cooling off in the data pool",
    "Hitting the server gym for more reps",
    "Balancing the load like a stability ball"
  ];

  useEffect(() => {
    let animation;

    if (visible) {
      const startSpinning = () => {
        rotateAnim.setValue(0); 

        animation = Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear, 
          useNativeDriver: true,
        }).start(() => startSpinning()); 
      };

      startSpinning(); 
    } else {
      rotateAnim.stopAnimation(); 
    }

    return () => {

      rotateAnim.stopAnimation();
    };
  }, [visible, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], 
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={close}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Animated.View
            style={{
              transform: [{ rotate }],
              paddingBottom: 50,
            }}
          >
            <Wander size={50 * vw} color={Colors.primary} />
          </Animated.View>
          <Text style={styles.modalText}>{responses[Math.floor(Math.random() * responses.length)]}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 0,
  },
  modalContainer: {
    width: 90 * vw,
    height: 50*vh,
    padding: 40,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 10,
  },
  modalText: {
    color: Colors.white,
    fontFamily: 'NuintoEBold',
    marginTop: 3*vh,
    fontSize: 4.5*vw,
    textAlign: 'center',
    width: '100%'
  }
});


export default GifLoading;
