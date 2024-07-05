import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Radio, RadioChangeEvent } from 'antd'
import { useMutation } from '@tanstack/react-query'

import InputWithLabelAndError from '~/components/InputWithLabelAndError'
import { RegisterReqData, registerUser } from '~/apis/users.apis'
import { routes } from '~/config'
import { Sex } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { AuthResponse } from '~/types/users.types'
import { setTokenToLS, setUserToLS } from '~/utils/localStorage'
import { isAxiosUnprocessableEntityError } from '~/utils/check'
import { handleUnprocessableEntityError } from '~/utils/handle'

type RegisterResError = {
    [K in keyof RegisterReqData]: string | null
}

const initialFormData: RegisterReqData = {
    name: '',
    username: '',
    password: '',
    confirm_password: '',
    sex: Sex.Male
}

function Register() {
    const navigate = useNavigate()

    const { setUser, setToken } = useContext(AppContext)
    const [formData, setFormData] = useState<RegisterReqData>(initialFormData)
    const [formError, setFormError] = useState<RegisterResError>(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormError((prev) => ({ ...prev, [name]: '' }))
    }

    const handleChangeSex = (e: RadioChangeEvent) => {
        setFormData((prev) => ({ ...prev, sex: e.target.value }))
    }

    const { mutate: mutateRegister } = useMutation({
        mutationFn: (data: RegisterReqData) => registerUser(data)
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutateRegister(formData, {
            onSuccess: (resData) => {
                const result = resData.data.result as AuthResponse

                setUser(result.user)
                setUserToLS(result.user)

                setToken(result.token)
                setTokenToLS(result.token)

                navigate(routes.home)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<RegisterResError>(error)) {
                    const errorObjRes = handleUnprocessableEntityError<RegisterResError>(error)
                    setFormError(errorObjRes)
                }
            }
        })
    }

    return (
        <div className=' flex flex-col items-center py-5'>
            <form className='max-w-full rounded-lg bg-[#cff4fc] py-4 lg:py-8' onSubmit={handleSubmit}>
                <h2 className='text-center text-3xl font-medium'>Đăng ký</h2>

                <InputWithLabelAndError
                    title='Tên'
                    error={formError.name}
                    name='name'
                    placeholder='Nguyễn Văn A'
                    value={formData.name}
                    onChange={handleChange}
                />

                <InputWithLabelAndError
                    title='Tên đăng nhập'
                    error={formError.username}
                    name='username'
                    placeholder='Tên đăng nhập'
                    value={formData.username}
                    onChange={handleChange}
                />

                <InputWithLabelAndError
                    title='Mật khẩu'
                    error={formError.password}
                    type='password'
                    name='password'
                    placeholder='Mật khẩu'
                    value={formData.password}
                    onChange={handleChange}
                />

                <InputWithLabelAndError
                    title='Xác nhận mật khẩu'
                    error={formError.confirm_password}
                    type='password'
                    name='confirm_password'
                    placeholder='Xác nhận mật khẩu'
                    value={formData.confirm_password}
                    onChange={handleChange}
                />

                <div className='mx-4 mt-4 flex flex-col md:mx-10 md:mt-6 lg:mx-[60px]'>
                    <h4 className='mb-1 text-[14px] font-medium leading-[14px] transition-all lg:mb-2 lg:text-base lg:leading-4'>
                        Giới tính
                    </h4>
                    <Radio.Group value={formData.sex} onChange={handleChangeSex} className='flex flex-1 items-center'>
                        <Radio value={Sex.Male} className='lg:text-base'>
                            Nam
                        </Radio>
                        <Radio value={Sex.Female} className='lg:text-base'>
                            Nữ
                        </Radio>
                    </Radio.Group>
                </div>

                <div className='mx-4 mt-4 w-[400px] max-w-[calc(100%-32px)] md:mx-10 md:mt-6 md:max-w-[calc(100%-80px)] lg:mx-[60px] lg:max-w-[calc(100%-120px)]'>
                    <button
                        type='submit'
                        className='flex h-10 w-full max-w-full items-center justify-center rounded-lg bg-[#0d6efd] text-[14px] font-medium text-white transition-all hover:bg-[#0d6efd]/90 lg:h-11 lg:text-base'
                    >
                        Đăng ký
                    </button>
                </div>

                <p className='mt-4 flex flex-wrap items-center justify-center px-4 text-[13px] md:mt-6 md:px-10 md:text-[14px] lg:px-[60px]'>
                    <span className='text-center transition-all'>Bạn đã có tài khoản?</span>
                    <Link to={routes.login} className='ml-1 text-center font-medium text-[#0d6efd] transition-all'>
                        Đăng nhập ngay
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Register
