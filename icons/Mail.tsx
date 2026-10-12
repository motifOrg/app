import { IconProps } from "."

const Mail = ({
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
			d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.5l8 5 8-5V6H4Zm16 2.85-7.47 4.67a1 1 0 0 1-1.06 0L4 8.85V18h16V8.85Z"
		/>
	</svg>
)

export default Mail
