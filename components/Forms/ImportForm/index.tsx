
"use client"

// #region imports
import {
    useState,
    useTransition,
} from "react"

import { useRouter } from "next/navigation"

import {
    Button,
    Dropzone,
    Information,
    Modal,
} from "@/base"

import {
    Document,
    Upload,
} from "@/icons"

import {
    formatBytes,
    IImportResult,
} from "@/lib"

import { importAction } from "./action"
// #endregion

const _HEADERS = [
    "name",
    "domain",
    "industry",
    "location",
    "employees",
    "revenue",
    "founded",
    "owner",
    "description",
]

export const ImportForm = ({ campaignId }: {
    campaignId: string
}) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File>()
    const [error, setError] = useState<string>()
    const [result, setResult] = useState<IImportResult>()
    const [isPending, startTransition] = useTransition()

    const reset = () => {
        setFile(undefined)
        setError(undefined)
        setResult(undefined)
    }

    const dismiss = () => {
        setOpen(false)
        reset()
    }

    const finish = () => {
        setOpen(false)
        router.refresh()
    }

    const submit = () => {
        if (!file) return

        const form = new FormData()
        form.append("file", file)

        startTransition(async () => {
            setError(undefined)

            const res = await importAction(campaignId, form)

            if (res.success && "data" in res && res.data) {
                setResult(res.data)
                router.refresh()
            }
            else
                setError(res.error ?? "Import failed.")
        })
    }

    return (
        <>
            <Button
                variant="secondary"
                size="sm"
                startIcon={<Upload size={12} />}
                loading={isPending}
                loadingText="Importing"
                onClick={() => {
                    reset()
                    setOpen(true)
                }}
            >
                Import CSV
            </Button>

            <Modal
                open={open}
                onClose={() => !isPending && dismiss()}
                title="Import companies from CSV"
                size="md"
            >
                {isPending ? (
                    <section className="
                        flex flex-col gap-4 items-center 
                        py-10 text-center
                    ">
                        <span
                            className="
                                loading loading-spinner loading-lg 
                                text-mint-300
                            "
                        />

                        <div className="flex flex-col gap-1">
                            <p className="font-bold">
                                Importing companies
                            </p>
                            <p className="text-xs text-grey-300">
                                Parsing your CSV and adding leads to this campaign.
                            </p>
                        </div>
                    </section>
                ) : result ? (
                    <section className="flex flex-col gap-4">
                        <aside className="grid grid-cols-3 gap-2">
                            {[
                                ["Imported", result.inserted, "text-mint-300"],
                                ["Duplicates skipped", result.skipped, "text-grey-300"],
                                [
                                    "Rows with errors",
                                    result.failed,
                                    result.failed ? "text-error-200" : "text-grey-300",
                                ],
                            ].map(([label, value, tone]) => (
                                <div
                                    key={label}
                                    className="rounded-xl bg-default p-3 flex flex-col"
                                >
                                    <p className="text-caption">
                                        {label}
                                    </p>
                                    <p className={`text-2xl font-extrabold ${tone}`}>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </aside>

                        {result.errors.length > 0 && (
                            <aside className="
                                rounded-xl ring-1 ring-grey-100 
                                max-h-48 overflow-y-auto
                            ">
                                {result.errors.map(rowError => (
                                    <p
                                        key={rowError.row}
                                        className="px-3 py-2 text-xs border-b border-grey-150 last:border-0"
                                    >
                                        <span className="font-bold">
                                            Row {rowError.row}
                                        </span>
                                        <span className="text-grey-300">
                                            {" · "}{rowError.message}
                                        </span>
                                    </p>
                                ))}
                            </aside>
                        )}

                        <p className="text-xs text-grey-200">
                            {
                                result.inserted > 0
                                    ? "AI enrichment runs in the background. Reload the list to see research results."
                                    : "Duplicates are matched on domain within this campaign."
                            }
                        </p>

                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={reset}
                            >
                                Import another file
                            </Button>

                            <Button
                                size="sm"
                                onClick={finish}
                            >
                                Done
                            </Button>
                        </div>
                    </section>
                ) : (
                    <section className="flex flex-col gap-4">
                        {file ? (
                            <aside className="
                                flex items-center gap-3 
                                rounded-xl ring-1 
                                ring-grey-100 p-3
                            ">
                                <p className="
                                    w-9 h-9 rounded-lg bg-mint-50 
                                    text-mint-300 flex items-center 
                                    justify-center
                                ">
                                    <Document size={16} />
                                </p>

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate">{file.name}</p>
                                    <p className="text-xs text-grey-200">
                                        {formatBytes(file.size)}
                                    </p>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={reset}
                                >
                                    Change
                                </Button>
                            </aside>
                        ) : (
                            <Dropzone
                                accept=".csv,text/csv"
                                title="Drop a CSV or browse"
                                hint="Up to 5 MB. The first row must be a header."
                                onFiles={([next]) => {
                                    setError(undefined)
                                    setFile(next)
                                }}
                            />
                        )}

                        <aside className="flex flex-col gap-1.5">
                            <span>Recognised columns</span>

                            <div className="flex flex-wrap gap-1">
                                {_HEADERS.map(header => (
                                    <code
                                        key={header}
                                        className="
                                            text-[11px] bg-grey-150 
                                            rounded px-1.5 py-0.5 
                                            text-grey-300
                                        "
                                    >
                                        {header}
                                    </code>
                                ))}
                            </div>

                            <span className="
                                text-xs text-grey-200
                            ">
                                Only <b>name</b> is required. Aliases like company, website and country also work.
                            </span>
                        </aside>

                        {error && (
                            <Information
                                variant="error"
                                description={error}
                            />
                        )}

                        <aside className="flex gap-2 justify-end">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={dismiss}
                            >
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                onClick={submit}
                                disabled={!file}
                                loading={isPending}
                                loadingText="Importing"
                            >
                                Import companies
                            </Button>
                        </aside>
                    </section>
                )}
            </Modal>
        </>
    )
}
