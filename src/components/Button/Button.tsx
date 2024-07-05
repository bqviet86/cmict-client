import { Link } from 'react-router-dom'

type ButtonProps = {
    to?: string
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    className?: string
    disabled?: boolean
    children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

function Button({
    to,
    icon,
    iconPosition = 'left',
    className = '',
    disabled = false,
    children,
    ...passProps
}: ButtonProps) {
    let Comp: React.ElementType = 'button'
    const props: any = { ...passProps }

    if (to) {
        props.to = to
        Comp = Link
    }

    if (disabled) {
        props.disabled = true
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key]
            }
        })
    }

    return (
        <Comp
            className={`btn flex h-10 w-40 items-center justify-center rounded-lg bg-white px-4 py-2 transition-all hover:bg-[#f2f2f2] dark:bg-[#242526] dark:hover:bg-[#4e4f50] [&+.btn]:ml-2 ${className}`}
            {...props}
        >
            {(iconPosition === 'left' && icon) || null}
            <span
                className={`text-sm font-medium text-[#65676b] transition-all dark:text-[#b0b3b8] ${
                    icon ? (iconPosition === 'left' ? 'ml-2' : 'mr-2') : ''
                }`}
            >
                {children}
            </span>
            {(iconPosition === 'right' && icon) || null}
        </Comp>
    )
}

export default Button
