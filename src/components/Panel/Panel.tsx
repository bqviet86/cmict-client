type PanelProps = {
    children: React.ReactNode
    title: string
    size?: 'small' | 'medium' | 'large'
    color: string
    titlePosition?: 'left' | 'center' | 'right'
    titleTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'none'
    className?: string
}

function Panel({
    children,
    title,
    size = 'medium',
    color,
    titlePosition = 'center',
    titleTransform = 'uppercase',
    className = ''
}: PanelProps) {
    return (
        <div
            className={`w-full border-x border-b border-t-4 border-solid border-[#ddd] shadow-sm ${className}`}
            style={{ borderTopColor: color }}
        >
            <div className='flex min-h-10 items-center border-b border-solid border-[#ddd] px-2 py-1'>
                <h1
                    className='w-full font-medium'
                    style={{
                        fontSize: size === 'small' ? '14px' : size === 'medium' ? '18px' : '22px',
                        textAlign: titlePosition,
                        textTransform: titleTransform,
                        color
                    }}
                >
                    {title}
                </h1>
            </div>

            <div className='p-4'>{children}</div>
        </div>
    )
}

export default Panel
