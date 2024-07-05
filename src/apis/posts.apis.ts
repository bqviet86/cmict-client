import { PostCategory } from '~/constants/enums'
import { CreatePostResponse, GetAllPostsResponse, GetPostResponse, UpdatePostResponse } from '~/types/posts.types'
import { SuccessResponse } from '~/types/response.types'
import http from '~/utils/http'

export type CreatePostReqData = {
    title: string
    image: string
    content: string
    category: PostCategory
}

export type GetAllPostsReqData = {
    verify_access_token: boolean
    page: number
    limit: number
    title?: string
    content?: string
    author?: string
    category?: PostCategory
    approved?: boolean
    my_posts?: boolean
}

export type UpdatePostReqData = {
    title?: string
    image?: string
    content?: string
    category?: PostCategory
}

export const createPost = (data: CreatePostReqData) => http.post<CreatePostResponse>('/posts', data)

export const getPost = (post_slug: string) => http.get<GetPostResponse>(`/posts/${post_slug}`)

export const getAllPosts = (params: GetAllPostsReqData) => http.get<GetAllPostsResponse>('/posts/all', { params })

export const updateApproveStatus = ({ post_id, approved }: { post_id: string; approved: boolean }) =>
    http.patch<SuccessResponse>(`/posts/update-approved-status/${post_id}`, { approved })

export const updatePost = (post_id: string, data: UpdatePostReqData) =>
    http.patch<UpdatePostResponse>(`/posts/${post_id}`, data)

export const deletePost = (post_id: string) => http.delete<SuccessResponse>(`/posts/${post_id}`)
