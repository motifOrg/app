
"use client"

import { useChat } from "@/context"
import { Sparkle } from "@/icons"
import { MessageCarousel } from "../Chat"
import { ChatForm } from "../Forms"


export const Chat = ({ companyId, enabled }: {
    companyId: string
    enabled: boolean
}) => {
    const { messages } = useChat()

    return (
        <aside className="
            rounded-2xl bg-paper ring-1 ring-grey-100 
            flex flex-col h-[calc(100vh-4rem)] sticky 
            top-8 max-tablet:static max-tablet:h-140
        ">
            <section className="
                px-4 pt-2 pb-3 border-b border-grey-150 
                flex flex-col gap-2
            ">
                <aside className="
                    flex items-center 
                    justify-between
                ">
                    <h2 className="font-bold">
                        Research assistant
                    </h2>
                    <span className={enabled
                        ? "text-xs font-semibold text-mint-300"
                        : "text-xs font-semibold text-grey-200"
                    }>
                        {enabled ? "Connected" : "Not connected"}
                    </span>
                </aside>

                {!enabled && (
                    <p className="
                        text-xs text-grey-300 
                        bg-default rounded-lg px-3 py-2
                    ">
                        No AI provider is configured, so messages are saved as notes and nothing replies.
                        Set up the research provider to get answers here.
                    </p>
                )}
            </section>

            <section className="
                flex-1 min-h-0 px-4 py-3
            ">
                {messages.length ? 
                    <MessageCarousel /> :
                    <aside className="
                        h-full flex flex-col items-center 
                        justify-center text-center 
                        gap-2 px-6
                    ">
                        <span className="
                            w-9 h-9 rounded-full bg-mint-50 
                            text-mint-300 flex 
                            items-center justify-center
                        ">
                            <Sparkle size={14} />
                        </span>

                        <p className="font-bold">
                            Research thread
                        </p>
                        
                        <p className="text-xs text-grey-200">
                            {enabled
                                ? "Ask about ownership, customers or risks. Answers cite the findings on this page."
                                : "Keep questions and notes about this company here. They're saved to the record."}
                        </p>
                    </aside>
                }
            </section>

            <section className="p-3">
                <ChatForm
                    companyId={companyId}
                    placeholder={enabled ? undefined : "Add a note or question for later"}
                />
            </section>
        </aside>
    )
}
