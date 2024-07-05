import { CreateContactResponse, GetAllContactsResponse, UpdateIsReadStatusResponse } from '~/types/contacts.types'
import http from '~/utils/http'

export type CreateContactReqBody = {
    name: string
    phone: string
    email: string
    content: string
}

export type CreateContactReqParams = {
    verify_access_token: boolean
}

export type CreateContactReqData = {
    body: CreateContactReqBody
    params: CreateContactReqParams
}

export type GetAllContactsReqQuery = {
    is_read?: boolean
    page: number
    limit: number
}

export type UpdateIsReadStatusContactReqData = {
    contact_id: string
    is_read: boolean
}

export const createContact = ({ params, body }: CreateContactReqData) =>
    http.post<CreateContactResponse>('/contacts', body, { params })

export const getAllContacts = (params: GetAllContactsReqQuery) =>
    http.get<GetAllContactsResponse>('/contacts/all', { params })

export const updateIsReadStatusContact = ({ contact_id, is_read }: UpdateIsReadStatusContactReqData) =>
    http.patch<UpdateIsReadStatusResponse>(`/contacts/update-is-read-status/${contact_id}`, { is_read })
