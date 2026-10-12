// #region imports
import { Skeleton } from "@/base"

import {
    getCampaigns,
} from "@/lib"

import { Sidenav } from "./Sidenav"
// #endregion

export const SidenavSection = async() => {
    const campaigns = await getCampaigns()

    return (
        <Sidenav
            campaigns={campaigns.data ?? []}
            error={campaigns.success ? undefined : campaigns.error}
        />
    )
}

export const SidenavSkeleton = () => (
    <nav className="
        h-full w-60 shrink-0 bg-paper border-r border-grey-100
        flex flex-col gap-6 p-3 py-4 max-mobile:hidden
    ">
        <Skeleton className="h-8 w-28"/>
        <div className="flex flex-col gap-2">
            <Skeleton size="row" className="h-8"/>
            <Skeleton size="row" className="h-8"/>
            <Skeleton size="row" className="h-8"/>
        </div>
        <div className="flex flex-col gap-2">
            <Skeleton size="text"/>
            <Skeleton size="row" className="h-7"/>
            <Skeleton size="row" className="h-7"/>
        </div>
    </nav>
)
