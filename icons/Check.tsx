import { IconProps } from "."

const Check = ({
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
			d="M20.7 5.3a1 1 0 0 1 0 1.4l-11 11a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.4L9 15.6 19.3 5.3a1 1 0 0 1 1.4 0Z"
		/>
	</svg>
)

export default Check
