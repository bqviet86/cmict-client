import PostForm from '~/components/PostForm'

function CreatePost() {
    return (
        <div className='px-2 py-6'>
            <h2 className='mb-4 text-center text-4xl font-semibold text-[#4096ff]'>Đăng bài viết</h2>
            <PostForm />
        </div>
    )
}

export default CreatePost
