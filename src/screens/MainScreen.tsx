import React, { useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, IconButton, MD3Colors, Text } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../@types/RootStackParamList';
import { AuthContext } from '../context/AuthContext';
import { getHistoryChat } from '../service/MiaService';
import { AxiosAPIClient } from '../client/AxiosAPIClient';
import { ScrollView } from 'react-native-gesture-handler';
import { Chat, ChatMessage } from '../@types/IChat';
import { useIsFocused } from "@react-navigation/native";


type Props = StackScreenProps<RootStackParamList, 'Main'>;

export default function MainScreen({ navigation }: Props) {

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, signOut } = authContext;

    const [chats, setChats] = useState<Chat[]>([])
    const [loaded, setLoaded] = useState(false)

    const isFocused = useIsFocused();

    useEffect(() => {
        if (user && !loaded) {
            getHistoryChat(new AxiosAPIClient(), user.id).then(chatHistory => {
                setChats(chatHistory)
                setLoaded(true)
            })
        }
    }, [user, isFocused, chats])

    return (
        <View style={styles.container}>

            <View style={{ width: '100%', flexDirection: 'row-reverse' }}>
                <IconButton
                    icon="logout"
                    iconColor={'#9153E1'}
                    size={32}
                    onPress={() => {
                        signOut()
                        navigation.replace('Home')
                    }}
                />
            </View>

            <View style={styles.header}>
                <Image style={{ maxHeight: '30%' }} resizeMode='contain' source={require('../assets/imgs/MiaPhone.png')}></Image>

                <View style={{ width: '100%', alignItems: 'flex-start' }}>
                    <Text style={{ fontFamily: 'Sora-Regular', ...styles.description }} variant='bodyLarge'>{`Olá, ` + user?.name ?? 'Usuário'}</Text>
                    <Text style={{ fontFamily: 'Sora-Medium', ...styles.description }} variant='titleLarge'>{`Com qual tarefa
posso te ajudar hoje?`}</Text>
                </View>

                <View style={{ maxHeight: '30%' }}>
                    <Text variant='titleLarge' style={{
                        color: '#7519D1',
                        fontFamily: 'Sora-Bold',
                        alignItems: 'flex-start',
                        width: '100%',
                        marginBottom: 16
                    }}>CONVERSAS RECENTES</Text>
                    <ScrollView style={{ width: '100%' }}
                        contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        {chats.length > 0 ? chats.map((chat) => {
                            return <Button key={chat.id}
                                icon="chevron-right"
                                contentStyle={{ flexDirection: 'row-reverse' }}
                                mode='contained-tonal'
                                style={{ width: '100%', alignItems: 'flex-start', paddingVertical: 8, borderRadius: 4, marginBottom: 4 }} onPress={() => {
                                    navigation.navigate("Chat", { chat: chat })
                                }}>{chat.title}</Button>
                        })
                            :
                            <Text variant='labelLarge' style={{ color: MD3Colors.neutral60 }}>Nenhuma conversa recente ainda, fale com a Mia. =D</Text>}
                    </ScrollView>
                </View>
            </View>

            <Button buttonColor='#7751DB' textColor='white'
                contentStyle={{ padding: 8, width: '100%' }} mode='contained' onPress={() => navigation.navigate('Chat')}>
                Iniciar uma nova conversa
            </Button>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    header: {
        width: '100%',
        justifyContent: 'space-around',
        rowGap: 24,
        alignItems: 'flex-start',
        padding: 24
    },
    description: {
        width: '100%',
        alignItems: 'flex-start',
        marginTop: 8,
        color: '#7519D1',
    },
    registerButton: {
        borderColor: "#7751DB"
    },
    inputs: {
        rowGap: 10
    }
});
