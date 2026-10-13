// #region imports
import Link from "next/link"
import type { Metadata } from "next"

import { Button } from "@/base"
import { Plus, Target } from "@/icons"

import {
	EmptyState,
	ErrorComponent,
	Header,
	MetaPill,
} from "@/components"

import {
	CAMPAIGN_META,
	WORKFLOW_META,
} from "@/data"

import {
	formatMoney,
	formatRange,
	getCampaigns,
	timeAgo,
} from "@/lib"
// #endregion

export const metadata: Metadata = {
	title: "Campaigns",
}

const CampaignsPage = async() => {
	const { 
        success, 
        data, 
        error 
    } = await getCampaigns({ status: "all" })

	if (!success)
		return <ErrorComponent title="Couldn't load campaigns" message={error}/>

	const list = (data ?? []).toSorted((a, b) =>
		Number(a.status === "archived") - Number(b.status === "archived")
	)

	return (
		<>
			<Header title="Campaigns"/>

			{
				list.length === 0 ?
				<EmptyState
					icon={<Target size={16}/>}
					title="No campaigns yet"
					description="Each campaign is one acquisition thesis with its own ICP, target list and inbound deals."
					action={
						<Link href="/campaigns/new">
							<Button size="sm">Create a campaign</Button>
						</Link>
					}
				/> :
				<section className="
                    grid grid-cols-3 gap-4 
                    max-desktop:grid-cols-2 
                    max-tablet:grid-cols-1
                ">
					{
						list.map(campaign =>
							<article
								key={campaign.id}
								className="
									rounded-2xl bg-paper ring-1 ring-grey-100 
                                    p-5 flex flex-col gap-4
									hover:ring-mint-200 smooth 
                                    animate-card-in
								"
							>
								<aside className="
                                    flex items-start 
                                    justify-between gap-3
                                ">
									<div className="
                                        flex flex-col 
                                        gap-1 min-w-0
                                    ">
										<h2 className="font-extrabold text-base truncate">
                                            {campaign.name}
                                        </h2>
										<span className="text-xs text-grey-200">
											{WORKFLOW_META[campaign.workflow].label} · updated {timeAgo(campaign.updatedAt)}
										</span>
									</div>

									<MetaPill 
                                        meta={CAMPAIGN_META} 
                                        value={campaign.status}
                                    />
								</aside>

								<p className="text-grey-300 line-clamp-2 min-h-10">
									{campaign.icp?.thesis || campaign.description || "No thesis written yet."}
								</p>

								<aside className="flex flex-wrap gap-1">
									{
										[
											...(campaign.icp?.industries ?? []).slice(0, 3),
											...(campaign.icp?.geographies ?? []).slice(0, 2),
										].map(tag =>
											<span 
                                                key={tag} 
                                                className="
                                                    h-6 px-2 rounded-md text-xs 
                                                    font-semibold 
                                                    bg-mint-50 text-mint-300 
                                                    inline-flex items-center
                                                "
                                            >
												{tag}
											</span>
										)
									}
									{
										campaign.icp && (campaign.icp.revenueMin || campaign.icp.revenueMax) &&
										<span className="
                                            h-6 px-2 rounded-md text-xs 
                                            font-semibold bg-grey-150 
                                            text-grey-300 inline-flex
                                            items-center
                                        ">
											{formatRange(
                                                campaign.icp.revenueMin,
                                                campaign.icp.revenueMax,
                                                formatMoney
                                            )} revenue
										</span>
									}
								</aside>



								<aside className="flex gap-2 ml-auto">
									<Link href={`/?campaign=${campaign.id}`}>
										<Button variant="primary" size="sm">Open leads</Button>
									</Link>
									<Link href={`/inbound?campaign=${campaign.id}`}>
										<Button size="sm" variant="secondary">Inbound</Button>
									</Link>
									<Link href={`/campaigns/${campaign.id}`}>
										<Button size="sm" variant="secondary">Settings</Button>
									</Link>
								</aside>
							</article>
						)
					}

					<Link
						href="/campaigns/new"
						className="
							rounded-2xl border-2 border-dashed 
                            border-grey-100 p-5 min-h-64
							flex flex-col items-center 
                            justify-center gap-2 text-grey-200
							hover:border-mint-200 hover:text-mint-300 
                            hover:bg-mint-50 smooth
						"
					>
						<Plus size={16}/>
						<span className="font-bold">New campaign</span>
					</Link>
				</section>
			}
		</>
	)
}

export default CampaignsPage
