import { PostCategory } from '~/constants/enums'
import { PaginationResponse, SuccessResponse } from '~/types/response.types'
import { User } from '~/types/users.types'

export type Post = {
    _id: string
    user: User
    title: string
    image: string
    content: string
    author: string
    category: PostCategory
    slug: string
    approved: boolean
    created_at: string
    updated_at: string
}

export type PostTableType = Pick<Post, 'title' | 'author' | 'category' | 'approved' | 'created_at'> & {
    key: string
    index: number
    action: Post
}

export type CreatePostResponse = SuccessResponse<Post>

export type GetPostResponse = SuccessResponse<Post>

export type GetAllPostsResponse = SuccessResponse<PaginationResponse<{ posts: Post[] }>>

export type UpdatePostResponse = SuccessResponse<Post>
