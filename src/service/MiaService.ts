import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../@types/IUser';
import { APIClient } from '../client/IAPIClient';
import { IQuestion } from '../@types/IQuestion';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const addMessage = async (
    apiClient: APIClient,
    text: string,
    taskId: number,
    imageUrl?: string,
) => {
    return apiClient
        .post('steps', { description: text, task: { id: taskId }, imageUrl: imageUrl ?? '' }, {})
        .then(async response => {
            return response.data;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
};

export const createChat = async (apiClient: APIClient, title: string, userId: number, applicationId: number, createdAt: string, messages = []) => {
    return apiClient
        .post('tasks', {
            title,
            createdAt,
            application: { id: applicationId },
            user: { id: userId },
            steps: messages ?? []
        }, {})
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
};

export const getHistoryChat = async (apiClient: APIClient, userId: number) => {
    return apiClient
        .get('tasks/user/' + userId, {})
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
};

export const getChatMessages = async (apiClient: APIClient, chatId: number) => {
    return apiClient
        .get('steps', {})
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
};