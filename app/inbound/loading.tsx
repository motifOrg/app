// #region imports
import { Skeleton } from "@/base"
// #endregion

const Loading = () => (
	<>
		<div className="flex items-center justify-between gap-4 flex-wrap">
			<Skeleton className="h-8 w-32"/>
			<Skeleton className="h-9 w-80"/>
		</div>
		<Skeleton className="h-16 rounded-xl"/>
		<div className="grid grid-cols-[400px_1fr] gap-5 max-tablet:grid-cols-1">
			<Skeleton className="h-[560px] rounded-2xl"/>
			<div className="flex flex-col gap-5">
				<Skeleton className="h-40 rounded-2xl"/>
				<Skeleton className="h-32 rounded-2xl"/>
				<Skeleton className="h-64 rounded-2xl"/>
			</div>
		</div>
	</>
)

export default Loading
