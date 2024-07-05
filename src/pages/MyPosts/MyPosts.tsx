import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Pagination as AntdPagination, Radio } from 'antd'

import Panel from '~/components/Panel'
import Loading from '~/components/Loading'
import PostItem from '~/components/PostItem'
import { getAllPosts } from '~/apis/posts.apis'
import { routes } from '~/config'
import { useQueryParams } from '~/hooks'
import { Pagination } from '~/types/commons.types'
import { Post } from '~/types/posts.types'

const LIMIT = 10

function MyPosts() {
    const navigate = useNavigate()
    const { page, approved: approvedQuery } = useQueryParams()

    const [posts, setPosts] = useState<Post[]>([])
    const [approved, setApproved] = useState<boolean>(approvedQuery === 'false' ? false : true)
    const [pagination, setPagination] = useState<Pagination>({ page: Number(page) || 1, total_pages: 0 })

    const getMyPostsQueryFn = async ({ page, limit }: { page: number; limit: number }) => {
        const response = await getAllPosts({
            verify_access_token: true,
            page,
            limit,
            approved,
            my_posts: true
        })
        const { result } = response.data

        setPosts(result?.posts as Post[])
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })
        navigate(`${routes.myPosts}?page=${page}&approved=${approved}`)

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['myPosts', { page: pagination.page, limit: LIMIT, approved }],
        queryFn: () =>
            getMyPostsQueryFn({
                page: pagination.page,
                limit: LIMIT
            })
    })

    return (
        <Panel title='Bài viết của tôi' color='#e74c3c'>
            <Radio.Group
                value={approved}
                onChange={(e) => setApproved(e.target.value)}
                optionType='button'
                className='mb-4'
                size='middle'
            >
                <Radio value={true} className='text-[15px]'>
                    Đã duyệt
                </Radio>
                <Radio value={false} className='text-[15px]'>
                    Chưa duyệt
                </Radio>
            </Radio.Group>

            {isFetching ? (
                <Loading loaderSize={32} className='my-2 w-full' loaderClassName='!text-[#bbb]' />
            ) : (
                <>
                    {posts.map((post) => (
                        <PostItem key={post._id} post={post} setPosts={setPosts} />
                    ))}

                    <AntdPagination
                        total={pagination.total_pages * LIMIT}
                        pageSize={LIMIT}
                        current={pagination.page}
                        showSizeChanger={false}
                        hideOnSinglePage
                        className='mt-4 flex justify-center'
                        onChange={(page) => {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                            setPagination((prev) => ({ ...prev, page }))
                        }}
                    />
                </>
            )}
        </Panel>
    )
}

export default MyPosts
