export type CHAT_ROLES = "ai" | "user" | "system"

export interface IRawMessage {
    id: string
    body: string
    created_at: string
    sender_role: CHAT_ROLES
}

export interface IMessage {
    id: string
    text: string
    createdAt: Date
    sender: CHAT_ROLES
}

export const serializeMessage = (
    message: IRawMessage
): IMessage => {
    return {
        id: message?.id,
        text: message?.body,
        sender: message?.sender_role,
        createdAt: new Date(message?.created_at),
    }
}
