// #region imports
import { Skeleton } from "@/base"

import {
    getCampaigns,
} from "@/lib"

import { Sidenav } from "./Sidenav"
// #endregion

export const SidenavSection = async() => {
    const { success, data: campaigns = [], error } = await getCampaigns()

    return (
        <Sidenav
            campaigns={campaigns}
            error={success ? undefined : error}
        />
    )
}

export const SidenavSkeleton = () => (
    <nav
        aria-hidden
        className="
            h-[96%] shrink-0 self-center ml-6 w-60 px-3 py-4
            flex flex-col gap-6
            bg-paper border border-grey-100 rounded-2xl
            max-mobile:hidden
        "
    >
        <header className="flex items-center justify-between pl-1">
            <Skeleton className="h-7 w-14"/>
            <Skeleton className="size-8 rounded-lg"/>
        </header>

        <section className="flex flex-col gap-1 h-full min-h-0">
            <Skeleton size="row" className="h-9"/>
            <Skeleton size="row" className="h-9"/>

            <div className="flex items-center gap-2 justify-between mt-auto mb-1">
                <Skeleton size="row" className="h-9 flex-1"/>
                <Skeleton className="size-6 rounded-md shrink-0"/>
            </div>

            <div className="flex flex-col gap-0.5 mb-4">
                <Skeleton size="row" className="h-8"/>
                <Skeleton size="row" className="h-8"/>
                <Skeleton size="row" className="h-8"/>
            </div>
        </section>
    </nav>
)
