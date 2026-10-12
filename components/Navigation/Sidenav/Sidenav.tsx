"use client"

// #region imports
import Link from "next/link"

import {
    usePathname,
    useSearchParams,
} from "next/navigation"

import { useState } from "react"

import {
    IconButton,
    Tooltip,
} from "@/base"

import {
    Collapse,
    Inbox,
    Logo,
    Menu,
    Plus,
    Table,
    Target,
} from "@/icons"

import { useSearchParam, useShortcut } from "@/hooks"

import {
    cn,
    ICampaign,
    navHref,
} from "@/lib"

import { NavItem } from "./NavItem"
// #endregion

export const Sidenav = ({ campaigns, error }: {
    campaigns: ICampaign[]
    error?: string
}) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { set } = useSearchParam()

    const open = searchParams.get("nav") !== "closed"
    const [mobile, setMobile] = useState<boolean>(false)

    const fromPath = pathname.match(/^\/campaigns\/([^/]+)$/)?.[1]
    const fromUrl = searchParams.get("campaign") ?? (fromPath !== "new" ? fromPath : undefined) ?? null

    const location = `${pathname}?${searchParams.toString()}`
    const [lastLocation, setLastLocation] = useState<string>(location)
    if (location !== lastLocation) {
        setLastLocation(location)
        setMobile(false)
    }

    const toggle = () => {
        set(
            { nav: open ? "closed" : undefined },
            { replace: true, reset: [] },
        )
    }

    useShortcut([
        ["mod+B", toggle]
    ])

    const current = campaigns.find(c => c.id === fromUrl) ?? campaigns[0]
    const query = current ? `?campaign=${current.id}` : ""
    const inboundNew = current?.opportunityCount
    const visible = campaigns.filter(c => c.status !== "archived")

    const expanded = open || mobile

    return (
        <>
            <IconButton
                variant="secondary"
                size="md"
                className="fixed top-3 left-3 z-90 bg-paper ring-1 ring-grey-100 mobile:hidden"
                onClick={() => setMobile(true)}
                aria-label="Open navigation"
            >
                <Menu size={16}/>
            </IconButton>

            {
                mobile &&
                <div
                    className="fixed inset-0 bg-charcoal-100/20 z-95 mobile:hidden"
                    onClick={() => setMobile(false)}
                />
            }

            <nav
                data-open={expanded}
                data-mobile={mobile}
                className={cn(
                    "h-full shrink-0 bg-paper border-r border-grey-100",
                    "flex flex-col gap-6 py-4 smooth duration-300",
                    "w-16 px-3.5 data-[open=true]:w-60 data-[open=true]:px-3",
                    "max-mobile:fixed max-mobile:z-100 max-mobile:-translate-x-full",
                    "max-mobile:data-[mobile=true]:translate-x-0 max-mobile:shadow-xl",
                )}
            >
                <header className={cn(
                    "flex items-center gap-2 smooth pl-1",
                    expanded ? "justify-between" : "justify-center",
                )}>
                    <aside className="flex items-center gap-2.5">
                        {
                            !expanded ?
                            <Tooltip
                                content="Expand (⌘B)"
                                side="right"
                                className="max-mobile:hidden"
                            >
                                <button
                                    type="button"
                                    onClick={toggle}
                                    aria-label="Expand navigation"
                                    className="
                                        group size-9 flex items-center justify-center rounded-lg
                                        text-primary hover:bg-grey-150 cursor-pointer relative
                                    "
                                >
                                    <Logo
                                        size={32}
                                        className="group-hover:opacity-0 smooth absolute"
                                    />
                                    <Collapse
                                        size={18}
                                        className="opacity-0 rotate-180 group-hover:opacity-100 smooth absolute"
                                    />
                                </button>
                            </Tooltip> :
                            <h2 className="
                                text-xl text-primary 
                                font-medium tracking-tight
                            ">
                                Motif
                            </h2>
                        }
                    </aside>

                    {
                        expanded &&
                        <Tooltip
                            content="Collapse (⌘B)"
                            side="right"
                            className="max-mobile:hidden"
                        >
                            <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={toggle}
                                aria-label="Collapse navigation"
                            >
                                <Collapse size={18} className="smooth text-grey-200"/>
                            </IconButton>
                        </Tooltip>
                    }
                </header>

                <section className="flex flex-col gap-1 h-full">
                    <NavItem
                        href={navHref(`/${query}`, open)}
                        icon={<Table size={20}/>}
                        label="Leads"
                        open={expanded}
                        active={pathname === "/" || pathname.startsWith("/companies")}
                    />

                    <NavItem
                        href={navHref(`/inbound${query}`, open)}
                        icon={<Inbox size={20}/>}
                        label="Inbound"
                        open={expanded}
                        badge={inboundNew}
                        active={pathname.startsWith("/inbound")}
                    />

                    <aside className="
                        flex items-center 
                        justify-between mb-1
                        mt-auto
                    ">
                        <NavItem
                            href={navHref("/campaigns", open)}
                            icon={<Target size={20} />}
                            label="Campaigns"
                            open={expanded}
                            active={pathname.startsWith("/campaigns")}
                        />

                        {expanded && (
                            <Tooltip content="New campaign" side="left">
                                <Link
                                    href={navHref("/campaigns/new", open)}
                                    aria-label="New campaign"
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-grey-200 hover:bg-grey-150 hover:text-charcoal-100 smooth"
                                >
                                    <Plus size={18} />
                                </Link>
                            </Tooltip>
                        )}
                    </aside>

                    {expanded && (
                        <>
                            {error && <p className="px-1 text-xs text-error">{error}</p>}

                            {!error && visible.length === 0 && (
                                <Link
                                    href={navHref("/campaigns/new", open)}
                                    className="mx-1 p-3 rounded-lg border border-dashed border-grey-100 text-xs text-grey-200 hover:border-mint-200 hover:text-mint-300 smooth"
                                >
                                    Create your first campaign to start sourcing.
                                </Link>
                            )}

                            <div className="flex flex-col gap-0.5 mb-4">
                                {visible.map(campaign => (
                                    <Link
                                        key={campaign.id}
                                        href={navHref(
                                            pathname.startsWith("/inbound")
                                                ? `/inbound?campaign=${campaign.id}`
                                                : `/?campaign=${campaign.id}`,
                                            open,
                                        )}
                                        data-active={
                                            current?.id === campaign.id &&
                                            !["/campaigns", "/campaigns/new"].includes(pathname)
                                        }
                                        className="group flex items-center gap-2.5 px-2.5 h-8 rounded-lg smooth text-grey-300 hover:bg-grey-150 hover:text-charcoal-100 data-[active=true]:text-charcoal-100 data-[active=true]:font-semibold"
                                    >
                                        <span className={cn(
                                            "w-1.5 h-1.5 rounded-full shrink-0",
                                            campaign.status === "active" ? "bg-mint-200" : "bg-grey-100",
                                        )} />
                                        <span className="flex-1 truncate">{campaign.name}</span>
                                        <span className="text-xs text-grey-200 tabular-nums">
                                            {campaign.companyCount}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                </section>
            </nav>
        </>
    )
}
