import { useContext, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Input } from 'antd'
import toast from 'react-hot-toast'

import Panel from '~/components/Panel'
import InputWithLabelAndError from '~/components/InputWithLabelAndError'
import Button from '~/components/Button'
import { createContact, CreateContactReqBody, CreateContactReqData } from '~/apis/contacts.apis'
import { AppContext } from '~/contexts/appContext'
import { isAxiosUnprocessableEntityError } from '~/utils/check'
import { handleUnprocessableEntityError } from '~/utils/handle'

type CreateContactResError = {
    [K in keyof CreateContactReqBody]: string | null
}

const initialFormData: CreateContactReqBody = {
    name: '',
    phone: '',
    email: '',
    content: ''
}

function Contact() {
    const { user } = useContext(AppContext)
    const [formData, setFormData] = useState<CreateContactReqBody>({
        ...initialFormData,
        ...(user ? { name: user.name } : {})
    })
    const [formError, setFormError] = useState<CreateContactResError>(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormError((prev) => ({ ...prev, [name]: '' }))
    }

    const { mutate: mutateCreateContact } = useMutation({
        mutationFn: ({ body, params }: CreateContactReqData) => createContact({ body, params })
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutateCreateContact(
            { body: formData, params: { verify_access_token: !!user } },
            {
                onSuccess: () => {
                    setFormData(initialFormData)
                    toast.success('Gửi thông tin thành công!')
                },
                onError: (error) => {
                    if (isAxiosUnprocessableEntityError<CreateContactResError>(error)) {
                        const errorObjRes = handleUnprocessableEntityError<CreateContactResError>(error)
                        setFormError(errorObjRes)
                    }
                }
            }
        )
    }

    return (
        <Panel title='Liên hệ' color='#e74c3c'>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-2 text-center'>
                    <h2 className='text-[15px] font-semibold'>Trung tâm Công nghệ Thông tin và Truyền thông Cà Mau</h2>
                    <p className='text-[15px]'>Địa chỉ: 284 - Trần Hưng Đạo - Phường 5 - Tp. Cà Mau</p>
                    <p className='text-[15px]'>Điện thoại: (0290) 3 567854 - Fax: (0290) 3 567854</p>
                    <p className='text-[15px]'>
                        Email:{' '}
                        <a href='mailto:vttai09092009@gmail.com' className='text-[#4096ff] underline'>
                            vttai09092009@gmail.com
                        </a>
                    </p>
                    <p className='text-left'>Hoặc gửi thông tin liên hệ cho chúng tôi tại đây:</p>
                </div>

                <InputWithLabelAndError
                    title='Họ và tên'
                    error={formError.name}
                    name='name'
                    placeholder='Nguyễn Văn A'
                    value={formData.name}
                    onChange={handleChange}
                    wrapperClassName='!mx-0 !w-full !max-w-full'
                />

                <InputWithLabelAndError
                    title='Điện thoại'
                    error={formError.phone}
                    name='phone'
                    placeholder='0123456789'
                    value={formData.phone}
                    onChange={handleChange}
                    wrapperClassName='!mx-0 !w-full !max-w-full'
                />

                <InputWithLabelAndError
                    title='Email'
                    error={formError.email}
                    name='email'
                    placeholder='abc@gmail.com'
                    value={formData.email}
                    onChange={handleChange}
                    wrapperClassName='!mx-0 !w-full !max-w-full'
                />

                <label className='!mx-0 mt-4 block !w-full !max-w-full md:mt-6 '>
                    <h4 className='mb-1 text-[14px] font-medium leading-[14px] transition-all lg:mb-2 lg:text-base lg:leading-4'>
                        Nội dung
                    </h4>
                    <Input.TextArea
                        rows={5}
                        name='content'
                        placeholder='Nhập nội dung'
                        value={formData.content}
                        onChange={handleChange}
                    />
                    {formError.content && (
                        <div className='mt-1 pl-2 text-[13px] text-red-500 lg:pl-3'>{formError.content}</div>
                    )}
                </label>

                <Button
                    type='submit'
                    className='!mx-auto !mt-5 !bg-gradient-to-r !from-cyan-500 !to-blue-500 [&>span]:!text-white'
                >
                    Gửi thông tin
                </Button>
            </form>
        </Panel>
    )
}

export default Contact
