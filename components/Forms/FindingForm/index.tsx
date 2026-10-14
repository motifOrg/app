"use client"

// #region imports
import {
    useState,
    useTransition,
} from "react"

import { useRouter } from "nextjs-toploader/app"

import {
    Button,
    Information,
    Modal,
    Select,
    TextArea,
    TextField,
} from "@/base"

import { Plus } from "@/icons"

import {
    FINDING_META,
    PRIORITY_META,
    toOptions,
} from "@/data"

import {
    CONFIDENCE,
    FINDING_KIND,
} from "@/lib"

import { findingAction } from "./action"
// #endregion

const _KIND_OPTIONS = toOptions(FINDING_META)
const _CONFIDENCE_OPTIONS = toOptions(PRIORITY_META)

export const FindingForm = ({ companyId, label = "Add finding", variant = "secondary" }: {
    companyId: string
    label?: string
    variant?: "secondary" | "primary"
}) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Button
                variant={variant}
                size="sm"
                startIcon={<Plus size={11}/>}
                onClick={() => setOpen(true)}
            >
                {label}
            </Button>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Add a research finding"
                size="md"
            >
                {
                    open &&
                    <FindingFields
                        companyId={companyId}
                        onClose={() => setOpen(false)}
                    />
                }
            </Modal>
        </>
    )
}

const FindingFields = ({ companyId, onClose }: {
    companyId: string
    onClose: () => void
}) => {
    const [kind, setKind] = useState<FINDING_KIND>("finding")
    const [confidence, setConfidence] = useState<CONFIDENCE>("medium")
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [source, setSource] = useState<string>("")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const submit = () => {
        const next: Record<string, string> = {}
        if (!title.trim()) next.title = "Title is required"
        if (source.trim() && !/^https?:\/\/\S+\.\S+/.test(source.trim()))
            next.source = "Use a full URL starting with https://"
        setErrors(next)
        if (Object.keys(next).length) return

        startTransition(async () => {
            const res = await findingAction(companyId, {
                kind,
                confidence,
                title: title.trim(),
                content: content.trim(),
                source_url: source.trim() || undefined,
            })
            if (!res.success) {
                setErrors({ form: res.error ?? "Couldn't save the finding" })
                return
            }

            onClose()
            router.refresh()
        })
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-3">
                <Select
                    required
                    label="Type"
                    options={_KIND_OPTIONS}
                    selected={kind}
                    buttonStyle={FINDING_META[kind].style}
                    onChange={option => option && setKind(option.value as FINDING_KIND)}
                />
                <Select
                    required
                    label="Confidence"
                    options={_CONFIDENCE_OPTIONS}
                    selected={confidence}
                    buttonStyle={PRIORITY_META[confidence].style}
                    onChange={option => option && setConfidence(option.value as CONFIDENCE)}
                />
            </div>

            <TextField
                label="Title *"
                value={title}
                autoFocus
                placeholder="e.g. 70% of revenue is maintenance contracts"
                onChange={e => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
            />
            <TextArea
                label="Detail"
                rows={4}
                value={content}
                placeholder="What you found and what it means for the deal"
                onChange={e => setContent(e.target.value)}
            />
            <TextField
                label="Source URL"
                value={source}
                placeholder="https://"
                onChange={e => setSource(e.target.value)}
                error={!!errors.source}
                helperText={errors.source ?? "Findings with a source are marked as sourced"}
            />

            {
                errors.form &&
                <Information
                    variant="error"
                    description={errors.form}
                />
            }

            <div className="flex gap-2 justify-end pt-4">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    onClick={submit}
                    loading={isPending}
                    loadingText="Saving"
                >
                    Add finding
                </Button>
            </div>
        </div>
    )
}
