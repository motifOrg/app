// #region imports
import { Skeleton } from "@/base"
// #endregion

const Loading = () => (
	<>
		<div className="flex items-center justify-between gap-4">
			<Skeleton className="h-8 w-40"/>
			<Skeleton className="h-9 w-36"/>
		</div>
		<section className="grid grid-cols-3 gap-4 max-desktop:grid-cols-2 max-tablet:grid-cols-1">
			{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-72 rounded-2xl"/>)}
		</section>
	</>
)

export default Loading
