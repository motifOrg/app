// #region imports
import type { Metadata } from "next"

import {
	CampaignWizard,
	Header,
} from "@/components"
// #endregion

export const metadata: Metadata = {
	title: "New campaign",
}

const NewCampaignPage = () => (
	<>
		<Header title="New campaign"/>
		<CampaignWizard/>
	</>
)

export default NewCampaignPage
