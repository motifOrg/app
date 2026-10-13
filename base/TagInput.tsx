"use client"

// #region imports
import {
    KeyboardEvent,
    useState,
} from "react"

import Button from "./Button"
import IconButton from "./IconButton"

import { Cancel, Plus } from "@/icons"
import { cn } from "@/lib"
// #endregion

export interface ITagInputProps {
    label: string
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    suggestions?: string[]
    tone?: "mint" | "error"
    max?: number
}

const TagInput = ({
    label,
    value,
    onChange,
    placeholder = "Type and press Enter",
    suggestions = [],
    tone = "mint",
    max = 30,
}: ITagInputProps) => {
    const [draft, setDraft] = useState<string>("")

    const add = (raw: string) => {
        const tags = raw
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean)
            .filter(tag => !value.some(existing => existing.toLowerCase() === tag.toLowerCase()))

        if (tags.length)
            onChange([...value, ...tags].slice(0, max))
        setDraft("")
    }

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            add(draft)
        }
        if (e.key === "Backspace" && !draft && value.length)
            onChange(value.slice(0, -1))
    }

    const open = suggestions.filter(
        suggestion => !value.some(tag => tag.toLowerCase() === suggestion.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs text-grey-300 font-semibold">
                {label}
            </label>

            <div className="
                min-h-9 w-full rounded-lg bg-white border border-grey-100
                flex flex-wrap items-center gap-1.5 px-2 py-1.5 smooth
                hover:border-grey-200/60
                focus-within:border-mint-200 focus-within:ring-2 focus-within:ring-mint-100
            ">
                {
                    value.map(tag =>
                        <span
                            key={tag}
                            className={cn(
                                "inline-flex items-center gap-1.5 h-6 pl-2 pr-1.5 rounded-md text-xs font-semibold",
                                tone === "mint" ? "bg-mint-50 text-mint-300" : "bg-error-100 text-error-200"
                            )}
                        >
                            {tag}
                            <IconButton
                                type="button"
                                variant="ghost"
                                size="xs"
                                aria-label={`Remove ${tag}`}
                                onClick={() => onChange(value.filter(item => item !== tag))}
                                className="w-5! h-5! opacity-60 hover:opacity-100"
                            >
                                <Cancel size={6}/>
                            </IconButton>
                        </span>
                    )
                }
                <input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={() => draft && add(draft)}
                    placeholder={value.length ? "" : placeholder}
                    className="flex-1 min-w-32 bg-transparent outline-none text-sm placeholder:text-grey-200 h-6"
                />
            </div>

            {
                open.length > 0 &&
                <div className="flex flex-wrap gap-1">
                    {
                        open.slice(0, 6).map(suggestion =>
                            <Button
                                key={suggestion}
                                type="button"
                                variant="secondary"
                                size="xs"
                                startIcon={<Plus size={8}/>}
                                onClick={() => add(suggestion)}
                                className="!h-6"
                            >
                                {suggestion}
                            </Button>
                        )
                    }
                </div>
            }
        </div>
    )
}

export default TagInput
