// #region imports
import Link from "next/link"
import type { Metadata } from "next"

import {
	Button,
	Information,
} from "@/base"

import { Inbox, Target } from "@/icons"

import {
	Card,
	Drafts,
	EmptyState,
	ErrorComponent,
	FitScore,
	GmailSetup,
	Header,
	InboundList,
	OpportunityControls,
	OpportunityForm,
} from "@/components"

import {
	formatDate,
	getCampaigns,
	getDrafts,
	getIntegrations,
	getOpportunities,
	getOpportunity,
	IOpportunityCounts,
	parseQuery,
} from "@/lib"
// #endregion

export const metadata: Metadata = {
	title: "Inbound",
}

const _EMPTY_COUNTS: IOpportunityCounts = {
	all: 0,
	new: 0,
	reviewing: 0,
	qualified: 0,
	declined: 0,
}

const Deal = async({ id }: { 
    id: string 
}) => {
	const [
		{ success, data: deal, status, error },
		{ data: drafts = [] },
	] = await Promise.all([
		getOpportunity(id),
		getDrafts({ opportunity_id: id }),
	])

	if (!success || !deal)
		return (
			<ErrorComponent
				title={
                    status === 404 ? 
                    "Deal not found" : 
                    "Couldn't load this deal"
                }
				message={
                    status === 404 ? 
                    "It may have been removed. Pick another from the list." :
                    error
                }
			/>
		)

	return (
		<div className="flex flex-col gap-5 min-w-0">
			<Card>
				<div className="flex flex-col gap-4">
					<header className="flex flex-col gap-2">
						<span className="
                            flex items-center gap-2 
                            text-xs text-grey-200
                        ">
							<span>
								{
                                    deal.source === "gmail" ? 
                                        "From Gmail" : 
                                            deal.source === "manual" ? 
                                            "Logged by hand" : 
                                            "Sample deal"
                                }
							</span>
							· {formatDate(deal.receivedAt)}
						</span>
						<h2 className="text-lg font-extrabold leading-snug">{deal.subject}</h2>
						<p className="text-grey-300">
							<span className="font-semibold text-charcoal-100">
                                {deal.senderName || deal.senderEmail}
                            </span>

							{deal.senderName && <> · <a href={`mailto:${deal.senderEmail}`} className="hover:text-mint-300">
                                {deal.senderEmail}
                            </a></>}

							{deal.companyName && <> · about <span className="font-semibold text-charcoal-100">
                                {deal.companyName}
                            </span></>}

							{deal.companyDomain && <span className="text-grey-200">
                                ({deal.companyDomain})
                            </span>}
						</p>
					</header>

					<OpportunityControls 
                        key={`${deal.id}-${deal.status}-${deal.priority}`} 
                        opportunity={deal}
                    />
				</div>
			</Card>

			<Card
				title="ICP fit"
				description="How the deal compares with this campaign's thesis"
			>
				<div className="flex items-start gap-6 flex-wrap">
					<FitScore score={deal.fitScore} size="lg"/>
					<p className="
                        flex-1 min-w-64 text-grey-300 
                        leading-relaxed
                    ">
						{deal.fitSummary || "No fit summary yet. Scoring inbound deals needs the research provider, which isn't connected. Read the email and qualify it by hand."}
					</p>
				</div>
				{
					deal.companyId &&
					<Link 
                        href={`/companies/${deal.companyId}?campaign=${deal.campaignId}`} 
                        className="inline-block mt-4"
                    >
						<Button 
                            variant="neutral" 
                            size="sm"
                        >
                            Open company research
                        </Button>
					</Link>
				}
			</Card>

			<Card title="Email">
				<p className="
                    whitespace-pre-wrap leading-relaxed
                     text-charcoal-100
                ">
					{
                        deal.body || 
                        <span className="text-grey-200">
                            No body was captured.
                        </span>
                    }
				</p>
			</Card>

			<Card
				title="Reply"
				description="Drafts stay in Motif until you review and copy them. Nothing is sent automatically."
			>
				<Drafts kind="reply" opportunityId={deal.id} drafts={drafts}/>
			</Card>
		</div>
	)
}

const InboundPage = async ({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}) => {
	const query = await parseQuery(searchParams)

	const [
		{ success, data: list = [], error },
		{ data: integrations },
	] = await Promise.all([
		getCampaigns(),
		getIntegrations(),
	])

	if (!success)
		return <ErrorComponent title="Couldn't load campaigns" message={error}/>

	if (list.length === 0)
		return (
			<EmptyState
				icon={<Target size={16}/>}
				title="Create a campaign first"
				description="Inbound deals are checked against a campaign's ICP, so you need one before logging deals."
				action={<Link href="/campaigns/new"><Button size="sm">Create a campaign</Button></Link>}
			/>
		)

	const campaign =
		list.find(c => c.id === query.campaign) ??
		list.find(c => c.status === "active") ??
		list[0]

	const {
		success: inboundOk,
		data,
		error: inboundError,
	} = await getOpportunities({
		campaign_id: campaign.id,
		q: query.q || undefined,
		status: query.status || undefined,
	})

	const { opportunities = [], counts = _EMPTY_COUNTS } = data ?? {}
	const selected = query.id || opportunities[0]?.id
	const gmail = integrations?.gmail

	return (
		<>
			<Header
				title="Inbound"
				actions={
					<>
						{
                            gmail && 
                            <GmailSetup 
                                gmail={gmail} 
                                campaignId={campaign.id}
                                gmailLabel={campaign.gmailLabel}
                            />
                        }
						<OpportunityForm campaignId={campaign.id}/>
					</>
				}
			/>

			{
				gmail && !gmail.connected &&
				<Information
					variant="warning"
					title="Gmail isn't connected"
					description="Set GMAIL_CREDENTIALS and GMAIL_USER in core/.env, then restart the API. Until then, log deals by hand."
				/>
			}

			{
				!inboundOk ?
				<ErrorComponent title="Couldn't load inbound deals" message={inboundError}/> :

				counts.all === 0 ?
				<EmptyState
					icon={<Inbox size={16}/>}
					title="No inbound deals yet"
					description="Log a deal from a broker email or teaser, and it'll be listed here for review."
					action={<OpportunityForm campaignId={campaign.id}/>}
				/> :

				<section className="grid grid-cols-[400px_1fr] gap-5 items-start max-tablet:grid-cols-1">
					<InboundList
						key={campaign.id}
						opportunities={opportunities}
						counts={counts}
						selected={selected}
					/>
					{
						selected
							? <Deal key={selected} id={selected}/>
							: <EmptyState title="Nothing selected" description="Pick a deal from the list."/>
					}
				</section>
			}
		</>
	)
}

export default InboundPage
