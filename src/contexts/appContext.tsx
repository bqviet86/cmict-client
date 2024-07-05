import { createContext, useEffect, useState } from 'react'

import { TokenResponse, User } from '~/types/users.types'
import { listenEvent } from '~/utils/event'
import { getTokenFromLS, getUserFromLS } from '~/utils/localStorage'

type AppContextType = {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    token: TokenResponse | null
    setToken: React.Dispatch<React.SetStateAction<TokenResponse | null>>
}

const defaultFunction = () => {}
const initialAppContext: AppContextType = {
    user: getUserFromLS(),
    setUser: defaultFunction,
    token: getTokenFromLS(),
    setToken: defaultFunction
}

export const AppContext = createContext<AppContextType>(initialAppContext)

function AppProvider({
    children,
    defaultValue = initialAppContext
}: {
    children: React.ReactNode
    defaultValue?: AppContextType
}) {
    const [user, setUser] = useState<User | null>(defaultValue.user)
    const [token, setToken] = useState<TokenResponse | null>(defaultValue.token)

    useEffect(() => {
        const remove = listenEvent<TokenResponse>('refresh-token-success', ({ detail }) =>
            setToken(detail as TokenResponse)
        )
        return remove
    }, [])

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
