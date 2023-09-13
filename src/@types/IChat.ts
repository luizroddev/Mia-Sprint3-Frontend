export interface Chat {
    id: number;
    title: string;
    createdAt: string;
    application: {
        id: number;
        name: string;
        description: string;
        figmaId: string;
    };
    steps: ChatMessage[]; // Array de objetos Step
}

export interface ChatMessage {
    id: number;
    description: string;
    imageUrl: string | null; // Use 'string' ou 'null' dependendo dos dados reais
    task: { id: number }
}
