"use client"

// #region imports
import {
    useState,
    useTransition,
} from "react"

import {
    Dropzone,
    IconButton,
    Progress,
    Tooltip,
} from "@/base"

import {
    Check,
    Delete,
    Document,
    Info,
} from "@/icons"

import {
    _DOCUMENT_TYPES,
    _MAX_UPLOAD_MB,
} from "@/constants"

import {
    cn,
    formatBytes,
    formatDate,
    IDocument,
} from "@/lib"

import {
    deleteDocumentAction,
    refreshAction,
    uploadDocumentAction,
} from "./actions"
// #endregion

export interface IQueuedFile {
    id: string
    file: File
    state: "queued" | "uploading" | "done" | "failed"
    error?: string
}

const _EXTENSIONS = _DOCUMENT_TYPES.split(",")

export const checkFile = (file: File): string | undefined => {
    const name = file.name.toLowerCase()
    if (!_EXTENSIONS.some(ext => name.endsWith(ext)))
        return "Only PDF, PowerPoint or Keynote files"
    if (file.size > _MAX_UPLOAD_MB * 1_048_576)
        return `Larger than ${_MAX_UPLOAD_MB} MB`
    if (file.size === 0)
        return "File is empty"
    return undefined
}

export const queueFiles = (files: File[]): IQueuedFile[] =>
    files.map(file => {
        const error = checkFile(file)
        return {
            id: crypto.randomUUID(),
            file,
            state: error ? "failed" : "queued",
            error,
        }
    })

export const FileRow = ({ name, size, meta, state, error, onRemove }: {
    name: string
    size: number
    meta?: string
    state?: IQueuedFile["state"] | "stored"
    error?: string
    onRemove?: () => void
}) => (
    <li className="flex items-center gap-3 py-2.5 border-b border-grey-150 last:border-0">
        <span className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
            state === "failed" ? "bg-grey-150 text-error-200" : "bg-mint-50 text-mint-300"
        )}>
            <Document size={15}/>
        </span>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
            <span className="font-semibold truncate">{name}</span>
            {
                state === "uploading"
                    ? <Progress className="w-40! h-1!"/>
                    : <span className={cn("text-xs", state === "failed" ? "text-error-200" : "text-grey-200")}>
                        {error ?? [formatBytes(size), meta].filter(Boolean).join(" · ")}
                    </span>
            }
        </div>
        {
            state === "done" &&
            <span className="text-xs font-semibold text-mint-300 flex items-center gap-1">
                <Check size={10}/> Uploaded
            </span>
        }
        {
            state === "stored" &&
            <Tooltip content="Stored for this campaign. Text extraction isn't built yet, so Motif doesn't read the contents.">
                <span className="text-xs font-semibold text-grey-200 flex items-center gap-1 cursor-help">
                    <Info size={10}/> Not parsed
                </span>
            </Tooltip>
        }
        {
            onRemove && state !== "uploading" &&
            <IconButton
                variant="ghost"
                size="xs"
                type="button"
                aria-label={`Remove ${name}`}
                onClick={onRemove}
            >
                <Delete size={12}/>
            </IconButton>
        }
    </li>
)

export const Documents = ({ campaignId, documents }: {
    campaignId: string
    documents: IDocument[]
}) => {
    const [queue, setQueue] = useState<IQueuedFile[]>([])
    const [removing, setRemoving] = useState<string>()
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const patch = (id: string, next: Partial<IQueuedFile>) =>
        setQueue(prev => prev.map(item => item.id === id ? { ...item, ...next } : item))

    const upload = (files: File[]) => {
        const added = queueFiles(files)
        setQueue(prev => [...added, ...prev])

        startTransition(async () => {
            for (const item of added) {
                if (item.state === "failed") continue
                patch(item.id, { state: "uploading" })
                const form = new FormData()
                form.append("file", item.file)
                const res = await uploadDocumentAction(campaignId, form)
                patch(item.id, res.success
                    ? { state: "done" }
                    : { state: "failed", error: res.error ?? "Upload failed" }
                )
            }
            await refreshAction()
            setQueue(prev => prev.filter(item => item.state !== "done"))
        })
    }

    const remove = (id: string) => startTransition(async () => {
        setRemoving(id)
        setError(undefined)
        const res = await deleteDocumentAction(id)
        if (!res.success) setError(res.error ?? "Couldn't delete the file")
        setRemoving(undefined)
    })

    return (
        <div className="flex flex-col gap-4">
            <Dropzone
                multiple
                accept={_DOCUMENT_TYPES}
                disabled={isPending && !removing}
                title="Drop your thesis deck, CIM template or notes"
                hint={`PDF, PPT, PPTX or Keynote · up to ${_MAX_UPLOAD_MB} MB each`}
                onFiles={upload}
            />

            {error && <p className="text-xs text-error-200">{error}</p>}

            {
                (queue.length > 0 || documents.length > 0) &&
                <ul className="flex flex-col">
                    {
                        queue.map(item =>
                            <FileRow
                                key={item.id}
                                name={item.file.name}
                                size={item.file.size}
                                state={item.state}
                                error={item.error}
                                onRemove={
                                    item.state === "failed"
                                        ? () => setQueue(prev => prev.filter(q => q.id !== item.id))
                                        : undefined
                                }
                            />
                        )
                    }
                    {
                        documents
                            .filter(document => document.id !== removing)
                            .map(document =>
                                <FileRow
                                    key={document.id}
                                    name={document.filename}
                                    size={document.size}
                                    meta={formatDate(document.createdAt)}
                                    state="stored"
                                    onRemove={() => remove(document.id)}
                                />
                            )
                    }
                </ul>
            }
        </div>
    )
}
