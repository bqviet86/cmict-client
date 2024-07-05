export const sendEvent = <T>(eventName: string, detail?: T) => {
    document.dispatchEvent(new CustomEvent<T>(eventName, { detail }))
}

export const listenEvent = <T>(
    eventName: string,
    handler: ({ detail }: CustomEventInit<T>) => void,
    context: Document | HTMLElement = document
) => {
    context.addEventListener(eventName, handler)
    return () => context.removeEventListener(eventName, handler)
}
