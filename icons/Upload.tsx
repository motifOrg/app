import { IconProps } from "."

const Upload = ({
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
			d="M12 3a1 1 0 0 1 .7.3l4 4a1 1 0 1 1-1.4 1.4L13 6.42V15a1 1 0 1 1-2 0V6.41L8.7 8.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 12 3ZM4 14a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1Z"
		/>
	</svg>
)

export default Upload
