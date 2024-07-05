import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pagination as AntdPagination, Radio, Table } from 'antd'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { isBoolean, pick } from 'lodash'

import Button from '~/components/Button'
import {
    getAllContacts,
    GetAllContactsReqQuery,
    updateIsReadStatusContact,
    UpdateIsReadStatusContactReqData
} from '~/apis/contacts.apis'
import { routes } from '~/config'
import { useQueryParams } from '~/hooks'
import { Pagination } from '~/types/commons.types'
import { Contact, ContactTableType } from '~/types/contacts.types'

const LIMIT = 10

function AdminContact() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { page, is_read } = useQueryParams()

    const [contacts, setContacts] = useState<ContactTableType[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: Number(page) || 1, total_pages: 0 })
    const [isRead, setIsRead] = useState<boolean | undefined>(
        is_read === 'true' ? true : is_read === 'false' ? false : undefined
    )

    const getAllContactsQueryFn = async ({ is_read, page, limit }: GetAllContactsReqQuery) => {
        const response = await getAllContacts({ is_read, page, limit })
        const { result } = response.data

        setContacts(
            (result?.contacts as Contact[]).map((contact, index) => ({
                ...pick(contact, ['name', 'phone', 'email', 'content', 'is_read']),
                key: contact._id,
                index: (page - 1) * LIMIT + index + 1,
                username: contact.user?.username || '∅',
                created_at: format(contact.created_at, 'dd/MM/yy HH:mm'),
                action: pick(contact, ['_id', 'is_read'])
            }))
        )
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })
        navigate(`${routes.adminContacts}?page=${page}` + (isBoolean(is_read) ? `&is_read=${is_read}` : ''))

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['allContacts', { page: pagination.page, limit: LIMIT }],
        queryFn: () =>
            getAllContactsQueryFn({
                is_read: isRead,
                page: pagination.page,
                limit: LIMIT
            })
    })

    const handleFilterContacts = () => {
        queryClient.fetchQuery({
            queryKey: ['allContacts', { page: 1, limit: LIMIT }],
            queryFn: () =>
                getAllContactsQueryFn({
                    is_read: isRead,
                    page: 1,
                    limit: LIMIT
                })
        })
    }

    const { mutate: mutateUpdateActiveStatus } = useMutation({
        mutationFn: ({ contact_id, is_read }: UpdateIsReadStatusContactReqData) =>
            updateIsReadStatusContact({ contact_id, is_read })
    })

    const handleUpdateIsReadStatus = ({ contact_id, is_read }: UpdateIsReadStatusContactReqData) => {
        mutateUpdateActiveStatus(
            { contact_id, is_read },
            {
                onSuccess: () => {
                    setContacts((prev) =>
                        prev.map((contact) =>
                            contact.key === contact_id
                                ? {
                                      ...contact,
                                      is_read,
                                      action: { ...contact.action, is_read }
                                  }
                                : contact
                        )
                    )
                    toast.success('Cập nhật trạng thái đọc liên hệ thành công!')
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
                        handleFilterContacts()
                    }}
                >
                    <div className='flex flex-col gap-1'>
                        <div className='font-medium'>Trạng thái:</div>
                        <Radio.Group
                            value={isRead}
                            onChange={(e) => setIsRead(e.target.value)}
                            className='my-auto -mt-1'
                        >
                            <Radio
                                value={true}
                                className='mt-2'
                                onClick={() => setIsRead((prev) => (prev === true ? undefined : true))}
                            >
                                Đã đọc
                            </Radio>

                            <Radio
                                value={false}
                                className='mt-2'
                                onClick={() => setIsRead((prev) => (prev === false ? undefined : false))}
                            >
                                Chưa đọc
                            </Radio>
                        </Radio.Group>
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
                    dataSource={contacts}
                    columns={[
                        {
                            title: 'STT',
                            dataIndex: 'index',
                            key: 'index'
                        },
                        {
                            title: 'Tên đăng nhập',
                            dataIndex: 'username',
                            key: 'username'
                        },
                        {
                            title: 'Họ và tên',
                            dataIndex: 'name',
                            key: 'name',
                            render: (name: string) => <div className='mx-auto line-clamp-1 w-max'>{name}</div>
                        },
                        {
                            title: 'Email',
                            dataIndex: 'email',
                            key: 'email'
                        },
                        {
                            title: 'Số điện thoại',
                            dataIndex: 'phone',
                            key: 'phone'
                        },
                        {
                            title: 'Nội dung',
                            dataIndex: 'content',
                            key: 'content',
                            render: (content: string) => <div className='mx-auto line-clamp-2'>{content}</div>
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'is_read',
                            key: 'is_read',
                            render: (is_read: boolean) => (
                                <div className='mx-auto line-clamp-1 w-max'>{is_read ? 'Đã đọc' : 'Chưa đọc'}</div>
                            )
                        },
                        {
                            title: 'Ngày gửi',
                            dataIndex: 'created_at',
                            key: 'created_at',
                            render: (created_at: string) => (
                                <div className='mx-auto line-clamp-1 w-max'>{created_at}</div>
                            )
                        },
                        {
                            title: 'Hành động',
                            dataIndex: 'action',
                            key: 'action',
                            render: ({ _id, is_read }: Pick<Contact, 'is_read' | '_id'>) => (
                                <div className='mx-auto flex w-max items-center justify-center gap-2'>
                                    <Button
                                        to={routes.adminContactDetail.replace(':contact_id', _id)}
                                        className='!m-0 !h-8 !w-max !border !border-solid !border-[#1677ff] !bg-[#1677ff]/10 !px-3 hover:!bg-[#1677ff]/20 [&>span]:!text-[13px] [&>span]:!text-[#1677ff]'
                                    >
                                        Xem chi tiết
                                    </Button>

                                    <Button
                                        className={`!mx-auto !h-8 !w-auto !border !border-solid !px-3 [&>span]:!text-[13px] ${
                                            is_read
                                                ? '!border-[#3c50e0] !bg-[#3c50e0]/10 hover:!bg-[#3c50e0]/20 [&>span]:!text-[#3c50e0]'
                                                : '!border-[#f44336] !bg-[#f44336]/10 hover:!bg-[#f44336]/20 [&>span]:!text-[#f44336]'
                                        }`}
                                        onClick={() => handleUpdateIsReadStatus({ contact_id: _id, is_read: !is_read })}
                                    >
                                        Đánh dấu là {is_read ? 'chưa đọc' : 'đã đọc'}
                                    </Button>
                                </div>
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

export default AdminContact
