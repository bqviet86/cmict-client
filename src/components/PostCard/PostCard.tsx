import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

import { routes } from '~/config'
import { Post } from '~/types/posts.types'

type PostCardProps = {
    post: Post
}

function PostCard({ post }: PostCardProps) {
    const [postDesc, setPostDesc] = useState<string>('')

    const postRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setPostDesc(postRef.current?.innerText.trim() || post.title)
    }, [])

    return (
        <div
            title={post.title}
            className='mx-2.5 my-2 w-[calc(100%-20px)] rounded-md border border-solid border-[#ddd] bg-[#fafafa] p-4 sm:w-[calc(50%-20px)] md:w-[calc(25%-20px)]'
        >
            <Link to={routes.postDetail.replace(':post_slug', post.slug)} className='flex aspect-[16/9] w-full'>
                <img
                    src={`${import.meta.env.VITE_IMAGE_URL_PREFIX}/${post.image}`}
                    alt={post.image}
                    className='h-full w-full object-cover'
                />
            </Link>

            <h3 className='mt-2 line-clamp-2 text-[#337ab7]'>
                <Link to={routes.postDetail.replace(':post_slug', post.slug)}>{post.title}</Link>
            </h3>

            <p className='mt-2 line-clamp-5 text-justify text-[15px]'>{postDesc}</p>

            <div ref={postRef} className='hidden'>
                <ReactMarkdown allowElement={(_, index) => index === 0} disallowedElements={['img', 'ul', 'ol']}>
                    {post.content}
                </ReactMarkdown>
            </div>
        </div>
    )
}

export default PostCard
