import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Panel from '~/components/Panel'
import Loading from '~/components/Loading'
import { getAllPosts } from '~/apis/posts.apis'
import { routes } from '~/config'
import { BACKGROUND_COLOR_TOPS } from '~/constants/interfaceData'
import { Post } from '~/types/posts.types'

type NewPostsPanelProps = {
    className?: string
}

function NewPostsPanel({ className }: NewPostsPanelProps) {
    const [newPosts, setNewPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchNewPosts = async () => {
            setLoading(true)

            const response = await getAllPosts({
                verify_access_token: false,
                page: 1,
                limit: 9,
                approved: true
            })
            const posts = response.data.result?.posts as Post[]

            setNewPosts(posts)
            setLoading(false)
        }

        fetchNewPosts()
    }, [])

    return (
        <Panel title='Bài viết mới' size='small' color='#40af64' className={className}>
            {loading ? (
                <Loading loaderSize={32} className='my-2 w-full' loaderClassName='!text-[#bbb]' />
            ) : (
                newPosts.map((post, index) => (
                    <div key={post._id} className='[&+&]:mt-2'>
                        <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white ${
                                index < 3 ? BACKGROUND_COLOR_TOPS[index + 1] : 'bg-[#777777]'
                            }`}
                        >
                            {index + 1}
                        </span>
                        <Link
                            to={routes.postDetail.replace(':post_slug', post.slug)}
                            className='ml-2 text-[15px] text-[#337ab7]'
                        >
                            {post.title}
                        </Link>
                    </div>
                ))
            )}
        </Panel>
    )
}

export default NewPostsPanel
