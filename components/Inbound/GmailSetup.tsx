"use client"

// #region imports
import {
    useState,
    useTransition,
} from "react"

import {
    Button,
    Information,
    Modal,
} from "@/base"

import { Mail, Refresh } from "@/icons"
import { IIntegrations } from "@/lib"

import { syncGmailAction } from "./actions"
// #endregion

export const GmailSetup = ({ gmail }: { 
    gmail: IIntegrations["gmail"]
}) => {
    const [open, setOpen] = useState<boolean>(false)
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const sync = () => {
        if (!gmail.connected) {
            setOpen(true)
            return
        }
        startTransition(async () => {
            setError(undefined)
            const res = await syncGmailAction()
            if (!res.success) 
                setError(res.error ?? "Sync failed")
        })
    }

    return (
        <>
            <Button
                variant="secondary"
                size="sm"
                startIcon={<Refresh size={12}/>}
                loading={isPending}
                loadingText="Syncing"
                onClick={sync}
            >
                Sync Gmail
            </Button>

            {
                error && 
                <Information 
                    variant="error"
                    description={error}
                />
            }

            <Modal 
                open={open} 
                onClose={() => setOpen(false)} 
                title="Connect Gmail" 
                size="md"
            >
                <section className="flex flex-col gap-5">
                    <aside className="flex items-start gap-3">
                        <span className="
                            w-10 h-10 rounded-xl bg-mint-50 
                            text-mint-300 flex items-center 
                            justify-center shrink-0
                        ">
                            <Mail size={16}/>
                        </span>
                        <p className="text-grey-300">
                            Gmail sync will pull broker and owner emails into this list and check them against the campaign ICP.
                            It isn&apos;t live yet, so Motif doesn&apos;t read your inbox or show fake messages.
                        </p>
                    </aside>

                    <aside className="
                        rounded-xl ring-1 ring-grey-100 
                        p-4 flex flex-col gap-3
                    ">
                        <span className="text-caption">
                            Status
                        </span>

                        <p className="font-bold">
                            {
                                gmail.status === "setup_required" ? 
                                "Setup required" : 
                                "OAuth client not built"
                            }
                        </p>
                        
                        <p className="text-grey-300 text-xs">
                            {gmail.message}
                        </p>

                        {
                            gmail.missingEnv.length > 0 &&
                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs text-grey-300">
                                    Missing in <code>core/.env</code>:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {gmail.missingEnv.map(name =>
                                        <code 
                                            key={name} 
                                            className="
                                                text-[11px] bg-grey-150 
                                                rounded px-1.5 py-0.5
                                            "
                                        >
                                            {name}
                                        </code>
                                    )}
                                </div>
                            </div>
                        }
                    </aside>

                    <ol className="flex flex-col gap-2">
                        {[
                            "Create an OAuth client in Google Cloud with the gmail.readonly scope",
                            "Set the Gmail client ID, secret, redirect URL and a 32-byte TOKEN_ENCRYPTION_KEY",
                            "Build the provider behind the MailProvider interface. Tokens must be encrypted at rest",
                        ].map((step, index) =>
                            <li key={step} className="flex gap-3">
                                <span className=" pt-0.5">{String(index + 1).padStart(2, "0")}</span>
                                <span>{step}</span>
                            </li>
                        )}
                    </ol>

                    <Information
                        variant="neutral"
                        description="Until then, use Log a deal to add inbound emails by hand."
                    />

                    <Button
                        className="self-end"
                        size="sm"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </Button>
                </section>
            </Modal>
        </>
    )
}
