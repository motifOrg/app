"use client"

// #region imports
import {
    useRef,
    useState,
    useTransition,
} from "react"

import {
    IconButton,
	TextArea,
} from "@/base"

import { useChat } from "@/context"
import { Send } from "@/icons"

import { chatAction } from "./action"
// #endregion

export const ChatForm = ({ companyId, placeholder }: {
    companyId: string
    placeholder?: string
}) => {
    const { addOptimistic } = useChat()
    const form = useRef<HTMLFormElement | null>(null)

    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const submit = (query: string) => {
        if (!query.trim()) {
            setError("Write a question or note first")
            return
        }

        setError(undefined)
        addOptimistic(query.trim(), "user")
        form.current?.reset()

        startTransition(async () => {
            const res = await chatAction(companyId, query.trim())
            if (!res.success) {
                setError(res.error ?? "Couldn't save the message")
                return
            }
            res.data
                .filter(message => message.sender === "ai")
                .forEach(message => addOptimistic(message.text, "ai"))
        })
    }

	return (
		<form
            ref={form}
            onSubmit={e => {
                e.preventDefault()
                const query = new FormData(e.currentTarget).get("query")
                submit(typeof query === "string" ? query : "")
            }}
			className="w-full flex items-start gap-2"
		>
			<TextArea
                fullWidth
                size="sm"
				name="query"
                rows={2}
				placeholder={placeholder ?? "Ask about this company or jot a research note"}
                onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        form.current?.requestSubmit()
                    }
                }}
                disabled={isPending}
				error={!!error}
				helperText={error}
                endIcon={
                    <IconButton
                        type="submit"
                        variant="fill"
                        size="sm"
                        loading={isPending}
                        aria-label="Send"
                    >
                        <Send size={14}/>
                    </IconButton>
                }
			/>
		</form>
	)
}
