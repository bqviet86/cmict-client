import { memo } from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

type LoadingProps = {
    className?: string
    loaderClassName?: string
    loaderSize?: number
}

function Loading({ className, loaderClassName, loaderSize = 24 }: LoadingProps) {
    return (
        <Spin
            className={className}
            indicator={
                <LoadingOutlined
                    spin
                    className={`text-[#1d76d6] transition-all dark:text-white ${loaderClassName || ''}`}
                    style={{ fontSize: loaderSize }}
                />
            }
        />
    )
}

export default memo(Loading)
