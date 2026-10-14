// #region imports
import { Logo, Profile } from "@/icons"
import { CHAT_ROLES } from "@/lib"
// #endregion

export interface IMessageCard {
	message?: string
    sender?: CHAT_ROLES
}

const startChat = "chat chat-start w-full"
const endChat = "chat chat-end w-full"

const startWrapper = "self-start text-left flex-row"
const endWrapper = "self-end text-right flex-row-reverse"

export const MessageCard = ({
	message = "",
    sender = "ai",
}: IMessageCard) => {
    if (sender === "system")
        return (
            <p className="
                w-full text-center text-xs text-grey-200
                py-1 animate-fade-in
            ">
                {message}
            </p>
        )

    const end = sender === "user"

    return (
        <article
            className={`
                flex h-auto items-start gap-2
                w-full text-sm animate-fade-in
                ${end ? endWrapper : startWrapper}
            `}
        >
            <span
                data-end={end}
                className="
                    w-7 h-7 rounded-full shrink-0 flex
                    items-center justify-center
                    bg-mint-50 text-white
                    data-[end=true]:bg-grey-150
                    data-[end=true]:text-grey-300
                "
            >
                {
                    end
                        ? <Profile size={12}/>
                        : <Logo size={14} className="text-primary"/>
                }
            </span>

            <aside className={end ? endChat : startChat}>
                <p
                    data-end={end}
                    className="
                        chat-bubble min-h-0 px-3.5 py-2.5 whitespace-pre-wrap
                        data-[end=true]:bg-mint-50
                        data-[end=false]:bg-grey-150
                        text-charcoal-100 text-sm
                    "
                >
                    {message}
                </p>
            </aside>
        </article>
    )
}
