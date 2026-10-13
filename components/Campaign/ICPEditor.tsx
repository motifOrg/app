"use client"

// #region imports
import {
    TagInput,
    TextArea,
    TextField,
} from "@/base"

import { IICP } from "@/lib"
// #endregion

export const _EMPTY_ICP: IICP = {
    thesis: "",
    industries: [],
    geographies: [],
    businessModels: [],
    characteristics: [],
    exclusions: [],
    revenueMin: null,
    revenueMax: null,
    ebitdaMin: null,
    employeesMin: null,
    employeesMax: null,
    ownership: "",
}

export type IICPErrors = Partial<Record<"revenue" | "employees" | "thesis", string>>

export const validateICP = (icp: IICP): IICPErrors => {
    const errors: IICPErrors = {}

    if (icp.revenueMin !== null && icp.revenueMax !== null && icp.revenueMin > icp.revenueMax)
        errors.revenue = "Minimum revenue is above the maximum"

    if (icp.employeesMin !== null && icp.employeesMax !== null && icp.employeesMin > icp.employeesMax)
        errors.employees = "Minimum headcount is above the maximum"

    if (!icp.thesis.trim() && icp.industries.length === 0)
        errors.thesis = "Add a thesis or at least one industry"

    return errors
}

const _MILLION = 1_000_000

const toMillions = (value: number | null) =>
    value === null ? "" : String(+(value / _MILLION).toFixed(2))

const fromMillions = (raw: string) => {
    const value = parseFloat(raw)
    return raw.trim() === "" || isNaN(value) || value < 0
        ? null
        : Math.round(value * _MILLION)
}

const fromInt = (raw: string) => {
    const value = parseInt(raw, 10)
    return raw.trim() === "" || isNaN(value) || value < 0 ? null : value
}

export const ICPEditor = ({ value, onChange, errors = {} }: {
    value: IICP
    onChange: (value: IICP) => void
    errors?: IICPErrors
}) => {
    const set = <K extends keyof IICP>(key: K, next: IICP[K]) =>
        onChange({ ...value, [key]: next })

    return (
        <div className="flex flex-col gap-6">
            <TextArea
                label="Acquisition thesis"
                placeholder="e.g. Founder-owned commercial services businesses in the Midwest with recurring maintenance revenue and a retiring owner."
                rows={3}
                value={value.thesis}
                onChange={e => set("thesis", e.target.value)}
                error={!!errors.thesis}
                helperText={errors.thesis}
                className="-mt-1"
            />

            <div className="grid grid-cols-2 gap-5 max-mobile:grid-cols-1">
                <TagInput
                    label="Industries"
                    value={value.industries}
                    onChange={next => set("industries", next)}
                    suggestions={["Commercial HVAC", "Facility services", "Vertical SaaS", "Specialty distribution", "Healthcare services"]}
                />
                <TagInput
                    label="Geographies"
                    value={value.geographies}
                    onChange={next => set("geographies", next)}
                    suggestions={["Ohio", "Indiana", "Michigan", "Texas", "United Kingdom"]}
                />
                <TagInput
                    label="Business models"
                    value={value.businessModels}
                    onChange={next => set("businessModels", next)}
                    suggestions={["Recurring service contracts", "B2B subscription", "Distribution", "Project-based"]}
                />
                <TagInput
                    label="Must-have characteristics"
                    value={value.characteristics}
                    onChange={next => set("characteristics", next)}
                    suggestions={["Founder-owned", "Owner nearing retirement", "Low customer concentration", "Profitable"]}
                />
            </div>

            <div className="grid grid-cols-3 gap-x-3 gap-y-1 max-mobile:grid-cols-1">
                <TextField
                    label="Revenue min ($M)"
                    inputMode="decimal"
                    placeholder="3"
                    defaultValue={toMillions(value.revenueMin)}
                    onChange={e => set("revenueMin", fromMillions(e.target.value))}
                    error={!!errors.revenue}
                />
                <TextField
                    label="Revenue max ($M)"
                    inputMode="decimal"
                    placeholder="25"
                    defaultValue={toMillions(value.revenueMax)}
                    onChange={e => set("revenueMax", fromMillions(e.target.value))}
                    error={!!errors.revenue}
                    helperText={errors.revenue}
                />
                <TextField
                    label="EBITDA min ($M)"
                    inputMode="decimal"
                    placeholder="1"
                    defaultValue={toMillions(value.ebitdaMin)}
                    onChange={e => set("ebitdaMin", fromMillions(e.target.value))}
                />
                <TextField
                    label="Employees min"
                    inputMode="numeric"
                    placeholder="10"
                    defaultValue={value.employeesMin ?? ""}
                    onChange={e => set("employeesMin", fromInt(e.target.value))}
                    error={!!errors.employees}
                />
                <TextField
                    label="Employees max"
                    inputMode="numeric"
                    placeholder="150"
                    defaultValue={value.employeesMax ?? ""}
                    onChange={e => set("employeesMax", fromInt(e.target.value))}
                    error={!!errors.employees}
                    helperText={errors.employees}
                />
                <TextField
                    label="Ownership"
                    placeholder="Founder or family owned"
                    value={value.ownership}
                    onChange={e => set("ownership", e.target.value)}
                />
            </div>

            <TagInput
                label="Exclusions"
                tone="error"
                value={value.exclusions}
                onChange={next => set("exclusions", next)}
                placeholder="Industries or traits to rule out"
                suggestions={["Residential", "PE-backed", "Government contracts > 50%"]}
            />
        </div>
    )
}
