"use client"

// #region imports
import { useRouter } from "nextjs-toploader/app"

import {
    usePathname,
    useSearchParams,
} from "next/navigation"

import { Button } from "@/base"
import { Chevron } from "@/icons"
import { cn } from "@/lib"
// #endregion

const _SORTS = {
    name: ["a-z", "z-a"],
    fit: ["fit", "fit-asc"],
    priority: ["priority", "priority"],
} as const

export const SortHeader = ({ column, label, className }: {
    column: keyof typeof _SORTS
    label: string
    className?: string
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const sort = searchParams.get("sort") ?? "fit"
    const [asc, desc] = _SORTS[column]
    const active = sort === asc || sort === desc

    const toggle = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("sort", sort === asc ? desc : asc)
        params.delete("page")
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <span className={className}>
            <Button
                type="button"
                variant="text"
                size="shrink"
                onClick={toggle}
                data-active={active}
                className="
                    !px-0 !h-auto hover:!text-charcoal-100
                    data-[active=true]:!text-charcoal-100
                "
                endIcon={
                    <Chevron
                        size={7}
                        direction={sort === desc && asc !== desc ? "up" : "down"}
                        className={cn("smooth", !active && "opacity-0")}
                    />
                }
            >
                {label}
            </Button>
        </span>
    )
}
