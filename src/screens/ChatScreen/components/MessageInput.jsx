

// MessageItem.js
import React from 'react';
import { View, Text, Image, Card } from 'react-native';
import { Avatar } from 'react-native-paper';


function MessageList({ messages, currentImage, setCurrentImage, showModal }) {
    return (
        <ScrollView>
            {messages.map((message) => (
                <MessageItem
                    key={message.id}
                    message={message}
                    currentImage={currentImage}
                    setCurrentImage={setCurrentImage}
                    showModal={showModal}
                />
            ))}
        </ScrollView>
    );
}

function MessageItem({ message, currentImage, setCurrentImage, showModal }) {
    const handleImageClick = () => {
        if (message.image) {
            setCurrentImage(message.image);
            showModal();
        }
    };

    return (
        <View
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
                        flexDirection: 'column',
                    }}
                >
                    {message.text && (
                        <Text style={{ color: message.sender === 'User' ? 'black' : '#fff' }}>
                            {message.text}
                        </Text>
                    )}
                </View>
                {message.image && (
                    <View
                        style={{
                            padding: 10,
                            borderRadius: 8,
                            flexDirection: 'column',
                        }}
                    >
                        <Card onPress={handleImageClick}>
                            <Card.Cover source={{ uri: message.image }} />
                        </Card>
                    </View>
                )}
            </View>
        </View>
    );
}


function MessageInput({ newMessage, setNewMessage, handleSendMessage }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
            <TextInput
                style={{
                    flex: 1,
                    height: 60,
                    paddingHorizontal: 10,
                }}
                placeholder="Digite sua mensagem"
                value={newMessage}
                onChangeText={(text) => setNewMessage(text)}
            />
            <Button onPress={handleSendMessage}>Enviar</Button>
        </View>
    );
}


function ModalImage({ visible, hideModal, currentImage }) {
    return (
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
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
                        source={{ uri: currentImage }}
                    ></Image>
                </View>
            )}
        </Modal>
    );
}

export { ModalImage, MessageInput, MessageItem, MessageList };