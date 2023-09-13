import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Modal, Portal, Text } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/RootStackParamList';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { askQuestion, checkToken } from '../../service/UserService';
import { AxiosAPIClient } from '../../client/AxiosAPIClient';
import { addMessage, createChat, getChatMessages } from '../../service/MiaService';
import { AuthContext } from '../../context/AuthContext';
import { useIsFocused } from "@react-navigation/native";
import { ChatMessage } from '../../@types/IChat';

type Props = StackScreenProps<RootStackParamList, 'Chat'>;

interface Message {
    id: number;
    text: string;
    sender: 'Mia' | 'User';
    image?: string;
}


export default function ChatScreen({ navigation, route }: Props) {

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [miaResponse, setMiaResponse] = useState<IAnswer>({} as IAnswer);
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = useState(false)
    const [task, setTask] = useState<any>()

    const [storedMessages, setStoredMessages] = useState<number[]>([])

    const [error, setError] = useState('');

    const [currentImage, setCurrentImage] = useState('')

    const scrollViewRef = useRef<ScrollView | null>(null);

    let hasMessageHistory = route.params?.chat

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user } = authContext;

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    const hasValidToken = async () => {
        const isValid = await checkToken(new AxiosAPIClient()).then(valid => {
            return valid
        }).catch(error => {
            console.error("Erro na validação do token: " + error)
            return false
        })

        return isValid
    }

    const [isFirstMessage, setIsFirstMessage] = useState(true)
    const canSendMessage = !loading

    const sendMessage = async (sender: 'Mia' | 'User', text?: string, imageUrl?: string) => {
        if (!canSendMessage) return

        const isValid = await hasValidToken()
        if (!isValid) {
            navigation.replace("Login", { error: "Sua sessão expirou, logue novamente" })
            return
        }

        setMessages(messages => {
            setIsFirstMessage(messages.length == 0)
            const messageObj = {
                id: messages.length + 1,
                text: text ?? newMessage,
                image: imageUrl ?? '',
                sender
            }
            setStoredMessages(storedMessages => [...storedMessages, messageObj.id])
            return [...messages, messageObj]
        })

        if (sender == 'User') {
            setLoading(true)
            askQuestionToMia(newMessage)
        } else {
            setLoading(false)
        }

        setNewMessage('')
    }

    const storeMessageData = async (text: string, imageUrl?: string) => {
        try {
            if (user) {
                if (!task) {
                    console.error("Não foi possível encontrar a conversa", task);
                    return
                }
                await addMessage(new AxiosAPIClient(), text, task.id, imageUrl ?? '');
            }
        } catch (error) {
            console.error('Erro ao adicionar mensagem ao chat:', error);
        }
    }

    const createNewChat = async () => {
        try {
            if (user) {
                await createChat(new AxiosAPIClient(), newMessage, user?.id, 1, new Date().toISOString()).then(task => {
                    setTask(task);
                });
            }
        } catch (error) {
            console.error('Erro ao criar chat:', error);
            navigation.replace('Main')
        }
    }

    const askQuestionToMia = (question: string) => {
        askQuestion(new AxiosAPIClient(), { app: 'Whatsapp', text: question })
            .then(async result => {
                setMiaResponse(result)
                await updateMessages(result)
            })
            .catch(error => {
                setError(error.message);
                sendMessage('Mia', error.message)
                console.error('Erro ao tentar fazer login:', error.message);
            });
    }

    const updateMessages = async (miaResponse: IAnswer) => {
        const miaImages = miaResponse.images ? Object.values(miaResponse.images.screens.images) : []

        const answers = miaResponse.steps ? Object.keys(miaResponse.steps.steps) : []

        if (answers.length == 0) {
            sendMessage('Mia', 'Desculpe, não consegui montar uma explicação para essa tarefa. :(')
        }

        answers.map(async (message, index) => {
            const messageImage = index > miaImages.length ? '' : miaImages[index]
            await sendMessage('Mia', message, messageImage)
        })
    }

    useEffect(() => {
        setTimeout(() => {
            scrollToBottom()
        }, 100);
    }, [messages])

    useEffect(() => {

        setIsFirstMessage(messages.length == 0)

        if (isFirstMessage && newMessage.length > 0) {
            createNewChat()
        }

        if (!task) return

        storedMessages.map((messageId) => {
            const message = messages.find(message => message.id == messageId)

            if (message) {
                const formatedText = (message.sender == 'Mia' ? "*" : "-") + message.text
                storeMessageData(formatedText, message.image)
                const newStoredMessages = storedMessages.filter(id => id != message.id)
                setStoredMessages(newStoredMessages)
            }
        })
    }, [task, messages])

    useEffect(() => {
        if (user && hasMessageHistory && messages.length == 0) {
            const chat = route.params?.chat
            if (chat) {
                const { ...currentTask } = chat
                setTask(currentTask)

                getChatMessages(new AxiosAPIClient(), chat.id).then((steps: ChatMessage[]) => {
                    const chatMessages = steps.filter(step => step.task.id == currentTask.id)
                    chatMessages.map((step: ChatMessage) => {
                        const isUser = step.description.includes("*") ? 'Mia' : 'User'
                        setMessages(messages => [...messages, {
                            id: step.id,
                            sender: isUser,
                            text: step.description.replace('*', "").replace("-", ""),
                            image: step.imageUrl ?? ''
                        }])
                    })
                })
            }
        }
    }, [user, messages])

    return (
        <View style={styles.container}>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {currentImage && (
                        <View style={{ width: 500, height: 500 }}>
                            <Image
                                resizeMode='contain'
                                resizeMethod='resize'
                                style={{
                                    backgroundColor: 'black',
                                    flex: 1,
                                    width: undefined,
                                    height: undefined,
                                }}
                                source={{ uri: currentImage }}></Image>
                        </View>

                    )}
                </Modal>
            </Portal>
            <ScrollView ref={scrollViewRef}>
                {messages.map((message) => (
                    <View
                        key={message.id}
                        style={{
                            flexDirection: message.sender === 'User' ? 'row-reverse' : 'row',
                            width: '100%',
                            alignItems: 'flex-start',
                            marginBottom: 10,
                        }}
                    >
                        <Avatar.Text size={30} label={message.sender[0]} />
                        <View style={{ flexDirection: 'column', maxWidth: '80%' }}>
                            <View
                                style={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                    backgroundColor: message.sender !== 'User' ? '#7751DB' : '#ddd',
                                    padding: 10,
                                    borderRadius: 8,
                                    flexDirection: 'column'
                                }}
                            >
                                {message.text && (
                                    <Text style={{ color: message.sender === 'User' ? 'black' : '#fff' }}>
                                        {message.text}
                                    </Text>
                                )}
                            </View>
                            {message.image && (<View
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    flexDirection: 'column',
                                }}
                            >
                                <Card onPress={() => {
                                    if (message.image) {
                                        setCurrentImage(message.image)
                                        showModal()
                                    }
                                }}>
                                    <Card.Cover
                                        source={{ uri: message.image }} />
                                </Card>

                            </View>
                            )}
                        </View>
                    </View>
                ))
                }
                {loading && (
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            alignItems: 'flex-start',
                            marginBottom: 10,
                        }}
                    >
                        <Avatar.Text size={30} label={'M'} />
                        <View style={{ flexDirection: 'column', maxWidth: '80%' }}>
                            <View
                                style={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                    backgroundColor: '#7751DB',
                                    padding: 10,
                                    borderRadius: 8,
                                    flexDirection: 'column'
                                }}
                            >
                                <Text>
                                    <ActivityIndicator animating={true} color={'#fff'} />
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView >
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                <TextInput
                    editable={canSendMessage}
                    style={{
                        flex: 1, height: 60, paddingHorizontal: 10
                    }}
                    selectTextOnFocus={canSendMessage}
                    placeholder="Digite sua mensagem"
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <Button onPress={() => sendMessage('User')}>Enviar</Button>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 8,
        rowGap: 8
    },
    header: {
        alignItems: 'center',
    },
    description: {
        marginTop: 8,
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
    },
    registerButton: {
        borderColor: 'white',
        borderWidth: 2
    },
    inputs: {
        rowGap: 10,
    },
});
