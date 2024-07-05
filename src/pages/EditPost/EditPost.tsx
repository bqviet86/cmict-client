import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import PostForm from '~/components/PostForm'
import { getPost } from '~/apis/posts.apis'
import { Post } from '~/types/posts.types'

function EditPost() {
    const { post_slug } = useParams()

    const [post, setPost] = useState<Post | null>(null)

    useEffect(() => {
        const fetchPost = async () => {
            const response = await getPost(post_slug as string)
            setPost(response.data.result as Post)
        }

        fetchPost()
    }, [])

    return (
        <div className='px-2 py-6'>
            <h2 className='mb-4 text-center text-4xl font-semibold text-[#4096ff]'>Chỉnh sửa bài viết</h2>
            {post && <PostForm editPost={post} />}
        </div>
    )
}

export default EditPost
