"use server"

// #region imports
import { refresh } from "next/cache"

import { createCompany } from "@/lib/api"

import {
	IFormResponse,
	parseForm,
	validateForm,
	requireField,

	type IValidator,
} from "@/lib/common"
// #endregion

export interface ICompanyForm {
	campaign_id: string
	name: string
	domain: string
	industry: string
	location: string
	employees: string
	revenue_estimate: string
	owner_name: string
	description: string
}

const _COMPANY_RULES: IValidator<ICompanyForm> = {
	name: requireField("Company name is required"),
	domain: (value) =>
		value && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(value.trim())
			? "Enter a domain like acme.com"
			: null,
	employees: (value) =>
		value && (!/^\d+$/.test(value.trim()))
			? "Use a whole number"
			: null,
}

export const companyAction = async (
	_prevState: IFormResponse<ICompanyForm, { id: string }>,
	formData: FormData,
): Promise<IFormResponse<ICompanyForm, { id: string }>> => {
	const data = parseForm<ICompanyForm>(formData) as ICompanyForm

	const errors = validateForm(data, _COMPANY_RULES)
	if (errors !== null)
		return { success: false, errors }

	const res = await createCompany({
		campaign_id: data.campaign_id,
		name: data.name.trim(),
		domain: data.domain?.trim(),
		industry: data.industry?.trim(),
		location: data.location?.trim(),
		employees: data.employees ? Number(data.employees) : null,
		revenue_estimate: data.revenue_estimate?.trim(),
		owner_name: data.owner_name?.trim(),
		description: data.description?.trim(),
	})

	if (res.success && res.data) {
		refresh()
		return { success: true, data: { id: res.data.id } }
	}

	return {
		success: false,
		errors: {
			[res.error?.includes("domain") ? "domain" : "name"]:
				res.error ?? "Couldn't add the company. Please try again."
		}
	}
}
