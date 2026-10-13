"use client"

// #region imports
import Link from "next/link"

import {
	startTransition,
	useActionState,
	useState,
} from "react"

import {
	Button,
	Information,
	Modal,
	TextArea,
	TextField,
} from "@/base"

import { Plus } from "@/icons"
import { IFormResponse } from "@/lib"

import {
	ICompanyForm,
	companyAction,
} from "./action"
// #endregion

export const CompanyForm = ({ campaignId }: {
	campaignId: string
}) => {
	const [open, setOpen] = useState<boolean>(false)
	const [key, setKey] = useState<number>(0)

	return (
		<>
			<Button
				size="sm"
				startIcon={<Plus size={12}/>}
				onClick={() => {
					setKey(prev => prev + 1)
					setOpen(true)
				}}
			>
				Add company
			</Button>

			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title="Add a company"
				size="md"
			>
				<CompanyFields
					key={key}
					campaignId={campaignId}
					onClose={() => setOpen(false)}
				/>
			</Modal>
		</>
	)
}

const CompanyFields = ({ campaignId, onClose }: {
	campaignId: string
	onClose: () => void
}) => {
	const [state, action, isPending] = useActionState<
		IFormResponse<ICompanyForm, { id: string }>,
		FormData
	>(companyAction, { success: false, errors: {} })

	const created = state.success ? state.data?.id : undefined

	if (created)
		return (
			<div className="flex flex-col gap-5">
				<Information
					title="Company added"
					description="It's in the leads table with research not started. Open it to add findings, chat about it or draft outreach."
				/>
				<div className="flex gap-2 justify-end">
					<Button 
                        variant="secondary" 
                        onClick={onClose}
                        size="sm" 
                    >
						Back to leads
					</Button>
					<Link href={`/companies/${created}?campaign=${campaignId}`}>
						<Button size="sm">
                            Open research
                        </Button>
					</Link>
				</div>
			</div>
		)

	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				const form = new FormData(e.currentTarget)
				startTransition(() => action(form))
			}}
			className="flex flex-col gap-1"
		>
			<input type="hidden" name="campaign_id" value={campaignId}/>

			<aside className="
                grid grid-cols-2 gap-x-3 gap-y-1 
                max-mobile:grid-cols-1
            ">
				<TextField
					label="Company name *"
					name="name"
					placeholder="Acme Services"
					error={!!state.errors?.name}
					helperText={state.errors?.name}
					autoFocus
				/>
				<TextField
					label="Domain"
					name="domain"
					placeholder="acme.com"
					error={!!state.errors?.domain}
					helperText={state.errors?.domain}
				/>
				<TextField 
                    label="Industry"
                    name="industry" 
                    placeholder="Commercial HVAC"
                />
				<TextField 
                    label="Location"
                    name="location" 
                    placeholder="Columbus, OH"
                />
				<TextField
					label="Employees"
					name="employees"
					inputMode="numeric"
					placeholder="45"
					error={!!state.errors?.employees}
					helperText={state.errors?.employees}
				/>
				<TextField 
                    label="Revenue estimate" 
                    name="revenue_estimate"
                    placeholder="$8–10M"
                />
				<TextField
					label="Owner"
					name="owner_name"
					placeholder="Founder or owner name"
					className="col-span-2 max-mobile:col-span-1"
				/>
			</aside>

			<TextArea
				label="Notes"
				name="description"
				placeholder="What the company does and why you added it"
				rows={3}
			/>

			<aside className="flex gap-2 justify-end pt-5">
				
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    size="sm"
                    loading={isPending}
                    loadingText="Adding"
                >
                    Add company
                </Button>

			</aside>
		</form>
	)
}
