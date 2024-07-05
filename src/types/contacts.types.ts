import { PaginationResponse, SuccessResponse } from '~/types/response.types'
import { User } from '~/types/users.types'

export type Contact = {
    _id: string
    user: User | null
    name: string
    phone: string
    email: string
    content: string
    is_read: boolean
    created_at: string
    updated_at: string
}

export type ContactTableType = Pick<Contact, 'name' | 'phone' | 'email' | 'content' | 'is_read' | 'created_at'> & {
    key: string
    index: number
    username: string
    action: Pick<Contact, 'is_read' | '_id'>
}

export type CreateContactResponse = SuccessResponse<Contact>

export type GetAllContactsResponse = SuccessResponse<PaginationResponse<{ contacts: Contact[] }>>

export type UpdateIsReadStatusResponse = SuccessResponse<Contact>
