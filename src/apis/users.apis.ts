import { SuccessResponse } from '~/types/response.types'
import {
    GetAllUsersResponse,
    GetMeResponse,
    LoginResponse,
    RefreshTokenResponse,
    RegisterResponse,
    UpdateMyAvatarResponse,
    UpdateMyProfileResponse,
    User
} from '~/types/users.types'
import http from '~/utils/http'

export type LoginReqData = {
    username: string
    password: string
}

export type RegisterReqData = Pick<User, 'name' | 'username' | 'sex'> & {
    password: string
    confirm_password: string
}

export type UpdateMyProfileReqData = Partial<Pick<User, 'name' | 'username' | 'sex'>>

export type GetAllUsersReqData = {
    name?: string
    is_active?: boolean
    page: number
    limit: number
}

export type UpdateActiveStatusReqData = {
    username: string
    is_active: boolean
}

export const loginUser = (data: LoginReqData) => http.post<LoginResponse>('/users/login', data)

export const registerUser = (data: RegisterReqData) => http.post<RegisterResponse>('/users/register', data)

export const logoutUser = (refresh_token: string) => http.post<SuccessResponse>('/users/logout', { refresh_token })

export const refreshToken = (refresh_token: string) =>
    http.post<RefreshTokenResponse>('/users/refresh-token', { refresh_token })

export const getMe = () => http.get<GetMeResponse>('/users/me')

export const updateMyAvatar = (data: FormData) => http.patch<UpdateMyAvatarResponse>('/users/update-avatar', data)

export const updateMyProfile = (data: UpdateMyProfileReqData) => http.patch<UpdateMyProfileResponse>('/users/me', data)

export const getAllUsers = ({ name, is_active, page, limit }: GetAllUsersReqData) =>
    http.get<GetAllUsersResponse>('/users/admin/all-users', { params: { name, is_active, page, limit } })

export const updateActiveStatus = ({ username, is_active }: UpdateActiveStatusReqData) =>
    http.patch<SuccessResponse>(`/users/admin/update-active-status/${username}`, { is_active })
