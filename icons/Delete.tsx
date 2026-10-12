import { IconProps } from "."

const Delete = ({
	size = 20,
	...props
}: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 56 72"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M4 64C4 68.4 7.6 72 12 72H44C48.4 72 52 68.4 52 64V24C52 19.6 48.4 16 44 16H12C7.6 16 4 19.6 4 24V64ZM16 24H40C42.2 24 44 25.8 44 28V60C44 62.2 42.2 64 40 64H16C13.8 64 12 62.2 12 60V28C12 25.8 13.8 24 16 24ZM42 4L39.16 1.16C38.44 0.44 37.4 0 36.36 0H19.64C18.6 0 17.56 0.44 16.84 1.16L14 4H4C1.8 4 0 5.8 0 8C0 10.2 1.8 12 4 12H52C54.2 12 56 10.2 56 8C56 5.8 54.2 4 52 4H42Z"
			strokeWidth={1}
		/>
	</svg>
)

export default Delete
