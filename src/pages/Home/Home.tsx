import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

import Slider from '~/components/Slider'
import PostCard from '~/components/PostCard'
import { getAllPosts } from '~/apis/posts.apis'
import { HOME_PAGE_OVERALL_DATA, SLIDER_ITEMS } from '~/constants/interfaceData'
import { PostCategory } from '~/constants/enums'
import { Post } from '~/types/posts.types'

const PAGE = 1
const LIMIT = 4

function Home() {
    const [newsPosts, setNewsPosts] = useState<Post[]>([])
    const [productPosts, setProductPosts] = useState<Post[]>([])
    const [tutorialPosts, setTutorialPosts] = useState<Post[]>([])

    const getAllPostsQueryFn = async (category: PostCategory) => {
        const response = await getAllPosts({
            verify_access_token: false,
            page: PAGE,
            limit: LIMIT,
            approved: true,
            category
        })
        const posts = response.data.result?.posts as Post[]

        return posts
    }

    useEffect(() => {
        const fetchPosts = async () => {
            const [newsPosts, productPosts, tutorialPosts] = await Promise.all([
                getAllPostsQueryFn(PostCategory.News),
                getAllPostsQueryFn(PostCategory.Product),
                getAllPostsQueryFn(PostCategory.Tutorial)
            ])

            setNewsPosts(newsPosts)
            setProductPosts(productPosts)
            setTutorialPosts(tutorialPosts)
        }

        fetchPosts()
    }, [])

    const postListSections = [
        {
            title: 'Tin tức',
            desc: 'Cập nhật những thông tin mới nhất về các lĩnh vực',
            posts: newsPosts
        },
        {
            title: 'Sản phẩm',
            desc: 'Tổng hợp các sản phẩm của Trung tâm đã thực hiện',
            posts: productPosts
        },
        {
            title: 'Thủ thuật máy tính',
            desc: 'Tổng hợp tấc cả các thủ thuật hay, thiết thực đến người dùng',
            posts: tutorialPosts
        }
    ]

    return (
        <>
            <div className='-mx-2 xl:mx-auto'>
                <Slider loop data={SLIDER_ITEMS}>
                    {SLIDER_ITEMS.map(({ image, path }, index) => (
                        <Link key={index} to={path} className='h-full w-full'>
                            <img src={image} alt={`slide-${index + 1}`} className='h-full w-full object-cover' />
                        </Link>
                    ))}
                </Slider>
            </div>

            <div className='-mx-2.5 mt-2 flex flex-wrap'>
                {HOME_PAGE_OVERALL_DATA.map(({ title, path, desc, icon, color }, index) => (
                    <div
                        key={index}
                        className='mx-2.5 my-2 w-[calc(100%-20px)] rounded-md p-4 text-white sm:w-[calc(50%-20px)] md:w-[calc(25%-20px)] [&>svg]:mx-auto [&>svg]:text-8xl'
                        style={{ backgroundColor: color }}
                    >
                        {icon}
                        <h3 className='mt-2 text-center text-[22px] font-semibold uppercase'>{title}</h3>
                        <p className='mt-2 text-justify text-[15px]'>{desc}</p>
                        <Link
                            to={path}
                            className='ml-auto mt-2 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-solid border-[#ddd] text-3xl'
                        >
                            <Icon icon='material-symbols:arrow-right-alt-rounded' />
                        </Link>
                    </div>
                ))}
            </div>

            {postListSections.map(({ title, desc, posts }, index, self) => (
                <div key={index} className={`mt-10${index === self.length - 1 ? ' mb-10' : ''}`}>
                    <div className='text-center'>
                        <h2 className='text-[18px] font-semibold uppercase text-[#337ab7] md:text-[22px]'>{title}</h2>
                        <p className='mt-2 text-sm md:text-lg'>{desc}</p>
                    </div>

                    <div className='-mx-2.5 mt-2 flex flex-wrap'>
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

export default Home
