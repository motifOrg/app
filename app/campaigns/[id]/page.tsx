// #region imports
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/base"

import {
	CampaignSettings,
	ErrorComponent,
	Header,
} from "@/components"

import { getCampaign } from "@/lib"
// #endregion

const CampaignPage = async ({ params }: {
	params: Promise<{ id: string }>
}) => {
	const { id } = await params

	const { 
        success, 
        data: campaign, 
        status, error 
    } = await getCampaign(id)

	if (status === 404 || status === 400)
		notFound()

	if (!success || !campaign)
		return <ErrorComponent title="Couldn't load the campaign" message={error}/>

	return (
		<>
			<Header
				title={campaign.name}
				actions={
					<>
						<Link href={`/inbound?campaign=${id}`}>
							<Button variant="secondary" size="sm">Inbound</Button>
						</Link>
						<Link href={`/?campaign=${id}`}>
							<Button size="sm">Open leads</Button>
						</Link>
					</>
				}
			/>
			<CampaignSettings 
                campaign={campaign}
            />
		</>
	)
}

export default CampaignPage
