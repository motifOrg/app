"use client"

// #region imports
import {
    useEffect,
    useRef,
} from "react"

import { useChat } from "@/context"
import { MessageCard } from "./MessageCard"
// #endregion

export const MessageCarousel = () => {
    const { messages } = useChat()
    const end = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        end.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages.length])

    return (
        <div className="
            w-full flex flex-col gap-3
            overflow-y-auto h-full pr-1
        ">
            {messages.map((message) => (
                <MessageCard
                    key={message.id}
                    message={message.text}
                    sender={message.sender}
                />
            ))}
            <div ref={end}/>
        </div>
    )
}
