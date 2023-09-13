import { Chat } from "./IChat";

export type RootStackParamList = {
    Home: { error: string } | undefined;
    Register: undefined;
    Login: { email?: string; senha?: string, error?: string } | undefined;
    Chat: { chat: Chat } | undefined;
    Main: undefined;
};
