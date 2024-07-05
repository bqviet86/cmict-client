import { Icon } from '@iconify/react'
import images from '~/assets/images'

import { routes } from '~/config'
import { PostCategory } from '~/constants/enums'

type HeaderNavigationType = {
    path: string
    title: string
    icon: JSX.Element
}

export const HEADER_NAVIGATIONS_ROUTES_LOGGED_IN: HeaderNavigationType[] = [
    {
        path: routes.home,
        title: 'Trang chủ',
        icon: <Icon icon='ic:baseline-home' />
    },
    {
        path: routes.introduce,
        title: 'Giới thiệu',
        icon: <Icon icon='ic:baseline-info' />
    },
    {
        path: routes.news,
        title: 'Tin tức',
        icon: <Icon icon='ic:baseline-description' />
    },
    {
        path: routes.products,
        title: 'Sản phẩm',
        icon: <Icon icon='ic:baseline-business-center' />
    },
    {
        path: routes.services,
        title: 'Dịch vụ',
        icon: <Icon icon='ic:round-language' />
    },
    {
        path: routes.tutorials,
        title: 'Thủ thuật',
        icon: <Icon icon='ic:baseline-tips-and-updates' />
    },
    {
        path: routes.contact,
        title: 'Liên hệ',
        icon: <Icon icon='ic:baseline-mail-outline' />
    }
]

export const HEADER_NAVIGATIONS_ROUTES: HeaderNavigationType[] = [
    ...HEADER_NAVIGATIONS_ROUTES_LOGGED_IN,
    {
        path: routes.login,
        title: 'Đăng nhập',
        icon: <Icon icon='ic:baseline-login' />
    }
]

export const HEADER_MENU_ITEMS_LOGGED_IN: (Omit<HeaderNavigationType, 'path'> & { path?: string })[] = [
    {
        title: 'Thông tin cá nhân',
        icon: <Icon icon='ic:baseline-account-circle' />,
        path: routes.myProfile
    },
    {
        title: 'Đăng bài',
        icon: <Icon icon='ic:baseline-post-add' />,
        path: routes.createPost
    },
    {
        title: 'Bài viết của tôi',
        icon: <Icon icon='ic:baseline-article' />,
        path: routes.myPosts
    },
    {
        title: 'Đăng xuất',
        icon: <Icon icon='ic:baseline-logout' />
    }
]

export const HEADER_MENU_ITEMS_ADMIN: (Omit<HeaderNavigationType, 'path'> & { path?: string })[] = [
    {
        title: 'Trang quản trị',
        icon: <Icon icon='ic:baseline-settings' />,
        path: routes.adminPosts
    },
    ...HEADER_MENU_ITEMS_LOGGED_IN
]

// Admin
type AdminRouteType = {
    path: string
    title: string
    icon: JSX.Element
}

export const ADMIN_SIDEBAR_ROUTES: AdminRouteType[] = [
    {
        path: routes.adminPosts,
        title: 'Quản lý bài đăng',
        icon: (
            <svg
                className='mr-2 h-6 w-6 text-[#e4e6eb]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z'
                />
            </svg>
        )
    },
    {
        path: `${routes.adminUsers}?page=1`,
        title: 'Quản lý người dùng',
        icon: (
            <svg
                className='mr-2 h-6 w-6 text-[#e4e6eb]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeWidth='2'
                    d='M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                />
            </svg>
        )
    },
    {
        path: `${routes.adminContacts}?page=1`,
        title: 'Liên hệ',
        icon: (
            <svg
                className='mr-2 h-6 w-6 text-[#e4e6eb]'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <g>
                    <path
                        d='M5 11.5C5 9.61438 5 8.67157 5.58579 8.08579C6.17157 7.5 7.11438 7.5 9 7.5H15C16.8856 7.5 17.8284 7.5 18.4142 8.08579C19 8.67157 19 9.61438 19 11.5V12.5C19 14.3856 19 15.3284 18.4142 15.9142C17.8284 16.5 16.8856 16.5 15 16.5H9C7.11438 16.5 6.17157 16.5 5.58579 15.9142C5 15.3284 5 14.3856 5 12.5V11.5Z'
                        stroke='currentColor'
                        strokeWidth='1.5'
                    />
                    <path
                        d='M19 2V2.5C19 3.88071 17.8807 5 16.5 5H7.5C6.11929 5 5 3.88071 5 2.5V2'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                    />
                    <path
                        d='M19 22V21.5C19 20.1193 17.8807 19 16.5 19H7.5C6.11929 19 5 20.1193 5 21.5V22'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                    />
                </g>
            </svg>
        )
    }
]

export const POST_CATEGORIES = [
    {
        value: PostCategory.Introduction,
        label: 'Giới thiệu'
    },
    {
        value: PostCategory.News,
        label: 'Tin tức'
    },
    {
        value: PostCategory.Product,
        label: 'Sản phẩm'
    },
    {
        value: PostCategory.Service,
        label: 'Dịch vụ'
    },
    {
        value: PostCategory.Tutorial,
        label: 'Thủ thuật'
    }
]

export const SLIDER_ITEMS = [
    {
        image: images.slide1,
        path: routes.introduce
    },
    {
        image: images.slide2,
        path: routes.news
    },
    {
        image: images.slide3,
        path: routes.products
    },
    {
        image: images.slide4,
        path: routes.services
    },
    {
        image: images.slide5,
        path: routes.tutorials
    }
]

export const HOME_PAGE_OVERALL_DATA = [
    {
        title: 'Sản phẩm',
        path: routes.products,
        desc: 'Nghiên cứu, thiết kế, xây dựng các sản phẩm Công nghệ Thông tin, Truyền thông, Bưu chính Viễn thông, Báo chí và Xuất bản [...]',
        icon: <Icon icon='ic:baseline-business-center' />,
        color: '#4db748'
    },
    {
        title: 'Dịch vụ',
        path: routes.services,
        desc: 'Các dịch vụ mà Trung tâm Công nghệ Thông tin và Truyền thông Cà Mau thực hiện: Đào tạo, Tư vấn, giám sát, thiết kế, thi công [...]',
        icon: <Icon icon='ic:round-language' />,
        color: '#f47032'
    },
    {
        title: 'Thủ thuật',
        path: routes.tutorials,
        desc: 'Tổng hợp các thủ thuật, kỹ năng máy tính sử dụng máy tính và một số phần mềm, ứng dụng trong lĩnh vực công nghệ thông tin [...]',
        icon: <Icon icon='ic:baseline-tips-and-updates' />,
        color: '#1e8bc3'
    },
    {
        title: 'Tin tức',
        path: routes.news,
        desc: 'Tổng hợp đầy đủ thông tin về các lĩnh vực Công nghệ Thông tin, Bưu chính Viễn thông, Báo chí Xuất bản trong nước, trong tỉnh [...]',
        icon: <Icon icon='ic:baseline-description' />,
        color: '#ed1b24'
    }
]

export const BACKGROUND_COLOR_TOPS: Record<number, string> = {
    1: 'bg-top-1',
    2: 'bg-top-2',
    3: 'bg-top-3'
}

export const REASON_CHOOSE_ICT = [
    {
        title: 'Đối với khách hàng',
        desc: 'Luôn đặt lợi ích của khách hàng là trên hết, Luôn cam kết thỏa mãn tối đa lợi ích của khách hàng trên cơ sở cung cấp cho khách hàng những sản phẩm dịch vụ tối ưu, nhiều tiện ích, chi phí có tính cạnh tranh..'
    },
    {
        title: 'Đối với Nhân viên',
        desc: 'Luôn quan tâm đến lợi ích của nhân viên, người lao động, kể cả đời sống vật chất và đời sống tinh thần của người lao động, đảm bảo mức thu nhập cao và ổn định, có cơ hội thăng tiến, người lao động thường xuyên được nâng cao trình độ nghiệp vụ, được phát triển cả quyền lợi chính trị và văn hóa..'
    },
    {
        title: 'Đối với cộng đồng',
        desc: 'Luôn cam kết thực hiện tốt nghĩa vụ tài chính đối với ngân sách nhà nước; Luôn quan tâm chăm lo đến công tác xã hội, từ thiện để chia sẽ khó khăn của cộng đồng.'
    }
]
