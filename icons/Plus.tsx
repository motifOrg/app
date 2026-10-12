import { IconProps } from "."

const Plus = ({
	size = 20,
	...props
}: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			strokeWidth={0}
			d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1Z"
		/>
	</svg>
)

export default Plus
