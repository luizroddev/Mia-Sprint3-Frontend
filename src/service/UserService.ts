import AsyncStorage from '@react-native-async-storage/async-storage';
import { IQuestion } from '../@types/IQuestion';
import { APIClient } from '../client/IAPIClient';

export const login = async (
    apiClient: APIClient,
    email: string,
    senha: string,
) => {
    return apiClient
        .post('users/login', { email, password: senha }, {
        })
        .then(async response => {
            await AsyncStorage.setItem('token', response.data.token);
            return response.data;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
};


export const get = async (
    apiClient: APIClient,
    email: string,
    senha: string,
) => {
    return apiClient
        .post('users/login', { email, password: senha }, {
        })
        .then(async response => {
            await AsyncStorage.setItem('token', response.data.token);
            return response.data;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
};

export const register = async (apiClient: APIClient, { name, email, password }: any) => {
    return apiClient
        .post('users', { name, email, password }, {
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
};


export const getUserByToken = async (apiClient: APIClient) => {

    const token = await AsyncStorage.getItem('token');

    return apiClient
        .get('users/check/' + token, {
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
};

export const checkToken = async (apiClient: APIClient) => {

    const token = await AsyncStorage.getItem('token');

    return apiClient
        .get('users/check/' + token, {

        })
        .then(response => {
            return response.status == 200;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
};

export const askQuestion = async (apiClient: APIClient, question: IQuestion) => {

    const isValid = await checkToken(apiClient).catch(error => {
        throw new Error('Erro na requisição: ' + error.message)
    })

    if (!isValid) return

    const token = await AsyncStorage.getItem('token')

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    return apiClient
        .post('ask', question, { headers })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw new Error('Erro na requisição: ' + error.message);
        });
}




