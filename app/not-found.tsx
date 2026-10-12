// #region imports
import Link from "next/link"

import { Button } from "@/base"
import { EmptyState } from "@/components"
// #endregion

const NotFound = () => (
	<EmptyState
		title="Not found"
		description="This campaign, company or deal doesn't exist, or it was deleted."
		action={
			<Link href="/">
				<Button size="sm" variant="secondary">Back to leads</Button>
			</Link>
		}
	/>
)

export default NotFound
