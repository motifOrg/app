import { IconProps } from "."

const Cancel = ({
	size = 20,
	...props
}: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 9 9"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M0.75 0.75L7.75 7.75M7.75 0.75L0.75 7.75"
			strokeWidth={1.2}
			strokeLinecap="round"
		/>
	</svg>
)

export default Cancel
