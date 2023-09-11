import { View, Text, Image, Pressable, TextInput, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../components/Button';
import { signInUser } from "../services/BooksService";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const openFacebook = () => {
    const facebookAppURL = 'https://www.facebook.com/'; // Replace PAGE_ID with your Facebook Page ID
    const fallbackURL = 'https://www.facebook.com/Bryanwee333'; // Replace PAGE_ID with your Facebook Page ID
    Linking.canOpenURL(facebookAppURL).then((supported) => {
        if (supported) {
            Linking.openURL(facebookAppURL);
        } else {
            Linking.openURL(fallbackURL);
        }
    });
};

const Login = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');


  // Save data to AsyncStorage
const saveData = async () => {
  try {
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('password', password);
    await AsyncStorage.setItem('rememberMeChecked', isChecked.toString()); // Save the checkbox state
  } catch (e) {
    // Saving error
    console.error('Error saving data:', e);
  }
};
  // Retrieve data from AsyncStorage and fill the fields if "Remember Me" is checked
const retrieveData = async () => {
  try {
    const savedEmail = await AsyncStorage.getItem('email');
    const savedPassword = await AsyncStorage.getItem('password');
    const rememberMeChecked = await AsyncStorage.getItem('rememberMeChecked');

    if (savedEmail !== null && savedPassword !== null && rememberMeChecked === 'true') {
      // Data was found and "Remember Me" is checked, set it to the state
      setEmail(savedEmail);
      setPassword(savedPassword);
      setIsChecked(true); // Set the "Remember Me" checkbox to checked
    }
  } catch (e) {
    // Retrieval error
    console.error('Error retrieving data:', e);
  }
};


  useEffect(() => {
    retrieveData(); // Load saved data when the component mounts
  }, []);

    const validateEmail = () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email) {
          setEmailError('Email is required');
        } else if (!emailPattern.test(email)) {
          setEmailError('Invalid email format');
        } else {
          setEmailError('');
        }
      };
    
      const validatePassword = () => {
        if (!password) {
          setPasswordError('Password is required');
        } else if (password.length < 6) {
          setPasswordError('Password must be at least 6 characters long');
        } else if (password.length > 20) {
          setPasswordError('Password cannot exceed 20 characters');
        } else {
          setPasswordError('');
        }
      };


      const handleLogin = () => {
        // Validate email and password before proceeding
        validateEmail();
        validatePassword();
      
        if (!emailError && !passwordError) {
          console.log('Logging in with email:', email, 'and password:', password);
          console.log('Login button pressed');
          const rememberMe = isChecked;
          signInUser(email, password)
            .then((user) => {
              // Successful login, navigate to the next screen or perform actions
              console.log('User logged in:', user);
      
              // Use the navigation object to navigate based on userType
              if (user.type === 'Client') {
                // Navigate to the ClientPage
                navigation.reset({
                  index: 0, // Navigate to the first screen in the stack
                  routes: [{ name: 'Client' }], // Navigate to the "Client" screen
                });
              } else if (user.type === 'Admin') {
                // Navigate to the AdminPage
                navigation.navigate('Admin');
              } else {
                // Handle other user types or unexpected userType values
                console.error('Invalid userType:', user.type);
              }
      
              // Save data if "Remember Me" is checked
              if (rememberMe) {
                saveData();
              }
            })
            .catch((error) => {
              // Handle login error, display an error message to the user
              console.error('Login failed:', error);
              // You can also display an error message to the user here
            });
        }
      };
      




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
      <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: COLORS.black
                    }}>
                        Hi Welcome to Book Buddy! 👋
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: COLORS.black
                    }}>U need an account before using our app.</Text>
                </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Email address</Text>
          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={{ width: '100%' }}
              value={email}
              onChangeText={(text) => setEmail(text)}
              onBlur={validateEmail} // Validate email on blur
            />
          </View>
          {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null}
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Password</Text>
          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              style={{ width: '100%' }}
              value={password}
              onChangeText={(text) => setPassword(text)}
              onBlur={validatePassword} // Validate password on blur
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: 'absolute',
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
        </View>

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 6
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={(value) => setIsChecked(value)}
                        color={isChecked ? COLORS.primary : undefined}
                    />

                    <Text>Remember Me</Text>
                </View>

                <Button
                    title="Login"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={handleLogin} // Call handleLogin when the button is pressed
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14 }}>Or Login with</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        onPress={openFacebook}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    >
                        <Image
                            source={require("../assets/facebook.png")}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8
                            }}
                            resizeMode='contain'
                        />

                        <Text>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => console.log("Pressed")}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    >
                        <Image
                            source={require("../assets/google.png")}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8
                            }}
                            resizeMode='contain'
                        />

                        <Text>Google</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Don't have an account ? </Text>
                    <Pressable
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Register</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Login