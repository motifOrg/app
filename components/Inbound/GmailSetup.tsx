"use client"

// #region imports
import {
    useState,
    useTransition,
} from "react"

import { useRouter } from "next/navigation"

import {
    Button,
    Information,
    Modal,
} from "@/base"

import { Mail, Refresh } from "@/icons"
import { IIntegrations } from "@/lib"

import { syncGmailAction } from "./actions"
// #endregion

export const GmailSetup = ({ gmail, campaignId }: { 
    gmail: IIntegrations["gmail"]
    campaignId: string
}) => {
    const [open, setOpen] = useState<boolean>(false)
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const sync = () => {
        if (!gmail.connected) {
            setOpen(true)
            return
        }
        startTransition(async () => {
            setError(undefined)
            const res = await syncGmailAction(campaignId)
            if (!res.success) {
                setError(res.error ?? "Sync failed")
                return
            }

            router.refresh()
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
                            Gmail sync reads messages from the label in
                            <code className="mx-1">GMAIL_LABEL</code>
                            (default INBOX) using a refresh token in
                            <code className="mx-1">core/.env</code>.
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
                            {gmail.status === "setup_required"
                                ? "Setup required"
                                : "Not connected"}
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
                            "Create an OAuth client in Google Cloud with the Gmail readonly scope",
                            "Add GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET and GMAIL_REFRESH_TOKEN to core/.env",
                            "Optional: GMAIL_LABEL (e.g. INBOX or a custom label name), then restart the API",
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
