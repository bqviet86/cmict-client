import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import InputWithLabelAndError from '~/components/InputWithLabelAndError'
import { LoginReqData, loginUser } from '~/apis/users.apis'
import { routes } from '~/config'
import { UserRole } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { AuthResponse } from '~/types/users.types'
import { ErrorResponse } from '~/types/response.types'
import { setTokenToLS, setUserToLS } from '~/utils/localStorage'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from '~/utils/check'
import { handleUnprocessableEntityError } from '~/utils/handle'

type LoginResError = {
    [K in keyof LoginReqData]: string | null
}

const initialFormData: LoginReqData = {
    username: '',
    password: ''
}

function Login() {
    const navigate = useNavigate()

    const { setUser, setToken } = useContext(AppContext)
    const [formData, setFormData] = useState<LoginReqData>(initialFormData)
    const [formError, setFormError] = useState<LoginResError>(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormError((prev) => ({ ...prev, [name]: '' }))
    }

    const { mutate: mutateLogin } = useMutation({
        mutationFn: (data: LoginReqData) => loginUser(data)
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutateLogin(formData, {
            onSuccess: (resData) => {
                const result = resData.data.result as AuthResponse

                setUser(result.user)
                setToken(result.token)

                setUserToLS(result.user)
                setTokenToLS(result.token)

                if (result.user.role === UserRole.Admin) {
                    navigate(routes.adminPosts)
                    return
                }

                navigate(routes.home)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<LoginResError>(error)) {
                    const errorObjRes = handleUnprocessableEntityError<LoginResError>(error)
                    setFormError(errorObjRes)
                }

                if (isAxiosForbiddenError<ErrorResponse>(error)) {
                    toast.error(error.response?.data.message as string)
                }
            }
        })
    }

    return (
        <div className=' flex flex-col items-center py-5'>
            <form className='max-w-full rounded-lg bg-[#cff4fc] py-4 lg:py-8' onSubmit={handleSubmit}>
                <h2 className='text-center text-3xl font-medium'>Đăng nhập</h2>

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

                <div className='mx-4 mt-4 w-[400px] max-w-[calc(100%-32px)] md:mx-10 md:mt-6 md:max-w-[calc(100%-80px)] lg:mx-[60px] lg:max-w-[calc(100%-120px)]'>
                    <button
                        type='submit'
                        className='flex h-10 w-full max-w-full items-center justify-center rounded-lg bg-[#0d6efd] text-[14px] font-medium text-white transition-all hover:bg-[#0d6efd]/90 lg:h-11 lg:text-base'
                    >
                        Đăng nhập
                    </button>
                </div>

                <p className='mt-4 flex flex-wrap items-center justify-center px-4 text-[13px] md:mt-6 md:px-10 md:text-[14px] lg:px-[60px]'>
                    <span className='text-center transition-all'>Bạn chưa có tài khoản?</span>
                    <Link to={routes.register} className='ml-1 text-center font-medium text-[#0d6efd] transition-all'>
                        Đăng ký ngay
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login
