import { IconProps } from "."

const Menu = ({
	size = 20,
	...props
}: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 17 14"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect
			strokeWidth={0}
			width="17"
			height="2"
			rx="1"
		/>
		<rect
			strokeWidth={0}
			y="6"
			width="17"
			height="2"
			rx="1"
		/>
		<rect
			strokeWidth={0}
			y="12"
			width="17"
			height="2"
			rx="1"
		/>
	</svg>
)

export default Menu
