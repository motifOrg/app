"use client"

// #region imports
import Link from "next/link"
import { useRouter } from "nextjs-toploader/app"

import {
    ReactNode,
    useState,
    useTransition,
} from "react"

import {
    Button,
    Dropzone,
    Information,
    TextArea,
    TextField,
} from "@/base"

import {
    Check,
    Chevron,
} from "@/icons"

import {
    _DOCUMENT_TYPES,
    _MAX_UPLOAD_MB,
} from "@/constants"

import { WORKFLOW_META } from "@/data"

import {
    cn,
    IICP,
    WORKFLOW,
} from "@/lib"

import {
    _EMPTY_ICP,
    ICPEditor,
    IICPErrors,
    validateICP,
} from "./ICPEditor"

import {
    FileRow,
    IQueuedFile,
    queueFiles,
} from "./Documents"

import { ICPSummary } from "./ICPSummary"
import { WorkflowPicker } from "./WorkflowPicker"

import {
    createCampaignAction,
    refreshAction,
    uploadDocumentAction,
} from "./actions"
// #endregion

const _STEPS = [
    { id: "basics", title: "Campaign Basics", description: "Name the search so you can find it later." },
    { id: "icp", title: "Ideal Company Profile", description: "The criteria every target and inbound deal is checked against." },
    { id: "documents", title: "Supporting Documents", description: "Attach your thesis deck or criteria sheet. Optional." },
    { id: "workflow", title: "Sourcing Workflow", description: "Choose how deals will come into this campaign." },
    { id: "review", title: "Review & Create", description: "Check everything before the campaign goes live." },
] as const

const Section = ({ title, onEdit, children }: {
    title: string
    onEdit: () => void
    children: ReactNode
}) => (
    <section className="rounded-xl ring-1 ring-grey-100 p-4 flex flex-col gap-2">
        <aside className="flex items-center justify-between">
            <h3 className="font-semibold text-charcoal-100">{title}</h3>
            <Button variant="ghost" size="xs" onClick={onEdit}>Edit</Button>
        </aside>
        {children}
    </section>
)

export const CampaignWizard = () => {
    const router = useRouter()

    const [step, setStep] = useState<number>(0)
    const [visited, setVisited] = useState<number>(0)

    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [icp, setICP] = useState<IICP>(_EMPTY_ICP)
    const [workflow, setWorkflow] = useState<WORKFLOW>("outbound")
    const [files, setFiles] = useState<IQueuedFile[]>([])
    const [uploads, setUploads] = useState<string[]>([])

    const [nameError, setNameError] = useState<string>()
    const [icpErrors, setICPErrors] = useState<IICPErrors>({})
    const [error, setError] = useState<string>()
    const [created, setCreated] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const current = _STEPS[step]

    const validate = (index: number) => {
        if (_STEPS[index].id === "basics") {
            const message = !name.trim()
                ? "Give the campaign a name"
                : name.trim().length > 120 ? "Keep it under 120 characters" : undefined
            setNameError(message)
            return !message
        }
        if (_STEPS[index].id === "icp") {
            const errors = validateICP(icp)
            setICPErrors(errors)
            return Object.keys(errors).length === 0
        }
        return true
    }

    const go = (index: number) => {
        if (index > step) {
            for (let i = step; i < index; i++)
                if (!validate(i)) {
                    setStep(i)
                    return
                }
        }
        setStep(index)
        setVisited(prev => Math.max(prev, index))
        document.getElementById("content")?.scrollTo({ top: 0 })
    }

    const submit = (status: "draft" | "active") => {
        if (!validate(0)) return go(0)
        if (!validate(1)) return go(1)

        startTransition(async () => {
            setError(undefined)
            const res = await createCampaignAction({
                name: name.trim(),
                description: description.trim(),
                workflow,
                status,
                icp,
            })

            if (!res.success || !res.id) {
                setError(res.error ?? "Couldn't create the campaign")
                return
            }

            const pending = files.filter(item => item.state === "queued")
            setUploads(pending.map(item => item.id))
            setCreated(res.id)

            for (const item of pending) {
                setFiles(prev => prev.map(f => f.id === item.id ? { ...f, state: "uploading" } : f))
                const form = new FormData()
                form.append("file", item.file)
                const upload = await uploadDocumentAction(res.id, form)
                setFiles(prev => prev.map(f => f.id === item.id
                    ? upload.success
                        ? { ...f, state: "done" }
                        : { ...f, state: "failed", error: upload.error ?? "Upload failed" }
                    : f
                ))
            }

            if (pending.length) await refreshAction()
        })
    }

    if (created) {
        const failed = files.filter(item => item.state === "failed" && uploads.includes(item.id))
        const destination = workflow === "inbound"
            ? `/inbound?campaign=${created}`
            : `/?campaign=${created}`

        return (
            <section className="
                max-w-xl mx-auto w-full rounded-2xl bg-paper 
                ring-1 ring-grey-100 p-8 flex flex-col gap-6 
                animate-card-in
            ">
                <span className="
                    w-12 h-12 rounded-full bg-mint-300 
                    text-white flex items-center justify-center
                ">
                    <Check size={18}/>
                </span>

                <aside className="flex flex-col gap-1">
                    <h2 className="text-xl font-extrabold">
                        {name} is ready
                    </h2>

                    <p className="text-grey-300">
                        Your ICP is saved.{" "}
                        {workflow === "inbound"
                            ? "Log inbound deals to evaluate them against it."
                            : "Import a target list or add companies to start researching."}
                    </p>
                </aside>

                {
                    uploads.length > 0 &&
                    <ul className="flex flex-col">
                        {files.filter(item => uploads.includes(item.id)).map(item =>
                            <FileRow
                                key={item.id}
                                name={item.file.name}
                                size={item.file.size}
                                state={item.state === "queued" ? "uploading" : item.state}
                                error={item.error}
                            />
                        )}
                    </ul>
                }

                {
                    failed.length > 0 &&
                    <Information
                        variant="warning"
                        description="Some files didn't upload. You can retry from the campaign settings."
                    />
                }

                {
                    isPending ?
                    <Button loading loadingText="Uploading documents">
                        Uploading
                    </Button> :
                    <aside className="flex gap-2">
                        <Link href={destination}>
                            <Button>
                                {workflow === "inbound" ? "Go to inbound" : "Go to leads"}
                            </Button>
                        </Link>
                        <Link href={`/campaigns/${created}`}>
                            <Button variant="secondary">
                                Campaign settings
                            </Button>
                        </Link>
                    </aside>
                }
            </section>
        )
    }

    return (
        <section className="
            grid grid-cols-[260px_1fr] gap-6 
            items-start max-tablet:grid-cols-1
        ">
            <aside className="
                rounded-2xl bg-paper ring-1 ring-grey-100 
                p-3 flex flex-col gap-1
                sticky top-0 max-tablet:static 
                max-tablet:flex-row max-tablet:overflow-x-auto
            ">
                {
                    _STEPS.map((item, index) => {
                        const done = 
                            index !== step 
                            && index <= visited 
                            && index < _STEPS.length - 1

                        return (
                            <Button
                                key={item.id}
                                type="button"
                                variant="ghost"
                                fullWidth
                                onClick={() => go(index)}
                                data-active={index === step}
                                startIcon={
                                    <aside className={cn(
                                        `
                                            w-7 h-7 rounded-full shrink-0 flex 
                                            items-center justify-center text-xs 
                                            font-bold
                                        `,
                                        (index === step || done)
                                            ? "bg-mint-300 text-white"
                                            : "bg-grey-150 text-grey-200"
                                    )}>
                                        {
                                            done ? 
                                            <Check size={16}/> : 
                                            index + 1
                                        }
                                    </aside>
                                }
                                className="
                                    h-auto! p-2.5!
                                    hover:bg-default! 
                                    text-grey-300!
                                    data-[active=true]:bg-mint-50!
                                    data-[active=true]:text-charcoal-100!
                                    
                                "
                            >
                                
                                {item.title}
                            </Button>
                        )
                    })
                }
            </aside>

            <article
                key={current.id}
                className="
                    rounded-2xl bg-paper ring-1 ring-grey-100 
                    flex flex-col animate-fade-in-fast
                "
            >
                <section className="
                    px-8 pt-7 pb-5 border-b border-grey-150 
                    flex flex-col gap-1 max-mobile:px-5
                ">
                    <h2 className="text-xl font-extrabold">
                        {current.title}
                    </h2>

                    <p className="text-grey-300">
                        {current.description}
                    </p>
                </section>

                <section className="px-8 py-6 max-mobile:px-5">
                    {
                        current.id === "basics" &&
                        <aside className="flex flex-col gap-2 max-w-xl">
                            <TextField
                                label="Campaign name *"
                                placeholder="Midwest commercial services"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value)
                                    if (nameError) setNameError(undefined)
                                }}
                                onKeyDown={e => e.key === "Enter" && go(step + 1)}
                                error={!!nameError}
                                helperText={nameError}
                                autoFocus
                            />
                            <TextArea
                                label="Description"
                                placeholder="What you're looking for and why. Visible on the leads portal."
                                rows={4}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </aside>
                    }

                    {
                        current.id === "icp" &&
                        <ICPEditor
                            value={icp}
                            onChange={next => {
                                setICP(next)
                                if (Object.keys(icpErrors).length) setICPErrors(validateICP(next))
                            }}
                            errors={icpErrors}
                        />
                    }

                    {
                        current.id === "documents" &&
                        <aside className="flex flex-col gap-4">
                            <Dropzone
                                multiple
                                accept={_DOCUMENT_TYPES}
                                title="Drop PDFs or presentations here"
                                hint={`PDF, PPT, PPTX or Keynote · up to ${_MAX_UPLOAD_MB} MB each`}
                                onFiles={next => setFiles(prev => [...prev, ...queueFiles(next)])}
                            />
                            {
                                files.length > 0 &&
                                <ul className="flex flex-col">
                                    {files.map(item =>
                                        <FileRow
                                            key={item.id}
                                            name={item.file.name}
                                            size={item.file.size}
                                            state={item.state}
                                            meta={item.state === "queued" ? "Uploads when you create the campaign" : undefined}
                                            error={item.error}
                                            onRemove={() => setFiles(prev => prev.filter(f => f.id !== item.id))}
                                        />
                                    )}
                                </ul>
                            }
                            <Information
                                variant="neutral"
                                description="Files are stored with the campaign so the team has the source material. Motif doesn't parse them yet, so they won't change scoring."
                            />
                        </aside>
                    }

                    {
                        current.id === "workflow" &&
                        <WorkflowPicker value={workflow} onChange={setWorkflow}/>
                    }

                    {
                        current.id === "review" &&
                        <aside className="flex flex-col gap-3">
                            <Section title="Basics" onEdit={() => go(0)}>
                                <p className="font-bold">{name}</p>
                                { 
                                    description && 
                                    <p className="text-grey-300">
                                        {description}
                                    </p>
                                }
                            </Section>

                            <Section title="Ideal company profile" onEdit={() => go(1)}>
                                <ICPSummary icp={icp}/>
                            </Section>

                            <Section title="Documents" onEdit={() => go(2)}>
                                <p className="text-grey-300">
                                    {files.filter(f => f.state === "queued").length
                                        ? files.filter(f => f.state === "queued").map(f => f.file.name).join(", ")
                                        : "No documents attached"}
                                </p>
                            </Section>

                            <Section title="Workflow" onEdit={() => go(3)}>
                                <p className="font-semibold">
                                    {WORKFLOW_META[workflow].label}
                                </p>
                                <p className="text-grey-300 text-xs">
                                    {WORKFLOW_META[workflow].description}
                                </p>
                            </Section>

                            {
                                error && 
                                <Information 
                                    variant="error" 
                                    description={error}
                                />
                            }
                        </aside>
                    }
                </section>

                <section className="
                    px-8 py-4 border-t border-grey-150 flex items-center gap-2
                    max-mobile:px-5 max-mobile:flex-wrap
                ">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/campaigns")}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>

                    <span className="flex-1"/>

                    {
                        step > 0 &&
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => go(step - 1)}
                            disabled={isPending}
                            startIcon={<Chevron direction="left" size={8}/>}
                        >
                            Back
                        </Button>
                    }

                    {
                        current.id === "review" ?
                        <>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => submit("draft")}
                                disabled={isPending}
                            >
                                Save as draft
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => submit("active")}
                                loading={isPending}
                                loadingText="Creating"
                            >
                                Create campaign
                            </Button>
                        </> :
                        <Button
                            size="sm"
                            onClick={() => go(step + 1)}
                            endIcon={<Chevron direction="right" size={8}/>}
                        >
                            {current.id === "documents" && files.length === 0 ? "Skip" : "Continue"}
                        </Button>
                    }
                </section>
            </article>
        </section>
    )
}
