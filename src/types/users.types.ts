import { Sex, UserRole } from '~/constants/enums'
import { PaginationResponse, SuccessResponse } from './response.types'
import { Media } from './medias.types'

export type User = {
    _id: string
    name: string
    username: string
    sex: Sex
    role: UserRole
    avatar: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type TokenResponse = {
    access_token: string
    refresh_token: string
}

export type AuthResponse = {
    user: User
    token: TokenResponse
}

export type UserTableType = Pick<User, 'name' | 'username' | 'is_active'> & {
    key: string
    index: number
    sex: string
    avatar: Pick<User, 'name' | 'avatar'>
    action: Pick<User, 'name' | 'username' | 'is_active'>
}

export type LoginResponse = SuccessResponse<AuthResponse>

export type RegisterResponse = SuccessResponse<AuthResponse>

export type RefreshTokenResponse = SuccessResponse<TokenResponse>

export type GetMeResponse = SuccessResponse<User>

export type UpdateMyAvatarResponse = SuccessResponse<Media>

export type UpdateMyProfileResponse = SuccessResponse<User>

export type GetAllUsersResponse = SuccessResponse<PaginationResponse<{ users: User[] }>>
