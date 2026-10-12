import { IconProps } from "."

const Document = ({
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
			d="M7 2h7.59a1 1 0 0 1 .7.3l4.42 4.4a1 1 0 0 1 .29.71V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 2v16h11V9h-4a1 1 0 0 1-1-1V4H7Zm8 1.41V7h1.59L15 5.41ZM9 12h6a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2Zm0 4h6a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2Z"
		/>
	</svg>
)

export default Document
