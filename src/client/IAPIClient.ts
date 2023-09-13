export interface APIClient {
    post(url: string, data: any, config: any): Promise<any>;
    get(url: string, config: any): Promise<any>;
}
