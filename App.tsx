import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import {
    configureFonts, MD3LightTheme,
    PaperProvider
} from 'react-native-paper';
import { RootStackParamList } from './src/@types/RootStackParamList';
import { AuthProvider } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ChatScreen from './src/screens/ChatScreen/ChatScreen';
import MainScreen from './src/screens/MainScreen';

const Stack = createStackNavigator<RootStackParamList>();

const fontConfig = {
    fontFamily: 'Sora-Medium',
};

export default function App() {
    const theme = {
        ...MD3LightTheme,
        fonts: configureFonts({ config: fontConfig }),
    };

    return (
        <PaperProvider theme={theme}>
            <AuthProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen name="Home" component={HomeScreen} options={{
                            headerShown: false, headerTitle: '',
                        }} />
                        <Stack.Screen name="Main" component={MainScreen} options={{
                            headerShown: false, headerTitle: '',
                        }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{
                            headerTitle: 'Crie sua conta', headerStyle: {
                                backgroundColor: 'white',
                                borderColor: 'white'
                            }
                        }} />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            initialParams={{ email: '', senha: '' }}
                            options={{
                                headerTitle: 'Acessar sua conta', headerStyle: {
                                    backgroundColor: 'white',
                                    borderColor: 'white'
                                },
                            }}
                        />
                        <Stack.Screen name="Chat" component={ChatScreen} options={{
                            headerTitle: 'Chat', headerStyle: {
                                backgroundColor: 'white',
                                borderColor: 'white'
                            }
                        }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </AuthProvider>
        </PaperProvider>
    );
}
