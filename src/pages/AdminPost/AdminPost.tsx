import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pagination as AntdPagination, Radio, Table } from 'antd'
import toast from 'react-hot-toast'
import { isBoolean, pick } from 'lodash'
import { format } from 'date-fns'

import Button from '~/components/Button'
import Modal from '~/components/Modal'
import { GetAllPostsReqData, deletePost, getAllPosts, updateApproveStatus } from '~/apis/posts.apis'
import { routes } from '~/config'
import { PostCategory } from '~/constants/enums'
import { POST_CATEGORIES } from '~/constants/interfaceData'
import { useQueryParams } from '~/hooks'
import { Pagination } from '~/types/commons.types'
import { Post, PostTableType } from '~/types/posts.types'

const LIMIT = 10

function AdminPost() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {
        page,
        title: titleQuery,
        content: contentQuery,
        author: authorQuery,
        category: categoryQuery,
        approved: approvedQuery
    } = useQueryParams()

    const [posts, setPosts] = useState<PostTableType[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: Number(page) || 1, total_pages: 0 })
    const [title, setTitle] = useState<string>(titleQuery || '')
    const [content, setContent] = useState<string>(contentQuery || '')
    const [author, setAuthor] = useState<string>(authorQuery || '')
    const [category, setCategory] = useState<PostCategory | undefined>(
        categoryQuery ? (categoryQuery as PostCategory) : undefined
    )
    const [approved, setApproved] = useState<boolean | undefined>(
        approvedQuery === 'true' ? true : approvedQuery === 'false' ? false : undefined
    )
    const [modeAction, setModeAction] = useState<'approve' | 'delete'>('approve')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [currentPost, setCurrentPost] = useState<Post | null>(null)

    const getAllPostsQueryFn = async ({
        verify_access_token,
        page,
        limit,
        title,
        content,
        author,
        category,
        approved
    }: GetAllPostsReqData) => {
        const response = await getAllPosts({
            verify_access_token,
            page,
            limit,
            title,
            content,
            author,
            category,
            approved
        })
        const { result } = response.data

        setPosts(
            (result?.posts as Post[]).map((post, index) => ({
                ...pick(post, ['title', 'author', 'category', 'approved']),
                key: post._id,
                index: (page - 1) * LIMIT + index + 1,
                created_at: format(post.created_at, 'dd/MM/yy HH:mm'),
                action: post
            }))
        )
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })
        navigate(
            `${routes.adminPosts}?page=${page}` +
                (title ? `&title=${encodeURIComponent(title)}` : '') +
                (content ? `&content=${encodeURIComponent(content)}` : '') +
                (author ? `&author=${encodeURIComponent(author)}` : '') +
                (category ? `&category=${category}` : '') +
                (isBoolean(approved) ? `&approved=${approved}` : '')
        )

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['allPosts', { page: pagination.page, limit: LIMIT }],
        queryFn: () =>
            getAllPostsQueryFn({
                verify_access_token: true,
                title: title || undefined,
                content: content || undefined,
                author: author || undefined,
                category: category || undefined,
                approved,
                page: pagination.page,
                limit: LIMIT
            })
    })

    const handleFilterPosts = () => {
        queryClient.fetchQuery({
            queryKey: ['allPosts', { page: 1, limit: LIMIT }],
            queryFn: () =>
                getAllPostsQueryFn({
                    verify_access_token: true,
                    title: title || undefined,
                    content: content || undefined,
                    author: author || undefined,
                    category: category || undefined,
                    approved,
                    page: 1,
                    limit: LIMIT
                })
        })
    }

    const handleOpenModal = (mode: 'approve' | 'delete', post: Post) => {
        setModeAction(mode)
        setCurrentPost(post)
        setIsModalOpen(true)
    }

    const { mutate: mutateUpdateApproveStatus } = useMutation({
        mutationFn: (data: { post_id: string; approved: boolean }) => updateApproveStatus(data),
        onSuccess: (_, { post_id, approved }) => {
            toast.success('Duyệt bài viết thành công')
            setPosts((prev) =>
                prev.map((post) => {
                    if (post.key === post_id) {
                        return {
                            ...post,
                            approved,
                            action: { ...post.action, approved }
                        }
                    }

                    return post
                })
            )
        }
    })

    const { mutate: mutateDeletePost } = useMutation({
        mutationFn: (post_id: string) => deletePost(post_id),
        onSuccess: (_, post_id) => {
            toast.success('Xoá bài viết thành công')
            setPosts((prev) => prev.filter((post) => post.key !== post_id))
        }
    })

    const handleModalOk = () => {
        const currentPostId = currentPost?._id as string

        if (modeAction === 'approve') {
            mutateUpdateApproveStatus({ post_id: currentPostId, approved: true })
        } else {
            mutateDeletePost(currentPostId)
        }

        setIsModalOpen(false)
    }

    return (
        <>
            <div className='w-max max-w-full rounded-lg bg-white p-4 shadow-md'>
                <h4 className='text-lg font-semibold text-black'>Bộ lọc bài viết</h4>

                <form
                    className='mt-4 flex w-max flex-col justify-center gap-4'
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleFilterPosts()
                    }}
                >
                    <div className='flex items-center gap-4'>
                        <label>
                            <span className='mr-2 font-medium'>Tiêu đề:</span>
                            <input
                                placeholder='Nhập tiêu đề bài viết'
                                spellCheck={false}
                                className='h-10 w-80 rounded-md border border-solid border-[#ddd] px-4 py-2 text-sm transition-all [&:focus]:border-[#1677ff]'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>

                        <label>
                            <span className='mr-2 font-medium'>Nội dung:</span>
                            <input
                                placeholder='Nhập nội dung bài viết'
                                spellCheck={false}
                                className='h-10 w-80 rounded-md border border-solid border-[#ddd] px-4 py-2 text-sm transition-all [&:focus]:border-[#1677ff]'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </label>
                    </div>

                    <div className='flex items-center gap-4'>
                        <label>
                            <span className='mr-2 font-medium'>Tác giả:</span>
                            <input
                                placeholder='Nhập tên tác giả'
                                spellCheck={false}
                                className='h-10 w-80 rounded-md border border-solid border-[#ddd] px-4 py-2 text-sm transition-all [&:focus]:border-[#1677ff]'
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </label>

                        <div className='flex flex-col gap-1'>
                            <div className='font-medium'>Trạng thái:</div>
                            <Radio.Group
                                value={approved}
                                onChange={(e) => setApproved(e.target.value)}
                                className='my-auto -mt-1'
                            >
                                <Radio
                                    value={true}
                                    className='mt-2'
                                    onClick={() => setApproved((prev) => (prev === true ? undefined : true))}
                                >
                                    Đã duyệt
                                </Radio>

                                <Radio
                                    value={false}
                                    className='mt-2'
                                    onClick={() => setApproved((prev) => (prev === false ? undefined : false))}
                                >
                                    Chưa duyệt
                                </Radio>
                            </Radio.Group>
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col gap-1'>
                            <div className='font-medium'>Thể loại:</div>
                            <Radio.Group
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className='my-auto -mt-1'
                            >
                                {POST_CATEGORIES.map(({ value, label }, index) => (
                                    <Radio
                                        key={index}
                                        value={value}
                                        className='mt-2'
                                        onClick={() => setCategory((prev) => (prev === value ? undefined : value))}
                                    >
                                        {label}
                                    </Radio>
                                ))}
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
                <h4 className='text-lg font-semibold text-black'>Danh sách bài viết</h4>

                <Table
                    dataSource={posts}
                    columns={[
                        {
                            title: 'STT',
                            dataIndex: 'index',
                            key: 'index'
                        },
                        {
                            title: 'Tiêu đề',
                            dataIndex: 'title',
                            key: 'title',
                            render: (title: string) => <div className='mx-auto line-clamp-2'>{title}</div>
                        },
                        {
                            title: 'Tác giả',
                            dataIndex: 'author',
                            key: 'author',
                            render: (author: string) => <div className='mx-auto line-clamp-1 w-max'>{author}</div>
                        },
                        {
                            title: 'Thể loại',
                            dataIndex: 'category',
                            key: 'category',
                            render: (category: PostCategory) => (
                                <div className='mx-auto line-clamp-1 w-max'>
                                    {POST_CATEGORIES.find((item) => item.value === category)?.label}
                                </div>
                            )
                        },
                        {
                            title: 'Ngày tạo',
                            dataIndex: 'created_at',
                            key: 'created_at',
                            render: (created_at: string) => (
                                <div className='mx-auto line-clamp-1 w-max'>{created_at}</div>
                            )
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'approved',
                            key: 'approved',
                            render: (approved: boolean) => (
                                <div className='mx-auto line-clamp-1 w-max'>{approved ? 'Đã duyệt' : 'Chưa duyệt'}</div>
                            )
                        },
                        {
                            title: 'Hành động',
                            dataIndex: 'action',
                            key: 'action',
                            render: (post: Post) => (
                                <div className='mx-auto flex w-max items-center justify-center gap-2'>
                                    <Button
                                        to={routes.postDetail.replace(':post_slug', post.slug)}
                                        {...{ target: '_blank' }}
                                        className='!m-0 !h-8 !w-max !border !border-solid !border-[#1677ff] !bg-[#1677ff]/10 !px-3 hover:!bg-[#1677ff]/20 [&>span]:!text-[13px] [&>span]:!text-[#1677ff]'
                                    >
                                        Xem
                                    </Button>

                                    {!post.approved && (
                                        <Button
                                            className='!m-0 !h-8 !w-max !border !border-solid !border-[#3c50e0] !bg-[#3c50e0]/10 !px-3 hover:!bg-[#3c50e0]/20 [&>span]:!text-[13px] [&>span]:!text-[#3c50e0]'
                                            onClick={() => handleOpenModal('approve', post)}
                                        >
                                            Duyệt
                                        </Button>
                                    )}

                                    <Button
                                        className='!m-0 !h-8 !w-max !border !border-solid !border-[#f44336] !bg-[#f44336]/10 !px-3 hover:!bg-[#f44336]/20 [&>span]:!text-[13px] [&>span]:!text-[#f44336]'
                                        onClick={() => handleOpenModal('delete', post)}
                                    >
                                        Xoá
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

                <Modal
                    title={modeAction === 'approve' ? 'Duyệt bài viết' : 'Xoá bài viết'}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onOk={handleModalOk}
                    okText={modeAction === 'approve' ? 'Duyệt' : 'Xoá'}
                    cancelText='Hủy'
                >
                    <div className='mt-3 text-center text-base'>
                        Bạn có chắc chắn muốn {modeAction === 'approve' ? 'duyệt' : 'xoá'} bài viết{' '}
                        <strong>"{currentPost?.title}"</strong> không?
                    </div>
                </Modal>

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

export default AdminPost
