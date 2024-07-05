import { UploadMediasResponse } from '~/types/medias.types'
import http from '~/utils/http'

export const uploadImages = (data: FormData) => http.post<UploadMediasResponse>('/medias/upload-image', data)
