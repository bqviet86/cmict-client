import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button, Image, Radio } from 'antd'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import MarkdownIt from 'markdown-it'
import markdownItIns from 'markdown-it-ins'
import MdEditor, { Plugins } from 'react-markdown-editor-lite'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'

import { uploadImages } from '~/apis/medias.apis'
import { CreatePostReqData, UpdatePostReqData, createPost, updatePost } from '~/apis/posts.apis'
import { MediaTypes, PostCategory } from '~/constants/enums'
import { POST_CATEGORIES } from '~/constants/interfaceData'
import { Media, MediaWithFile } from '~/types/medias.types'
import { Post } from '~/types/posts.types'

import 'react-markdown-editor-lite/lib/index.css'

type PostFormProps = {
    editPost?: Post
}

const mdParser = new MarkdownIt().use(markdownItIns)

mdParser.renderer.rules.image = (tokens, idx, options, _, self) => {
    const token = tokens[idx]
    token.attrPush(['loading', 'lazy'])

    return self.renderToken(tokens, idx, options)
}

mdParser.renderer.rules.link_open = (tokens, idx, options, _, self) => {
    const token = tokens[idx]

    token.attrPush(['target', '_blank'])
    token.attrPush(['rel', 'noreferrer'])

    return self.renderToken(tokens, idx, options)
}

MdEditor.unuse(Plugins.BlockCodeInline)
MdEditor.unuse(Plugins.BlockCodeBlock)

function PostForm({ editPost }: PostFormProps) {
    const [image, setImage] = useState<Media | MediaWithFile | null>(
        editPost ? { url: `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${editPost.image}`, type: MediaTypes.Image } : null
    )
    const [category, setCategory] = useState<PostCategory>(editPost ? editPost.category : PostCategory.Introduction)
    const [title, setTitle] = useState<string>(editPost ? editPost.title : '')
    const [content, setContent] = useState<string>(editPost ? editPost.content : '')

    const imageRef = useRef<Media | MediaWithFile | null>(null)

    const handleUploadFileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) return

        const imageUrl = URL.createObjectURL(file)
        const imageUploaded: MediaWithFile = {
            url: imageUrl,
            type: MediaTypes.Image,
            file
        }

        imageRef.current = imageUploaded
        setImage(imageUploaded)
    }

    useEffect(() => {
        if (image === null && imageRef.current) {
            URL.revokeObjectURL(imageRef.current.url)
            imageRef.current = null
        }
    }, [image])

    const handleChange = (e: ContentEditableEvent) => {
        setTitle(e.currentTarget.textContent as string)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') e.preventDefault()
    }

    const { mutateAsync: mutateUploadImage } = useMutation({
        mutationFn: (data: FormData) => uploadImages(data)
    })

    const handleUploadImageMdEditor = async (file: File) => {
        const formData = new FormData()

        formData.append('image', file)

        const response = await mutateUploadImage(formData)
        const image = (response.data.result as Media[])[0].url

        return image
    }

    const handleUploadImagePost = async (image: Media | MediaWithFile) => {
        let imageUploaded: Media

        if ('file' in image) {
            const formData = new FormData()
            formData.append('image', image.file)

            const response = await mutateUploadImage(formData)
            imageUploaded = (response.data.result as Media[])[0]
        } else {
            imageUploaded = image
        }

        return {
            ...imageUploaded,
            url: imageUploaded.url.split('/').pop() as string
        } as Media
    }

    const { mutateAsync: mutateCreatePost } = useMutation({
        mutationFn: (data: CreatePostReqData) => createPost(data)
    })

    const { mutateAsync: mutateUpdatePost } = useMutation({
        mutationFn: ({ post_id, data }: { post_id: string; data: UpdatePostReqData }) => updatePost(post_id, data)
    })

    const handleSubmit = async () => {
        if (!title || !content || !image) {
            toast.error('Vui lòng cung cấp đầy đủ thông tin')
            return
        }

        const imageUploaded = await handleUploadImagePost(image)
        const data = {
            title,
            image: imageUploaded.url,
            content,
            category
        }

        if (editPost) {
            await mutateUpdatePost({ post_id: editPost._id, data })

            setImage({
                url: `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${imageUploaded.url}`,
                type: MediaTypes.Image
            })

            toast.success('Cập nhật bài viết thành công')
        } else {
            await mutateCreatePost(data)

            setTitle('')
            setContent('')
            setImage(null)
            setCategory(PostCategory.Introduction)

            toast.success('Đăng bài thành công')
        }
    }

    return (
        <>
            <ContentEditable
                tabIndex={0}
                role='textbox'
                aria-multiline={false}
                spellCheck={false}
                data-placeholder='Tiêu đề'
                html={title}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`relative mb-4 min-h-12 w-full cursor-text text-[32px] font-medium leading-[1.4] text-[#333] before:absolute before:inset-0 before:text-[32px] before:font-medium before:text-[#b3b3b1] before:content-[attr(data-placeholder)]${
                    title && title !== '' ? ' before:hidden' : ''
                }`}
            />

            <div className='mb-4 flex flex-wrap gap-4'>
                <div className='flex w-full max-w-[200px] flex-col gap-2'>
                    <div className='font-medium'>Ảnh bài viết:</div>
                    {image ? (
                        <div className='relative h-[120px]'>
                            <Image
                                src={image.url}
                                alt='Ảnh bài viết'
                                wrapperClassName='rounded-md h-full w-full overflow-hidden'
                                className='!h-full !w-full !object-cover'
                                preview
                            />

                            <div
                                className='absolute right-2 top-2 h-5 w-5 cursor-pointer'
                                onClick={() => setImage(null)}
                            >
                                <div className='flex h-full w-full items-center justify-center rounded-full border border-solid border-[#eee] bg-[#7c7e80] transition-all hover:bg-[#a7a5a5]'>
                                    <Icon icon='ic:round-close' className='absolute text-sm text-[#eee]' />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button type='dashed' className='relative w-max'>
                            <span>Chọn ảnh</span>
                            <label htmlFor='upload-image-post' className='absolute inset-0 cursor-pointer' />
                            <input
                                id='upload-image-post'
                                type='file'
                                accept='image/*'
                                className='invisible absolute block h-0 w-0'
                                onChange={handleUploadFileImage}
                            />
                        </Button>
                    )}
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='font-medium'>Thể loại:</div>
                    <Radio.Group
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='my-auto -mt-1'
                    >
                        {POST_CATEGORIES.map(({ value, label }, index) => (
                            <Radio key={index} value={value} className='mt-2'>
                                {label}
                            </Radio>
                        ))}
                    </Radio.Group>
                </div>
            </div>

            <MdEditor
                value={content}
                placeholder='Nội dung viết ở đây'
                renderHTML={(text) => mdParser.render(text)}
                onChange={({ text }) => setContent(text)}
                onImageUpload={handleUploadImageMdEditor}
                className='markdown'
                markdownClass='scrollbar-bg-transparent font-system !text-[15px] !leading-[1.8] [&::placeholder]:text-[#757575]'
                htmlClass='markdown-html'
            />

            <div className='mt-4 flex justify-center'>
                <Button
                    type='primary'
                    size='large'
                    className='w-[200px] !bg-[#1677ff] hover:!bg-[#4096ff]'
                    onClick={handleSubmit}
                >
                    {editPost ? 'Cập nhật' : 'Đăng bài'}
                </Button>
            </div>
        </>
    )
}

export default PostForm
