import { useEffect, useRef, useState } from 'react'
import { Location, Routes, useLocation } from 'react-router-dom'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'

import { useScrollToTop } from './hooks'

function Wrapper({ children }: { children: React.ReactNode }) {
    const location = useLocation()

    const [prevLocation, setPrevLocation] = useState<Location | null>(null)

    const LoadingBarRef = useRef<LoadingBarRef | null>(null)

    useScrollToTop()

    useEffect(() => {
        setPrevLocation(location)
        LoadingBarRef.current?.continuousStart()
    }, [location])

    useEffect(() => {
        LoadingBarRef.current?.complete()
    }, [prevLocation])

    return (
        <>
            <LoadingBar ref={LoadingBarRef} color='#8800ff' />
            <Routes>{children}</Routes>
        </>
    )
}

export default Wrapper
