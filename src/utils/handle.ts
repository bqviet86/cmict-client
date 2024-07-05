import { AxiosError } from 'axios'
import { compareAsc, format, formatDistanceToNowStrict, secondsToHours, secondsToMinutes, sub } from 'date-fns'
import { vi } from 'date-fns/locale'

import { ErrorObjResponse, ErrorResponse } from '~/types/response.types'

export const numberEnumToArray = (numberEnum: { [key: string]: any }) => {
    return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const stringEnumToArray = (stringEnum: { [key: string]: any }) => {
    return Object.values(stringEnum).filter((value) => typeof value === 'string') as string[]
}

export const handleUnprocessableEntityError = <FormError>(
    error: AxiosError<ErrorResponse<Record<keyof FormError, ErrorObjResponse>>>
) => {
    const errorObj: FormError = {} as FormError
    const errors = error.response?.data.errors

    if (errors) {
        for (const key in errors) {
            if (Object.hasOwnProperty.call(errors, key)) {
                const element = errors[key]
                errorObj[key] = element.msg as any
            }
        }
    }

    return errorObj
}

export const formatTime: (time: string, extend?: boolean) => string = (time, extend = false) => {
    const date = new Date(time)

    if (compareAsc(date, sub(new Date(), { seconds: 30 })) === 1) {
        return 'Vừa xong'
    }

    if (compareAsc(date, sub(new Date(), { months: 1 })) !== 1) {
        return format(date, (extend ? 'HH:mm ' : '') + 'dd-MM-yyyy')
    }

    const result = formatDistanceToNowStrict(date, {
        addSuffix: true,
        locale: vi
    })

    return extend ? result : result.replace('trước', '').trim()
}

export function formatDuration(seconds: number, detail: boolean = false): string {
    const hours = secondsToHours(seconds)
    const minutes = secondsToMinutes(seconds % 3600)
    const remainingSeconds = seconds % 60

    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`
    const secondsStr = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`

    return `${hours > 0 ? `${hoursStr}${detail ? 'h ' : ':'}` : ''}${minutesStr}${detail ? 'm ' : ':'}${secondsStr}${
        detail ? 's' : ''
    }`
}
