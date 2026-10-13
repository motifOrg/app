"use client"

// #region imports
import { useRouter } from "nextjs-toploader/app"

import {
    useState,
    useTransition,
} from "react"

import {
    Button,
    Information,
    Modal,
    TextArea,
    TextField,
} from "@/base"

import { Plus } from "@/icons"

import { createOpportunityAction } from "./actions"
// #endregion

const _FIELDS = {
    sender_name: "",
    sender_email: "",
    subject: "",
    body: "",
    company_name: "",
    company_domain: "",
}

type IFields = typeof _FIELDS

const validate = (fields: IFields) => {
    const errors: Partial<Record<keyof IFields, string>> = {}
    if (!fields.sender_email.trim())
        errors.sender_email = "Sender email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.sender_email.trim()))
        errors.sender_email = "Enter a valid email"
    if (!fields.subject.trim())
        errors.subject = "Subject is required"
    return errors
}

export const OpportunityForm = ({ campaignId }: { 
    campaignId: string 
}) => {
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const [fields, setFields] = useState<IFields>(_FIELDS)
    const [errors, setErrors] = useState<Partial<Record<keyof IFields | "form", string>>>({})
    const [isPending, startTransition] = useTransition()

    const set = (key: keyof IFields) => (
        e: { target: { value: string } }
    ) => setFields(prev => ({ ...prev, [key]: e.target.value }))

    const submit = () => {
        const next = validate(fields)
        setErrors(next)
        if (Object.keys(next).length) return

        startTransition(async () => {
            const res = await createOpportunityAction({
                campaign_id: campaignId,
                ...Object.fromEntries(
                    Object.entries(fields).map(([key, value]) => [key, value.trim()])
                ) as IFields,
            })
            if (!res.success || !res.id) {
                setErrors({ form: res.error ?? "Couldn't log the deal" })
                return
            }
            setOpen(false)
            setFields(_FIELDS)
            router.push(`/inbound?campaign=${campaignId}&id=${res.id}`)
        })
    }

    return (
        <>
            <Button 
                size="sm" 
                startIcon={<Plus size={11}/>} 
                onClick={() => setOpen(true)}
            >
                Log a deal
            </Button>

            <Modal 
                open={open} 
                onClose={() => !isPending && setOpen(false)} 
                title="Log an inbound deal" 
                size="md"
            >
                <section className="
                    flex flex-col gap-1
                ">
                    <p className="text-grey-300 -mt-2 mb-2">
                        Paste a broker or owner email that came in outside Gmail sync.
                    </p>
                    <aside className="
                        grid grid-cols-2 gap-x-3 
                        gap-y-1 max-mobile:grid-cols-1
                    ">
                        <TextField 
                            label="Sender name" 
                            value={fields.sender_name} 
                            onChange={set("sender_name")} 
                            placeholder="Jordan Lee"
                        />
                        <TextField
                            label="Sender email *"
                            value={fields.sender_email}
                            onChange={set("sender_email")}
                            placeholder="jordan@brokerage.com"
                            error={!!errors.sender_email}
                            helperText={errors.sender_email}
                        />
                        <TextField 
                            label="Company" 
                            value={fields.company_name} 
                            onChange={set("company_name")} 
                            placeholder="Company for sale"
                        />
                        <TextField 
                            label="Company domain" 
                            value={fields.company_domain} 
                            onChange={set("company_domain")} 
                            placeholder="company.com"
                        />
                    </aside>
                    <TextField
                        label="Subject *"
                        value={fields.subject}
                        onChange={set("subject")}
                        placeholder="Confidential: HVAC services business, $10M revenue"
                        error={!!errors.subject}
                        helperText={errors.subject}
                    />
                    <TextArea
                        label="Email body"
                        rows={6}
                        value={fields.body}
                        onChange={set("body")}
                        placeholder="Paste the email or teaser text"
                    />
                    {
                        errors.form && 
                        <Information 
                            variant="error" 
                            description={errors.form}
                        />
                    }

                    <aside className="flex gap-2 justify-end pt-4">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setOpen(false)} 
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
                            Log deal
                        </Button>
                    </aside>
                </section>
            </Modal>
        </>
    )
}
