import Input from '~/components/Input'

type InputWithLabelAndErrorProps = {
    title: string
    error: string | null
    wrapperClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement>

function InputWithLabelAndError({ title, error, wrapperClassName, ...inputProps }: InputWithLabelAndErrorProps) {
    return (
        <label
            className={`mx-4 mt-4 block w-[400px] max-w-[calc(100%-32px)] md:mx-10 md:mt-6 md:max-w-[calc(100%-80px)] lg:mx-[60px] lg:max-w-[calc(100%-120px)]${
                wrapperClassName ? ` ${wrapperClassName}` : ''
            }`}
        >
            <h4 className='mb-1 text-[14px] font-medium leading-[14px] transition-all lg:mb-2 lg:text-base lg:leading-4'>
                {title}
            </h4>
            <Input {...inputProps} />
            {error && <div className='mt-1 pl-2 text-[13px] text-red-500 lg:pl-3'>{error}</div>}
        </label>
    )
}

export default InputWithLabelAndError
