import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Pagination as AntdPagination } from 'antd'

import Panel from '~/components/Panel'
import Loading from '~/components/Loading'
import PostItem from '~/components/PostItem'
import { getAllPosts } from '~/apis/posts.apis'
import { routes } from '~/config'
import { PostCategory } from '~/constants/enums'
import { useQueryParams } from '~/hooks'
import { Post } from '~/types/posts.types'
import { Pagination } from '~/types/commons.types'

const LIMIT = 10

function Products() {
    const navigate = useNavigate()
    const { page } = useQueryParams()

    const [posts, setPosts] = useState<Post[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: Number(page) || 1, total_pages: 0 })

    const getAllPostsProductQueryFn = async ({ page, limit }: { page: number; limit: number }) => {
        const response = await getAllPosts({
            verify_access_token: false,
            page,
            limit,
            approved: true,
            category: PostCategory.Product
        })
        const { result } = response.data

        setPosts(result?.posts as Post[])
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })
        navigate(`${routes.products}?page=${page}`)

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['allPostsProduct', { page: pagination.page, limit: LIMIT }],
        queryFn: () =>
            getAllPostsProductQueryFn({
                page: pagination.page,
                limit: LIMIT
            })
    })

    return (
        <Panel title='Sản phẩm' color='#e74c3c'>
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

export default Products
