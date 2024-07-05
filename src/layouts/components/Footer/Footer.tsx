import { Icon } from '@iconify/react'

function Footer() {
    return (
        <footer className='bg-[#181821] px-4 py-8'>
            <div className='mx-auto max-w-7xl text-center'>
                <h2 className='text-2xl font-medium text-white'>
                    Trung tâm Công nghệ Thông tin và Truyền thông Cà Mau
                </h2>

                <p className='mt-4 text-[#a9b3bb]'>
                    Trung tâm Công nghệ Thông tin và Truyền thông Cà Mau (ICT) tiên phong phát triển và ứng dụng công
                    nghệ thông tin, thúc đẩy chuyển đổi số. Trung tâm cung cấp dịch vụ tư vấn, triển khai hệ thống, đào
                    tạo và hỗ trợ kỹ thuật, góp phần nâng cao hiệu quả quản lý nhà nước và phát triển kinh tế - xã hội
                    tỉnh.
                </p>

                <div className='mt-10 flex h-9 justify-center'>
                    <button className='h-full flex-shrink-0 rounded-l-lg bg-blue-600 px-3 uppercase text-white'>
                        Đăng ký
                    </button>
                    <input
                        placeholder='Email của bạn'
                        className='h-full max-w-[320px] flex-[1] rounded-r-lg bg-[#f8f9fa] px-2 text-[#495057]'
                    />
                </div>

                <div className='mt-4 flex items-center justify-center gap-4 text-[#a9b3bb] [&>svg]:cursor-pointer [&>svg]:text-xl'>
                    <strong>Follow us</strong>
                    <Icon icon='ic:baseline-facebook' />
                    <Icon icon='ic:baseline-mail-outline' />
                    <Icon icon='ic:baseline-local-phone' />
                </div>
            </div>
        </footer>
    )
}

export default Footer
