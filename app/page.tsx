// #region imports
import Link from "next/link"

import {
    Button,
    Pagination,
} from "@/base"

import {
    Stat,
    CompanyForm,
    ImportForm,
    LeadsToolbar,
    EmptyState,
    ErrorComponent,
    Header,
} from "@/components"

import { LeadsList } from "./LeadsList"

import {
    Funnel,
    Table,
    Target,
} from "@/icons"

import {
    getCampaigns,
    getCampaignStats,
    getCompanies,
    ICampaignStats,
    parseQuery,
} from "@/lib"
// #endregion

const _LIMIT = 25

const _STATS: {
    label: string
    key: keyof ICampaignStats
    hint?: string
    inbound?: boolean
}[] = [
    { label: "Targets", key: "companies" },
    { label: "High priority", key: "highPriority" },
    { label: "Researched", key: "researched" },
    { label: "Shortlisted", key: "shortlisted" },
    { label: "Contacted", key: "contacted" },
    { label: "New inbound", key: "inboundNew", hint: "Open inbound →", inbound: true },
]

const LeadsPage = async ({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) => {
    const query = await parseQuery(searchParams)

    const { success, data: list = [], error } = await getCampaigns()

    if (!success)
        return (
            <ErrorComponent
                title="Couldn't load campaigns"
                message={error}
            />
        )

    if (list.length === 0)
        return (
            <>
                <Header title="Leads"/>
                <EmptyState
                    icon={<Target size={16}/>}
                    title="Start with an acquisition thesis"
                    description="A campaign holds your ICP. Outbound targets and inbound deals are both scored against it."
                    action={
                        <Link href="/campaigns/new">
                            <Button size="sm">Create a campaign</Button>
                        </Link>
                    }
                />
            </>
        )

    const campaign =
        list.find(c => c.id === query.campaign) ??
        list.find(c => c.status === "active") ??
        list[0]

    const filtered = !!(query.q || query.priority || query.research_status || query.evaluation_status)

    const [
        { data: stats },
        {
            success: leadsOk,
            data: leads = [],
            count = 0,
            total: pages = 1,
            error: leadsError,
        },
    ] = await Promise.all([
        getCampaignStats(campaign.id),
        getCompanies({
            campaign_id: campaign.id,
            q: query.q,
            priority: query.priority,
            research_status: query.research_status,
            evaluation_status: query.evaluation_status,
            sort: query.sort,
            page: query.page,
            limit: _LIMIT,
        }),
    ])

    const from = count ? (query.page - 1) * _LIMIT + 1 : 0
    const to = Math.min(query.page * _LIMIT, count)

    return (
        <>
            <Header
                title="Leads"
                actions={
                    <>
                        <ImportForm campaignId={campaign.id}/>
                        <CompanyForm campaignId={campaign.id}/>
                    </>
                }
            />

            {
                stats &&
                <section className="
                    grid grid-cols-6 gap-3 
                    max-tablet:grid-cols-3 
                    max-mobile:grid-cols-2
                ">
                    {
                        _STATS.map(item => {
                            const stat = (
                                <Stat
                                    label={item.label}
                                    value={stats[item.key]}
                                    hint={item.hint}
                                    className={
                                        item.inbound ? 
                                        "hover:ring-mint-200 smooth active:ring-offset-2" : 
                                        undefined
                                    }
                                />
                            )

                            if (item.inbound)
                                return (
                                    <Link
                                        key={item.key}
                                        href={`/inbound?campaign=${campaign.id}`}
                                        className="contents"
                                    >
                                        {stat}
                                    </Link>
                                )

                            return <div key={item.key} className="contents">{stat}</div>
                        })
                    }
                </section>
            }

            <LeadsToolbar key={campaign.id}/>

            {
                !leadsOk ?
                <ErrorComponent title="Couldn't load leads" message={leadsError}/> :

                count === 0 && !filtered ?
                <EmptyState
                    icon={<Table size={16}/>}
                    title="No target companies yet"
                    description="Import a CSV from your sourcing tool or add companies one by one. Every company gets a research workspace."
                    action={
                        <div className="flex gap-2">
                            <ImportForm campaignId={campaign.id}/>
                            <CompanyForm campaignId={campaign.id}/>
                        </div>
                    }
                /> :

                count === 0 ?
                <EmptyState
                    icon={<Funnel size={16}/>}
                    title="No leads match these filters"
                    description="Try a different search, or clear the filters to see every target in this campaign."
                    action={
                        <Link href={`/?campaign=${campaign.id}`}>
                            <Button variant="secondary" size="sm">Clear filters</Button>
                        </Link>
                    }
                /> :

                <div className="flex flex-col gap-3 h-full">
                    <LeadsList companies={leads}/>

                    <footer className="
                        flex items-center justify-between 
                        gap-4 flex-wrap mt-auto
                    ">

                        <p className="text-xs text-grey-200">
                            Showing {from}–{to} of 
                            {count} {count === 1 ? "company" : "companies"}
                        </p>

                        {
                            pages > 1 && 
                            <Pagination 
                                page={query.page} 
                                count={pages}
                            />
                        }
                    </footer>
                </div>
            }
        </>
    )
}

export default LeadsPage
