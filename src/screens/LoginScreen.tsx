import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, TextInput, IconButton, Text } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../@types/RootStackParamList';

import { AuthContext } from '../context/AuthContext';
import { AxiosAPIClient } from '../client/AxiosAPIClient';
import { login } from '../service/UserService';
import { IUser } from '../@types/IUser';
import { ScrollView } from 'react-native-gesture-handler';
import { validateEmail } from '../utils/validationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
    const [email, setEmail] = useState(route.params?.email || '');
    const [password, setPassword] = useState(route.params?.senha || '');
    const [showPassword, setShowPassword] = useState(true);

    const [error, setError] = useState<string | null>(route.params?.error || '');

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { setUser, setToken } = authContext;

    const handleLogin = () => {
        if (email == '' || password == '') {
            setError('Preencha todos os campos');
            return;
        }

        if (!validateEmail(email)) {
            setError('Digite um email válido');
            return;
        }

        login(new AxiosAPIClient(), email, password)
            .then(result => {
                setToken(result.token);
                result.name = result.name[0].toUpperCase() + result.name.substring(1, result.name.length)
                setUser(result);
                navigation.replace('Main');
            })
            .catch(error => {
                console.error('Erro ao tentar fazer login:', error.message);
                setError(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Image source={require('../assets/imgs/Mia.png')}></Image>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.description} variant="headlineLarge">Seja bem-vindo de volta</Text>
                    <Text style={[styles.description, styles.descriptionLight]} variant="bodyLarge" >É um prazer ver você de novo.</Text>
                </View>

                <View style={styles.inputs}>
                    <TextInput
                        outlineStyle={{ borderWidth: 2, backgroundColor: 'white' }}
                        textColor='#7519D1'
                        mode='outlined'
                        activeOutlineColor='#7519D1'
                        outlineColor='#7519D1'
                        label='Seu email'
                        value={email}
                        onChangeText={setEmail}
                        theme={{ colors: { onSurfaceVariant: '#7519D1' } }}
                        left={<TextInput.Icon icon="email" iconColor='#7519D1' />}
                    />

                    <TextInput
                        outlineStyle={{ borderWidth: 2, backgroundColor: 'white' }}
                        textColor='#7519D1'
                        mode='outlined'
                        activeOutlineColor='#7519D1'
                        outlineColor='#7519D1'
                        label='Sua senha'
                        value={password}
                        secureTextEntry={showPassword}
                        onChangeText={setPassword}
                        theme={{ colors: { onSurfaceVariant: '#7519D1' } }}
                        left={<TextInput.Icon icon="lock" iconColor='#7519D1' />}
                        right={<TextInput.Icon iconColor='#7519D1' icon={showPassword ? 'eye' : 'eye-off'} onPress={() => setShowPassword(!showPassword)} />} />
                    {error && (
                        <Text style={{ borderRadius: 4, backgroundColor: '#e64b4b', padding: 8, color: 'white' }} variant="labelMedium">
                            Ocorreu o erro: {error}
                        </Text>
                    )}
                    <Button
                        style={{ width: '100%', borderRadius: 16 }}
                        contentStyle={{ height: 56 }}
                        mode="contained"
                        buttonColor='#9153E1'
                        textColor='white'
                        onPress={handleLogin}
                    >
                        Acessar minha conta</Button>
                </View>
            </ScrollView>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        fontFamily: "Sora-Bold",
        marginTop: 16,
        backgroundColor: 'white'
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    descriptionContainer: {
        marginTop: 56,
        justifyContent: 'flex-start',
        padding: 16
    },
    description: {
        color: '#7519D1',
        fontFamily: 'Sora-SemiBold'
    },
    descriptionLight: {
        fontFamily: 'Sora-Light'
    },
    inputs: {
        padding: 16,
        rowGap: 32,
    }
});
