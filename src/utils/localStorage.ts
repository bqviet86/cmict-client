import { TokenResponse, User } from '~/types/users.types'

export const getTokenFromLS = () => {
    const result = localStorage.getItem('token')
    return result ? (JSON.parse(result) as TokenResponse) : null
}

export const setTokenToLS = (token: TokenResponse) => {
    localStorage.setItem('token', JSON.stringify(token))
}

export const removeTokenFromLS = () => {
    localStorage.removeItem('token')
}

export const getUserFromLS = () => {
    const result = localStorage.getItem('user')
    return result ? (JSON.parse(result) as User) : null
}

export const setUserToLS = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
}

export const removeUserFromLS = () => {
    localStorage.removeItem('user')
}
