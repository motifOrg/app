import { IconProps } from "."

const Table = ({
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
			d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v3h14V5H5Zm0 5v4h4v-4H5Zm6 0v4h8v-4h-8Zm-6 6v3h4v-3H5Zm6 0v3h8v-3h-8Z"
		/>
	</svg>
)

export default Table
