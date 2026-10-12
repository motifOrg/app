"use client"

// #region imports
import Link from "next/link"
import { ReactNode } from "react"

import { Tooltip } from "@/base"
import { cn } from "@/lib"
// #endregion

export const NavItem = ({ href, icon, label, active, open, badge }: {
    href: string
    icon: ReactNode
    label: string
    active: boolean
    open: boolean
    badge?: number
}) => {
    const item = (
        <Link
            href={href}
            data-active={active}
            className={cn(
                "flex items-center gap-3 h-9 rounded-lg smooth",
                "text-grey-300 font-semibold hover:bg-grey-150 hover:text-charcoal-100",
                "data-[active=true]:text-mint-300",
                open ? "px-1" : "justify-center w-9",
            )}
        >
            <span className="shrink-0">{icon}</span>
            {open && <span className="flex-1 truncate pr-1">{label}</span>}
            {
                open && !!badge &&
                <span className="
                    text-[11px] font-bold bg-mint-300 text-white
                    rounded-full min-w-5 text-center
                ">
                    {badge}
                </span>
            }
        </Link>
    )

    return open
        ? item
        : <Tooltip content={label} side="right">{item}</Tooltip>
}
