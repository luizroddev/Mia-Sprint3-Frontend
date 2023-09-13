import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../@types/RootStackParamList';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkToken, getUserByToken } from '../service/UserService';
import { AxiosAPIClient } from '../client/AxiosAPIClient';
import { AuthContext } from '../context/AuthContext';


type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation, route }: Props) {

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { setUser, setToken } = authContext;

    const [error, setError] = useState(route.params?.error || '')

    const alreadyLoggedIn = async () => {
        const isValid = await checkToken(new AxiosAPIClient()).catch(error => console.log(''))

        if (isValid) {
            const user = await getUserByToken(new AxiosAPIClient()).catch(error => console.log(''))
            user.name = user?.name[0].toUpperCase() + user?.name.substring(1, user.name.length)
            setUser(user)
            navigation.replace('Main')
        }
    }

    useEffect(() => {
        alreadyLoggedIn()
    }, [])

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Image source={require('../assets/imgs/Mia.png')}></Image>
                <Text style={styles.description} variant='titleLarge'>{`Domine a tecnologia\ncom a Mia como\ncompanhia!`}</Text>
            </View>

            <View style={styles.inputs}>
                <Button buttonColor='#7751DB' textColor='white'
                    contentStyle={{ padding: 8, width: '100%' }} mode='contained' onPress={() => navigation.navigate('Login')}>
                    Acessar minha conta
                </Button>
                <Button style={styles.registerButton} textColor='#7751DB'
                    contentStyle={{ padding: 8, width: '100%' }} mode="outlined" onPress={() => navigation.navigate('Register')}>
                    Criar minha conta
                </Button>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    header: {
        // flex: 1,
        alignItems: 'center',
        // textAlign: 'justify'
    },
    description: {
        marginTop: 8,
        textAlign: 'center',
        color: '#38188C'
    },
    registerButton: {
        borderColor: "#7751DB"
    },
    inputs: {
        rowGap: 10
    }
});
