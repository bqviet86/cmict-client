import { MediaTypes } from '~/constants/enums'
import { SuccessResponse } from './response.types'

export type Media = {
    url: string
    type: MediaTypes
}

export type MediaWithFile = Media & {
    file: File
}

export type UploadMediasResponse = SuccessResponse<Media[]>
