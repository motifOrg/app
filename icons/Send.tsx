import { IconProps } from "."

const Send = ({
	size = 20,
	...props
}: IconProps) => (
    <svg 
        width={size}
        height={size} 
        viewBox="0 0 14 14" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path 
            strokeWidth={0} 
            d="M0 6.66667L1.175 7.84167L5.83333 3.19167V13.3333H7.5V3.19167L12.15 7.85L13.3333 6.66667L6.66667 0L0 6.66667Z" 
        />
    </svg>

)

export default Send
