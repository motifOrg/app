import { IconProps } from "."

const Sparkle = ({
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
			d="M11 2a1 1 0 0 1 .95.68l1.6 4.77 4.77 1.6a1 1 0 0 1 0 1.9l-4.77 1.6-1.6 4.77a1 1 0 0 1-1.9 0l-1.6-4.77-4.77-1.6a1 1 0 0 1 0-1.9l4.77-1.6 1.6-4.77A1 1 0 0 1 11 2Zm8 13a.75.75 0 0 1 .71.51l.48 1.3 1.3.48a.75.75 0 0 1 0 1.42l-1.3.48-.48 1.3a.75.75 0 0 1-1.42 0l-.48-1.3-1.3-.48a.75.75 0 0 1 0-1.42l1.3-.48.48-1.3A.75.75 0 0 1 19 15Z"
		/>
	</svg>
)

export default Sparkle
