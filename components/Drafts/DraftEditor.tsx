"use client"

// #region imports
import {
    useState,
    useTransition,
} from "react"

import {
    Button,
    Information,
    TextArea,
    TextField,
    Tooltip,
} from "@/base"

import {
    Check,
    Delete,
    Lock,
    Send,
} from "@/icons"

import {
    cn,
    IDraft,
    timeAgo,
} from "@/lib"

import {
    deleteDraftAction,
    updateDraftAction,
} from "./actions"
// #endregion

export const DraftEditor = ({ draft }: { draft: IDraft }) => {
    const [recipient, setRecipient] = useState<string>(draft.recipient)
    const [subject, setSubject] = useState<string>(draft.subject)
    const [body, setBody] = useState<string>(draft.body)
    const [status, setStatus] = useState(draft.status)
    const [error, setError] = useState<string>()
    const [copied, setCopied] = useState<boolean>(false)
    const [confirming, setConfirming] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()

    const dirty =
        recipient !== draft.recipient ||
        subject !== draft.subject ||
        body !== draft.body

    const reviewed = status === "reviewed" && !dirty

    const save = (next?: "reviewed") => startTransition(async () => {
        setError(undefined)
        const res = await updateDraftAction(draft.id, {
            recipient,
            subject,
            body,
            ...(next ? { status: next } : {}),
        })
        if (!res.success) {
            setError(res.error ?? "Couldn't save the draft")
            return
        }
        setStatus(res.draft?.status ?? (next ?? "draft"))
    })

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(
                `To: ${recipient}\nSubject: ${subject}\n\n${body}`
            )
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            setError("Clipboard access was blocked by the browser")
        }
    }

    const remove = () => startTransition(async () => {
        const res = await deleteDraftAction(draft.id)
        if (!res.success) setError(res.error ?? "Couldn't delete the draft")
    })

    return (
        <article className="flex flex-col gap-4">
            <header className="
                flex items-center justify-between 
                gap-3 flex-wrap
            ">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "inline-flex items-center gap-1 h-6 px-2 rounded-md text-xs font-semibold",
                        reviewed ? 
                        "bg-mint-100 text-mint-300" : 
                        "bg-amber-100 text-amber-200"
                    )}>
                        {reviewed && <Check size={9}/>}
                        {
                            reviewed ? "Reviewed" : 
                                dirty ? "Unsaved changes" : 
                                    "Draft · needs review"
                        }
                    </span>
                    <span className="text-xs text-grey-200">
                        Saved {timeAgo(draft.updatedAt)}
                    </span>
                </div>

                {
                    confirming ?
                    <span className="
                        flex items-center gap-1.5 
                        text-xs
                    ">
                        Delete this draft?
                        <Button 
                            variant="danger"
                            size="xs" 
                            onClick={remove} 
                            loading={isPending}
                        >
                            Delete
                        </Button>
                        <Button 
                            variant="ghost"
                            size="xs" 
                            onClick={() => setConfirming(false)}
                        >
                            Keep
                        </Button>
                    </span> :
                    <Button
                        variant="danger"
                        size="xs"
                        startIcon={<Delete size={11}/>}
                        onClick={() => setConfirming(true)}
                    >
                        Delete
                    </Button>
                }
            </header>

            <div className="flex flex-col gap-1">
                <TextField
                    label="To"
                    value={recipient}
                    placeholder="owner@company.com"
                    onChange={e => setRecipient(e.target.value)}
                />
                <TextField
                    label="Subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                />
                <TextArea
                    label="Message"
                    rows={12}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    helperText={`${body.length} characters`}
                />
            </div>

            {error && <Information variant="error" description={error}/>}

            <footer className="flex items-center gap-2 flex-wrap">
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={!dirty}
                    loading={isPending && dirty}
                    loadingText="Saving"
                    onClick={() => save()}
                >
                    Save draft
                </Button>
                <Button
                    variant="neutral"
                    size="sm"
                    disabled={reviewed || !subject.trim() || !body.trim()}
                    startIcon={<Check size={10}/>}
                    onClick={() => save("reviewed")}
                >
                    {reviewed ? "Reviewed" : "Mark as reviewed"}
                </Button>

                <span className="flex-1"/>

                <Tooltip content={
                    reviewed ? 
                    "Copy the reviewed email to paste into your mail client" : 
                    "Review the draft before copying it"
                }>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!reviewed}
                        onClick={copy}
                    >
                        {copied ? "Copied" : "Copy email"}
                    </Button>
                </Tooltip>
                <Tooltip content="Motif doesn't send email. Connect Gmail and review the draft first. Sending is planned, not built.">
                    <Button
                        size="sm"
                        disabled
                        startIcon={<Lock size={10}/>}
                        endIcon={<Send size={11}/>}
                    >
                        Send
                    </Button>
                </Tooltip>
            </footer>
        </article>
    )
}
