import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pagination as AntdPagination, Radio, Table } from 'antd'
import toast from 'react-hot-toast'
import { isBoolean, pick } from 'lodash'

import Button from '~/components/Button'
import { GetAllUsersReqData, UpdateActiveStatusReqData, getAllUsers, updateActiveStatus } from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { Sex } from '~/constants/enums'
import { useQueryParams } from '~/hooks'
import { Pagination } from '~/types/commons.types'
import { User, UserTableType } from '~/types/users.types'

const LIMIT = 10

function AdminUser() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { page, search_name, is_active } = useQueryParams()

    const [users, setUsers] = useState<UserTableType[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: Number(page) || 1, total_pages: 0 })
    const [name, setName] = useState<string>(search_name || '')
    const [isActive, setIsActive] = useState<boolean | undefined>(
        is_active === 'true' ? true : is_active === 'false' ? false : undefined
    )

    const getAllUsersQueryFn = async ({ name, is_active, page, limit }: GetAllUsersReqData) => {
        const response = await getAllUsers({ name, is_active, page, limit })
        const { result } = response.data

        setUsers(
            (result?.users as User[]).map((user, index) => ({
                ...pick(user, ['name', 'username', 'is_active']),
                key: user._id,
                index: (page - 1) * LIMIT + index + 1,
                sex: user.sex === Sex.Male ? 'Nam' : 'Nữ',
                avatar: pick(user, ['name', 'avatar']),
                action: pick(user, ['name', 'username', 'is_active'])
            }))
        )
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })
        navigate(
            `${routes.adminUsers}?page=${page}` +
                (name ? `&search_name=${encodeURIComponent(name)}` : '') +
                (isBoolean(is_active) ? `&is_active=${is_active}` : '')
        )

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['allUsers', { page: pagination.page, limit: LIMIT }],
        queryFn: () =>
            getAllUsersQueryFn({
                name: name || undefined,
                is_active: isActive,
                page: pagination.page,
                limit: LIMIT
            })
    })

    const handleFilterUsers = () => {
        queryClient.fetchQuery({
            queryKey: ['allUsers', { page: 1, limit: LIMIT }],
            queryFn: () =>
                getAllUsersQueryFn({
                    name: name || undefined,
                    is_active: isActive,
                    page: 1,
                    limit: LIMIT
                })
        })
    }

    const { mutate: mutateUpdateActiveStatus } = useMutation({
        mutationFn: (data: UpdateActiveStatusReqData) => updateActiveStatus(data)
    })

    const handleUpdateActiveStatus = ({ name, username, is_active }: UpdateActiveStatusReqData & { name: string }) => {
        mutateUpdateActiveStatus(
            { username, is_active },
            {
                onSuccess: () => {
                    setUsers((prev) =>
                        prev.map((user) =>
                            user.username === username
                                ? {
                                      ...user,
                                      is_active,
                                      action: { ...user.action, is_active }
                                  }
                                : user
                        )
                    )
                    toast.success(
                        is_active ? `Người dùng ${name} đã được mở khoá thành công` : `Đã khoá người dùng ${name}`
                    )
                }
            }
        )
    }

    return (
        <>
            <div className='w-max max-w-full rounded-lg bg-white p-4 shadow-md'>
                <h4 className='text-lg font-semibold text-black'>Bộ lọc người dùng</h4>

                <form
                    className='mt-4 flex w-max flex-col justify-center gap-4'
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleFilterUsers()
                    }}
                >
                    <div className='flex items-center gap-4'>
                        <label>
                            <span className='mr-2 font-medium'>Họ tên:</span>
                            <input
                                placeholder='Nhập tên người dùng'
                                spellCheck={false}
                                className='h-10 w-80 rounded-md border border-solid border-[#ddd] px-4 py-2 text-sm transition-all [&:focus]:border-[#1677ff]'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>

                        <div className='flex flex-col gap-1'>
                            <div className='font-medium'>Trạng thái:</div>
                            <Radio.Group
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value)}
                                className='my-auto -mt-1'
                            >
                                <Radio
                                    value={true}
                                    className='mt-2'
                                    onClick={() => setIsActive((prev) => (prev === true ? undefined : true))}
                                >
                                    Hoạt động
                                </Radio>

                                <Radio
                                    value={false}
                                    className='mt-2'
                                    onClick={() => setIsActive((prev) => (prev === false ? undefined : false))}
                                >
                                    Đã khoá
                                </Radio>
                            </Radio.Group>
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='m-auto w-max rounded-lg bg-[#1677ff] px-3 py-1.5 text-sm text-white hover:bg-[#4096ff]'
                    >
                        Áp dụng
                    </button>
                </form>
            </div>

            <div className='mt-4 rounded-lg bg-white p-4 shadow-md'>
                <h4 className='text-lg font-semibold text-black'>Danh sách người dùng</h4>

                <Table
                    dataSource={users}
                    columns={[
                        {
                            title: 'STT',
                            dataIndex: 'index',
                            key: 'index'
                        },
                        {
                            title: 'Avatar',
                            dataIndex: 'avatar',
                            key: 'avatar',
                            render: ({ name, avatar }: Pick<User, 'name' | 'avatar'>) => (
                                <img
                                    src={avatar ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${avatar}` : images.avatar}
                                    alt={name}
                                    className='mx-auto h-9 w-9 rounded-full object-cover'
                                />
                            )
                        },
                        {
                            title: 'Tên đăng nhập',
                            dataIndex: 'username',
                            key: 'username'
                        },
                        {
                            title: 'Tên nguời dùng',
                            dataIndex: 'name',
                            key: 'name'
                        },
                        {
                            title: 'Giới tính',
                            dataIndex: 'sex',
                            key: 'sex'
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'is_active',
                            key: 'is_active',
                            render: (is_active: boolean) => (
                                <div className='mx-auto line-clamp-1 w-max'>{is_active ? 'Hoạt động' : 'Đã khoá'}</div>
                            )
                        },
                        {
                            title: 'Hành động',
                            dataIndex: 'action',
                            key: 'action',
                            render: ({ name, username, is_active }: Pick<User, 'name' | 'username' | 'is_active'>) => (
                                <Button
                                    className={`!mx-auto !h-8 !w-max !border !border-solid !px-3 [&>span]:!text-[13px] ${
                                        is_active
                                            ? '!border-[#f44336] !bg-[#f44336]/10 hover:!bg-[#f44336]/20 [&>span]:!text-[#f44336]'
                                            : '!border-[#1677ff] !bg-[#1677ff]/10 hover:!bg-[#1677ff]/20 [&>span]:!text-[#1677ff]'
                                    }`}
                                    onClick={() => handleUpdateActiveStatus({ name, username, is_active: !is_active })}
                                >
                                    {is_active ? 'Khóa' : 'Mở khóa'}
                                </Button>
                            )
                        }
                    ]}
                    size='middle'
                    pagination={{ position: ['none'] }}
                    loading={isFetching}
                    className='mt-4 [&_td]:!text-center [&_th]:!bg-[#f7f9fc] [&_th]:!text-center'
                />

                <AntdPagination
                    total={pagination.total_pages * LIMIT}
                    pageSize={LIMIT}
                    current={pagination.page}
                    showSizeChanger={false}
                    hideOnSinglePage
                    className='mt-4 flex justify-center'
                    onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                />
            </div>
        </>
    )
}

export default AdminUser
