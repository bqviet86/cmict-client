import { Fragment, useContext, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Icon } from '@iconify/react'
import { Radio, RadioChangeEvent } from 'antd'
import toast from 'react-hot-toast'
import { pick } from 'lodash'

import Panel from '~/components/Panel'
import Loading from '~/components/Loading'
import InputWithLabelAndError from '~/components/InputWithLabelAndError'
import Button from '~/components/Button'
import { getMe, updateMyAvatar, updateMyProfile, UpdateMyProfileReqData } from '~/apis/users.apis'
import images from '~/assets/images'
import { Sex } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { User } from '~/types/users.types'
import { Media } from '~/types/medias.types'
import { isAxiosUnprocessableEntityError } from '~/utils/check'
import { handleUnprocessableEntityError } from '~/utils/handle'

type UpdateProfileResError = UpdateMyProfileReqData

function MyProfile() {
    const { setUser } = useContext(AppContext)
    const [profile, setProfile] = useState<User | null>(null)
    const [formData, setFormData] = useState<UpdateMyProfileReqData | null>(null)
    const [formError, setFormError] = useState<UpdateProfileResError>({})

    const { isFetching } = useQuery({
        queryKey: ['myProfile'],
        queryFn: async () => {
            const response = await getMe()
            const result = response.data.result as User

            setProfile(result)
            setFormData(pick(result, ['name', 'username', 'sex']))

            return result
        }
    })

    const { mutate: mutateUpdateAvatar } = useMutation({
        mutationFn: (data: FormData) => updateMyAvatar(data)
    })

    const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) return

        const formData = new FormData()

        formData.append('image', file)

        mutateUpdateAvatar(formData, {
            onSuccess: (response) => {
                const result = response.data.result as Media
                const newAvatar = result.url.split('/').slice(-1)[0]

                setUser((prev) => ({ ...(prev as User), avatar: newAvatar }))
                setProfile((prev) => ({ ...(prev as User), avatar: newAvatar }))
                toast.success('Cập nhật ảnh đại diện thành công!')
            }
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormError((prev) => ({ ...prev, [name]: '' }))
    }

    const handleChangeSex = (e: RadioChangeEvent) => {
        setFormData((prev) => ({ ...prev, sex: e.target.value }))
    }

    const { mutate: mutateUpdateMyProfile } = useMutation({
        mutationFn: (data: UpdateMyProfileReqData) => updateMyProfile(data)
    })

    const handleUpdateMyProfile = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formData) return

        mutateUpdateMyProfile(formData, {
            onSuccess: (response) => {
                const result = response.data.result as User

                toast.success('Cập nhật thông tin cá nhân thành công!')
                setUser(result)
                setProfile(result)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<UpdateProfileResError>(error)) {
                    const errorObjRes = handleUnprocessableEntityError<UpdateProfileResError>(error)
                    setFormError(errorObjRes)
                }
            }
        })
    }

    return profile && formData ? (
        <Panel title='Thông tin cá nhân' color='#e74c3c'>
            <div className='mx-auto flex flex-col items-center gap-1 pb-10 pt-4 lg:w-1/3'>
                <div className='group relative h-40 w-40 overflow-hidden rounded-full'>
                    <img
                        src={
                            profile.avatar
                                ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${profile.avatar}`
                                : images.avatar
                        }
                        alt='avatar'
                        className='h-full w-full object-cover'
                    />

                    <div className='invisible absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-white/30 opacity-0 transition-all group-hover:visible group-hover:opacity-100'>
                        <Icon icon='ic:baseline-camera-alt' className='h-10 w-10 text-black/70' />
                        <label htmlFor='upload-avatar' className='absolute inset-0 cursor-pointer rounded-full' />
                        <input
                            id='upload-avatar'
                            type='file'
                            accept='image/*'
                            className='invisible block h-0 w-0'
                            onChange={handleUploadAvatar}
                        />
                    </div>
                </div>

                <h2 className='mt-5 line-clamp-1 text-3xl font-semibold'>{profile.name}</h2>
            </div>

            <form className='mx-auto w-max' onSubmit={handleUpdateMyProfile}>
                <InputWithLabelAndError
                    title='Họ tên'
                    error={formError.name || ''}
                    name='name'
                    placeholder='Nguyễn Văn A'
                    value={formData.name}
                    onChange={handleChange}
                />

                <InputWithLabelAndError
                    title='Tên đăng nhập'
                    error={formError.username || ''}
                    name='username'
                    placeholder='Tên đăng nhập'
                    value={formData.username}
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

                <Button
                    type='submit'
                    className='!mx-auto !mt-5 !bg-gradient-to-r !from-cyan-500 !to-blue-500 [&>span]:!text-white'
                >
                    Cập nhật
                </Button>
            </form>
        </Panel>
    ) : isFetching ? (
        <Loading loaderSize={40} className='flex h-[calc(100vh-60px)] w-full items-center justify-center' />
    ) : (
        <Fragment />
    )
}

export default MyProfile
