// #region imports
import { Skeleton } from "@/base"
// #endregion

const Loading = () => (
	<>
		<div className="flex flex-col gap-2">
			<Skeleton size="text"/>
			<Skeleton className="h-8 w-96"/>
			<Skeleton className="h-4 w-72"/>
		</div>
		<div className="grid grid-cols-[1fr_380px] gap-5 max-tablet:grid-cols-1">
			<div className="flex flex-col gap-5">
				<Skeleton className="h-9 w-72"/>
				<Skeleton className="h-48 rounded-2xl"/>
				<Skeleton className="h-80 rounded-2xl"/>
			</div>
			<Skeleton className="h-[600px] rounded-2xl"/>
		</div>
	</>
)

export default Loading
