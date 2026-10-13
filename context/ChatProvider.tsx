"use client"

// #region imports
import {
    createContext,
    useCallback,
    useContext,
    useState,
} from "react"

import { IMessage } from "@/lib"
// #endregion

export interface IChatContext {
    messages: IMessage[],
    setMessages: (messages: IMessage[]) => void,
    addOptimistic: (
        body: string,
        role: "ai" | "user"
    ) => void
}


const ChatContext = createContext<IChatContext | null>(null)
export const ChatProvider = ({children, initial = []}: {
    children: React.ReactNode
    initial?: IMessage[]
}) => {
    const [messages, setMessages] = useState<IMessage[]>(initial)

    const addOptimistic = useCallback(
        (
            body: string,
            role: "ai" | "user"
        ) => {
            setMessages(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    text: body,
                    sender: role,
                    createdAt: new Date(),
                }
            ])
        },
        [setMessages]
    )

    const value = {
        messages,
        setMessages,
        addOptimistic
    }


    return (
        <ChatContext.Provider
            value={value}
        >
            {children}
        </ChatContext.Provider>
    )
}


export const useChat = () => {

    const context =
        useContext(ChatContext)

    if (!context) {
        throw new Error(
            "useChat must be used within ChatProvider"
        )
    }

    return context
}