import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import { APIClient } from './IAPIClient';

// Implementação do APIClient utilizando o axios

export class AxiosAPIClient implements APIClient {
    private client: AxiosInstance;
    private url: string;

    private inCloud = true;

    constructor() {
        this.client = axios.create();
        // Utilize 10.0.2.2 para conectar-se a apis localhost no simulador Android
        // Utlize localhost normalmente para conectar-se a apis no Simulador iOS
        if (!this.inCloud) {
            this.url = Platform.OS == 'ios' ? "http://localhost:8080/" : 'http://10.0.2.2:8080/'
        } else {
            this.url = Platform.OS == 'ios' ? "http://20.246.205.170:8080/" : 'http://20.246.205.170:8080/'
        }
    }

    public post(url: string, data: any, config: any): Promise<any> {
        return this.client.post(this.url + url, data, config);
    }

    public get(url: string, config: any): Promise<any> {
        return this.client.get(this.url + url, config);
    }
}
