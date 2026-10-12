// #region imports
import { Progress } from "@/base"
import { Logo } from "@/icons"
// #endregion

const Loading = () => (
	<section
		className="
			w-full h-full flex flex-col
			items-center justify-center p-10
			gap-6
		"
	>
		<span className="
			w-18 h-18 rounded-full bg-white text-white
			flex items-center justify-center animate-pulse
		">
			<Logo size={48} className="text-primary"/>
		</span>

		<Progress
			className="w-40!"
		/>
	</section>
)

export default Loading
