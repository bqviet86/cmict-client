import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'

import Panel from '~/components/Panel'
import Loading from '~/components/Loading'
import { getPost } from '~/apis/posts.apis'
import { Post } from '~/types/posts.types'

function PostDetail() {
    const { post_slug } = useParams()

    const { data: post } = useQuery({
        queryKey: ['postDetail', { post_slug }],
        queryFn: async () => {
            const response = await getPost(post_slug as string)
            return response.data.result as Post
        }
    })

    return (
        <Panel title={post?.title || ''} titlePosition='left' titleTransform='none' color='#e74c3c'>
            {post ? (
                <>
                    <ReactMarkdown className='markdown-html markdown-html-display'>{post.content}</ReactMarkdown>
                    <div className='mt-2.5 text-right font-system font-bold'>{post.author}</div>
                </>
            ) : (
                <Loading loaderSize={32} className='my-2 w-full' loaderClassName='!text-[#bbb]' />
            )}
        </Panel>
    )
}

export default PostDetail
