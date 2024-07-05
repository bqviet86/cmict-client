export type SuccessResponse<Data = unknown> = {
    message: string
    result?: Data
}

export type ErrorResponse<Error = unknown> = {
    message: string
    errors?: Error
}

export type ErrorObjResponse = {
    location: string
    msg: string
    path: string
    type: string
    value: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationResponse<Fields extends Record<string, any>> = Fields & {
    page: number
    limit: number
    total_pages: number
}
