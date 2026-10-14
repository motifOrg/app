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
    Select,
    TextArea,
    TextField,
} from "@/base"

import { Edit } from "@/icons"

import {
    CAMPAIGN_META,
    WORKFLOW_META,
    toOptions,
} from "@/data"

import {
    CAMPAIGN_STATUS,
    ICampaign,
    IICP,
    WORKFLOW,
} from "@/lib"

import { Card } from "@/components/Cards/Card"

import {
    _EMPTY_ICP,
    ICPEditor,
    IICPErrors,
    validateICP,
} from "./ICPEditor"

import { ICPSummary } from "./ICPSummary"

import {
    deleteCampaignAction,
    updateCampaignAction,
    updateICPAction,
} from "./actions"
// #endregion

const _STATUS_OPTIONS = toOptions(CAMPAIGN_META)
const _WORKFLOW_OPTIONS = toOptions(WORKFLOW_META)

const Basics = ({ campaign }: { campaign: ICampaign }) => {
    const [editing, setEditing] = useState<boolean>(false)
    const [name, setName] = useState<string>(campaign.name)
    const [description, setDescription] = useState<string>(campaign.description)
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const save = (input: Parameters<typeof updateCampaignAction>[1]) =>
        startTransition(async () => {
            setError(undefined)
            const res = await updateCampaignAction(campaign.id, input)
            if (!res.success) setError(res.error ?? "Couldn't save")
            else setEditing(false)
        })

    return (
        <Card
            title="Campaign"
            description="Name, status and how deals come in"
            actions={
                !editing &&
                <Button 
                    variant="ghost" 
                    size="xs" 
                    startIcon={<Edit size={11}/>}
                    onClick={() => setEditing(true)}
                >
                    Edit
                </Button>
            }
        >
            <div className="flex flex-col gap-4">
                {
                    editing ?
                    <div className="flex flex-col gap-1">
                        <TextField
                            label="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            error={!name.trim()}
                            helperText={!name.trim() ? "Name is required" : undefined}
                        />
                        <TextArea
                            label="Description"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end pt-3">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setName(campaign.name)
                                    setDescription(campaign.description)
                                    setEditing(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                disabled={!name.trim()}
                                loading={isPending}
                                onClick={() => save({ 
                                    name: name.trim(),
                                    description: description.trim(),
                                })}
                            >
                                Save
                            </Button>
                        </div>
                    </div> :
                    <div className="flex flex-col gap-1">
                        <p className="font-bold text-base">
                            {campaign.name}
                        </p>
                        <p className="text-grey-300">
                            {campaign.description || "No description"}
                        </p>
                    </div>
                }

                <div className="
                    flex flex-col gap-4
                ">
                    <Select
                        required
                        label="Status"
                        options={_STATUS_OPTIONS}
                        selected={campaign.status}
                        disabled={isPending}
                        buttonStyle={CAMPAIGN_META[campaign.status].style}
                        onChange={option => option && option.value !== campaign.status &&
                            save({ status: option.value as CAMPAIGN_STATUS })
                        }
                    />
                    <Select
                        required
                        label="Workflow"
                        options={_WORKFLOW_OPTIONS}
                        selected={campaign.workflow}
                        disabled={isPending}
                        buttonStyle={WORKFLOW_META[campaign.workflow].style}
                        onChange={option => option && option.value !== campaign.workflow &&
                            save({ workflow: option.value as WORKFLOW })
                        }
                    />
                    {
                        (campaign.workflow === "inbound" || campaign.workflow === "both") &&
                        <TextField
                            key={campaign.gmailLabel}
                            label="Gmail sync label"
                            defaultValue={campaign.gmailLabel}
                            disabled={isPending}
                            placeholder="INBOX or your Gmail label name"
                            onBlur={e => {
                                const trimmed = e.target.value.trim()
                                if (trimmed === campaign.gmailLabel) return
                                save({ gmailLabel: trimmed })
                            }}
                        />
                    }
                </div>

                {
                    error && 
                    <Information 
                        variant="error" 
                        description={error}
                    />
                }
            </div>
        </Card>
    )
}

const ICP = ({ campaign }: { campaign: ICampaign }) => {
    const [editing, setEditing] = useState<boolean>(false)
    const [icp, setICP] = useState<IICP>(campaign.icp ?? _EMPTY_ICP)
    const [errors, setErrors] = useState<IICPErrors>({})
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const save = () => {
        const next = validateICP(icp)
        setErrors(next)
        if (Object.keys(next).length) return

        startTransition(async () => {
            setError(undefined)
            const res = await updateICPAction(campaign.id, icp)
            if (!res.success) setError(res.error ?? "Couldn't save the ICP")
            else setEditing(false)
        })
    }

    return (
        <Card
            title="Ideal company profile"
            description="Stored in Postgres and used for the criteria check on every company"
            actions={
                !editing &&
                <Button variant="ghost" size="xs" startIcon={<Edit size={11}/>} onClick={() => setEditing(true)}>
                    Edit ICP
                </Button>
            }
        >
            {
                editing ?
                <div className="flex flex-col gap-4">
                    <ICPEditor
                        value={icp}
                        onChange={next => {
                            setICP(next)
                            if (Object.keys(errors).length) setErrors(validateICP(next))
                        }}
                        errors={errors}
                    />
                    {
                        error && 
                        <Information 
                            variant="error" 
                            description={error}
                        />
                    }
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={isPending}
                            onClick={() => {
                                setICP(campaign.icp ?? _EMPTY_ICP)
                                setErrors({})
                                setEditing(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            size="sm" 
                            loading={isPending}
                            loadingText="Saving" 
                            onClick={save}
                        >
                            Save ICP
                        </Button>
                    </div>
                </div> :
                <ICPSummary icp={campaign.icp}/>
            }
        </Card>
    )
}

const Danger = ({ campaign }: { campaign: ICampaign }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<string>("")
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const remove = () => startTransition(async () => {
        const res = await deleteCampaignAction(campaign.id)
        if (!res.success)
            setError(res.error ?? "Couldn't delete the campaign")
    })

    return (
        <Card 
            title="Danger zone" 
            className="ring-error-200"
        >
            <div className="
                flex items-center justify-between 
                gap-4 flex-wrap
            ">
                <p className="text-grey-300 max-w-lg">
                    Deleting removes the ICP, {campaign.companyCount} companies with their research
                    {" "}and {campaign.opportunityCount} inbound deals.
                    Archive it instead if you might come back to it.
                </p>
                <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
                    Delete campaign
                </Button>
            </div>

            <Modal
                open={open}
                onClose={() => !isPending && setOpen(false)}
                title="Delete this campaign?"
                size="sm"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-grey-300">
                        This can&apos;t be undone. Type 
                        <b className="text-charcoal-100">
                            {campaign.name}
                        </b> 
                        to confirm.
                    </p>
                    <TextField
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        placeholder={campaign.name}
                        aria-label="Campaign name"
                    />
                    {
                        error && 
                        <Information 
                            variant="error" 
                            description={error}
                        />
                    }
                    <div className="flex gap-2 justify-end">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setOpen(false)} 
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            disabled={confirm.trim() !== campaign.name}
                            loading={isPending}
                            loadingText="Deleting"
                            onClick={remove}
                        >
                            Delete forever
                        </Button>
                    </div>
                </div>
            </Modal>
        </Card>
    )
}

export const CampaignSettings = ({ campaign }: {
    campaign: ICampaign
}) => (
    <section className="
        grid grid-cols-[1fr_380px] 
        gap-5 items-start 
        max-tablet:grid-cols-1
    ">
        <aside className="flex flex-col gap-5">
            <ICP 
                key={campaign.updatedAt.toISOString()}
                campaign={campaign}
            />
            
            <Danger campaign={campaign}/>
        </aside>

        <aside className="flex flex-col gap-5">
            <Basics 
                key={campaign.updatedAt.toISOString()} 
                campaign={campaign}
            />
        </aside>
    </section>
)
