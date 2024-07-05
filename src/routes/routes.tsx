import { routes as routesConfig } from '~/config'
import DefaultLayout, { AdminLayout, ContentDefaultLayout } from '~/layouts'

import Home from '~/pages/Home'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import Introduce from '~/pages/Introduce'
import News from '~/pages/News'
import Products from '~/pages/Products'
import Services from '~/pages/Services'
import Tutorials from '~/pages/Tutorials'
import Contact from '~/pages/Contact'
import PostDetail from '~/pages/PostDetail'
import MyProfile from '~/pages/MyProfile'
import CreatePost from '~/pages/CreatePost'
import MyPosts from '~/pages/MyPosts'
import EditPost from '~/pages/EditPost'
import AdminPost from '~/pages/AdminPost'
import AdminUser from '~/pages/AdminUser'
import AdminContact from '~/pages/AdminContact'
import AdminContactDetail from '~/pages/AdminContactDetail'

// Thêm unnecessary: true để báo là route này khi đã đăng nhập thì không cần truy cập nữa
// Thêm protected: true để báo là route này cần phải đăng nhập mới được truy cập
// Thêm onlyAdmin: true để báo là route này chỉ có admin mới được truy cập
// Children: [] chứa các route con

export type Route = {
    path: string
    component: () => JSX.Element
    layout: ({ children }: { children: React.ReactNode }) => JSX.Element
    unnecessary?: boolean
    protected?: boolean
    onlyAdmin?: boolean
    children?: Omit<Route, 'layout'>[]
}

const routes: Route[] = [
    {
        path: routesConfig.home,
        component: Home,
        layout: DefaultLayout
    },
    {
        path: routesConfig.login,
        component: Login,
        layout: DefaultLayout,
        unnecessary: true
    },
    {
        path: routesConfig.register,
        component: Register,
        layout: DefaultLayout,
        unnecessary: true
    },
    {
        path: routesConfig.introduce,
        component: Introduce,
        layout: ContentDefaultLayout
    },
    {
        path: routesConfig.news,
        component: News,
        layout: ContentDefaultLayout
    },
    {
        path: routesConfig.products,
        component: Products,
        layout: ContentDefaultLayout
    },
    {
        path: routesConfig.services,
        component: Services,
        layout: ContentDefaultLayout
    },
    {
        path: routesConfig.tutorials,
        component: Tutorials,
        layout: ContentDefaultLayout
    },
    {
        path: routesConfig.contact,
        component: Contact,
        layout: ContentDefaultLayout
    },
    {
        path: routesConfig.postDetail,
        component: PostDetail,
        layout: ContentDefaultLayout
    },
    {
        path: routesConfig.myProfile,
        component: MyProfile,
        layout: ContentDefaultLayout,
        protected: true
    },
    {
        path: routesConfig.createPost,
        component: CreatePost,
        layout: DefaultLayout,
        protected: true
    },
    {
        path: routesConfig.myPosts,
        component: MyPosts,
        layout: ContentDefaultLayout,
        protected: true
    },
    {
        path: routesConfig.editPost,
        component: EditPost,
        layout: DefaultLayout,
        protected: true
    },

    // Admin
    {
        path: routesConfig.adminPosts,
        component: AdminPost,
        layout: AdminLayout,
        onlyAdmin: true
    },
    {
        path: routesConfig.adminUsers,
        component: AdminUser,
        layout: AdminLayout,
        onlyAdmin: true
    },
    {
        path: routesConfig.adminContacts,
        component: AdminContact,
        layout: AdminLayout,
        onlyAdmin: true
    },
    {
        path: routesConfig.adminContactDetail,
        component: AdminContactDetail,
        layout: AdminLayout,
        onlyAdmin: true
    }
]

export default routes
