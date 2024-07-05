import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { Instance as TippyInstance } from 'tippy.js'
import Tippy from '@tippyjs/react/headless'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'

import Modal from '~/components/Modal'
import { deletePost } from '~/apis/posts.apis'
import { routes } from '~/config'
import { AppContext } from '~/contexts/appContext'
import { Post } from '~/types/posts.types'

type PostItemProps = {
    post: Post
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

function PostItem({ post, setPosts }: PostItemProps) {
    const navigate = useNavigate()

    const { user } = useContext(AppContext)
    const [postDesc, setPostDesc] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const postRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setPostDesc(postRef.current?.innerText.trim() || post.title)
    }, [])

    const { mutate: mutateDeletePost } = useMutation({
        mutationFn: (post_id: string) => deletePost(post_id)
    })

    const handleDeletePost = () => {
        mutateDeletePost(post._id, {
            onSuccess: (_, post_id) => {
                toast.success('Xoá bài viết thành công')
                setPosts((prev) => prev.filter((post) => post._id !== post_id))
            }
        })
    }

    return (
        <div className='relative flex flex-col gap-2 rounded-md border border-dashed border-[#ddd] p-2 hover:shadow-md [&+&]:mt-4'>
            <h2 className={`text-[15px] font-semibold${user?._id === post.user._id ? ' mr-12' : ''}`}>
                <Link to={routes.postDetail.replace(':post_slug', post.slug)}>{post.title}</Link>
            </h2>

            <div className='flex items-start gap-2'>
                <div className='w-[140px] flex-shrink-0 rounded-md border border-solid border-[#ddd] p-1'>
                    <img
                        src={`${import.meta.env.VITE_IMAGE_URL_PREFIX}/${post.image}`}
                        alt={post.image}
                        className='h-full w-full rounded-sm object-cover'
                    />
                </div>

                <p className='line-clamp-4 text-[15px] text-[rgb(102,102,102,0.6)]'>{postDesc}</p>
            </div>

            <div ref={postRef} className='hidden'>
                <ReactMarkdown allowElement={(_, index) => index === 0} disallowedElements={['img', 'ul', 'ol']}>
                    {post.content}
                </ReactMarkdown>
            </div>

            {user && user._id === post.user._id && (
                <Tippy
                    interactive
                    hideOnClick
                    trigger='click'
                    placement='bottom-end'
                    offset={[0, 8]}
                    render={(attrs, _, tippy) => (
                        <div
                            className='min-w-40 rounded-lg bg-white p-1 shadow-[0_0_10px_rgba(0,0,0,.2)]'
                            tabIndex={-1}
                            {...attrs}
                        >
                            <div
                                className='flex cursor-pointer items-center rounded-md bg-white px-1 py-2 text-sm transition-all hover:bg-[#f2f2f2]'
                                onClick={() => {
                                    navigate(routes.editPost.replace(':post_slug', post.slug))
                                    ;(tippy as TippyInstance).hide()
                                }}
                            >
                                <Icon icon='akar-icons:edit' className='h-[20px] w-[20px] text-[#050505]' />
                                <span className='ml-1 text-[#050505]'>Chỉnh sửa</span>
                            </div>

                            <div
                                className='flex cursor-pointer items-center rounded-md bg-white px-1 py-2 text-sm transition-all hover:bg-[#f2f2f2]'
                                onClick={() => {
                                    setIsModalOpen(true)
                                    ;(tippy as TippyInstance).hide()
                                }}
                            >
                                <Icon icon='mingcute:close-circle-line' className='h-[20px] w-[20px] text-[#050505]' />
                                <span className='ml-1 text-[#050505]'>Xoá</span>
                            </div>

                            <Modal
                                title='Xoá bài viết'
                                open={isModalOpen}
                                onCancel={() => setIsModalOpen(false)}
                                onOk={handleDeletePost}
                                okText='Xoá'
                                cancelText='Hủy'
                            >
                                <div className='mt-3 text-center text-base'>
                                    Bạn có chắc chắn muốn xoá' bài viết <strong>"{post.title}"</strong> không?
                                </div>
                            </Modal>
                        </div>
                    )}
                >
                    <div className='absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-[#f0f2f5]'>
                        <Icon icon='mdi:dots-horizontal' className='h-6 w-6 text-[#606770]' />
                    </div>
                </Tippy>
            )}
        </div>
    )
}

export default PostItem
