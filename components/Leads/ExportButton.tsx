"use client"

// #region imports
import {
    useState,
    useTransition,
} from "react"

import {
    Button,
    Information,
} from "@/base"

import { Table } from "@/icons"
import type { ICompanyQuery } from "@/lib/api"

import { exportCompaniesAction } from "./actions"
// #endregion

export const ExportButton = ({ query }: {
    query: Omit<ICompanyQuery, "page" | "limit">
}) => {
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const download = () => startTransition(async () => {
        setError(undefined)

        const res = await exportCompaniesAction(query)
        if (!res.success || !res.data) {
            setError(res.error ?? "Couldn't export leads")
            return
        }

        const url = URL.createObjectURL(
            new Blob([res.data.body], { type: "text/csv;charset=utf-8" })
        )
        const link = document.createElement("a")
        link.href = url
        link.download = res.data.filename
        link.click()
        URL.revokeObjectURL(url)
    })

    return (
        <>
            <Button
                variant="secondary"
                size="sm"
                startIcon={<Table size={12}/>}
                loading={isPending}
                loadingText="Exporting"
                onClick={download}
            >
                Export CSV
            </Button>
            {
                error &&
                <Information
                    variant="error"
                    description={error}
                />
            }
        </>
    )
}
