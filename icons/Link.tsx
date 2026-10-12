import { IconProps } from "."

const Link = ({
	size = 20,
	...props
}: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 12 12"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path d="M5.2 8.4 3.6 10a1.4 1.4 0 0 1-2-2l1.6-1.6a1.4 1.4 0 0 1 2 2L4.4 8.8l.8.8.8-.8a1.4 1.4 0 1 1 2 2L6.4 10a1.4 1.4 0 0 1-2-2l.8-.8Z"/>
		<path d="M6.8 3.6 8.4 2a1.4 1.4 0 1 1 2 2L8.8 5.6a1.4 1.4 0 0 1-2-2L7.6 4.4l-.8-.8-.8.8a1.4 1.4 0 1 1-2-2L5.6 2a1.4 1.4 0 0 1 2 2l-.8.8.8.8Z"/>
		<path d="M4.6 7.4 7.4 4.6l.8.8-2.8 2.8-.8-.8Z"/>
	</svg>
)

export default Link
