// #region imports
import { Skeleton } from "@/base"
// #endregion

const Loading = () => (
	<>
		<div className="flex flex-col gap-2">
			<Skeleton size="text"/>
			<Skeleton className="h-8 w-80"/>
		</div>
		<div className="grid grid-cols-[1fr_380px] gap-5 max-tablet:grid-cols-1">
			<Skeleton className="h-[480px] rounded-2xl"/>
			<Skeleton className="h-72 rounded-2xl"/>
		</div>
	</>
)

export default Loading
