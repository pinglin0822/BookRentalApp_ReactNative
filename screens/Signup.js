import { View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../components/Button';
import { insertUser,createTable  } from "../services/BooksService";


const Signup = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setUserType] = useState('Client'); // Default userType is 'Client'
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const MAX_USERNAME_LENGTH = 20; // Maximum length for the username
    const [usernameError, setUsernameError] = useState(''); // New state for username error

  const handleSignUp =  async () => {
    console.log('Handling sign up...');
    await createTable();
  
    try {
      if (!email || !password || !name) {
        console.error('Please fill in all fields.');
        return;
      }
  // Validate email and password
  validateEmail();
  validatePassword();

  if (emailError || passwordError || usernameError) {
    console.error('Invalid email or password, or username.');
    return;
  }

  // Add additional validation for the username length
  if (name.length > MAX_USERNAME_LENGTH) {
    console.error('Username exceeds the maximum length.');
    return;
  }

  const userId = await insertUser(name, email, password, type);
  if (userId) {
    console.log('User ID from insertUser:', userId);
    navigation.navigate('Login');
  }
} catch (error) {
  console.error('Error registering user:', error);
  if (error instanceof Error && error.message) {
    console.error('Error message:', error.message);
  }
}
};

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

const validateUsername = () => {
    if (!name) {
      setUsernameError('Username is required');
    } else if (name.length > MAX_USERNAME_LENGTH) {
      setUsernameError('Username exceeds the maximum length.');
    } else {
      setUsernameError(''); // Clear the error if it's within the limit
    }
  };
  
  

  // Function to toggle between 'Admin' and 'Client' userType
  const toggleUserType = () => {
    setUserType(type === 'Client' ? 'Admin' : 'Client');
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
                        Create Account
                    </Text>
                    
                    <Text style={{
                        fontSize: 16,
                        color: COLORS.black
                    }}>Connect with your books today!</Text>
                </View>
<Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>User Type</Text>
          <TouchableOpacity
            onPress={toggleUserType}
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22,
              flexDirection: 'row',
            }}
          >
            <Text style={{ flex: 1 }}>{type}</Text>
            <Ionicons name="arrow-forward" size={24} color={COLORS.black} />
          </TouchableOpacity>
          {/* Add the input field for the username (name) */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 400,
            marginVertical: 8
          }}>Username</Text>

          <View style={{
            width: "100%",
            height: 48,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 22
          }}>
            <TextInput
              placeholder='Enter your username'
              placeholderTextColor={COLORS.black}
              onChangeText={text => setName(text)} // Capture the input value in the state
              value={name} // Bind the input value to the state
              style={{
                width: "100%"
              }}
              onBlur={validateUsername} // Add onBlur validation for the username
            />
          </View>
          {usernameError ? (
            <Text style={{ color: 'red' }}>{usernameError}</Text>
          ) : null}
        </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Email address</Text>
        
                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your email address'
                            placeholderTextColor={COLORS.black}
                            keyboardType='email-address'
                            onChangeText={text => setEmail(text)} // Capture the input value in the state
                            value={email} // Bind the input value to the state
                            style={{
                                width: "100%"
                            }}
                            onBlur={validateEmail}
                        />
                    </View>
                    {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null}
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Mobile Number</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='+60'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "12%",
                                borderRightWidth: 1,
                                borderLeftColor: COLORS.grey,
                                height: "100%"
                            }}
                        />

                        <TextInput
                            placeholder='Enter your phone number'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "80%"
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Password</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your password'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            onChangeText={text => setPassword(text)} // Capture the input value in the state
                            value={password} // Bind the input value to the state
                            style={{
                                width: "100%"
                            }}
                            onBlur={validatePassword}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

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
                        onValueChange={setIsChecked}
                        color={isChecked ? COLORS.primary : undefined}
                    />

                    <Text>I agree to the terms and conditions</Text>
                </View>

                <Button
                    title="Sign Up"
                    filled
                    onPress={handleSignUp}
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
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
                    <Text style={{ fontSize: 14 }}>Or Sign up with</Text>
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
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Signup