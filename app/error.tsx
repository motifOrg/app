"use client"

// #region imports
import { Button } from "@/base"
import { ErrorComponent } from "@/components"
// #endregion

const ErrorPage = ({ error, reset }: {
	error: Error & { digest?: string }
	reset: () => void
}) => (
	<ErrorComponent
		message={error.message || undefined}
		action={
			<Button size="sm" variant="secondary" onClick={reset}>
				Try again
			</Button>
		}
	/>
)

export default ErrorPage
