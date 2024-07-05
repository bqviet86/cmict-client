const routes = {
    home: '/',
    login: '/login',
    register: '/register',
    introduce: '/introduce',
    news: '/news',
    products: '/products',
    services: '/services',
    tutorials: '/tutorials',
    contact: '/contact',
    myProfile: '/my-profile',
    createPost: '/create-post',
    myPosts: '/my-posts',
    postDetail: '/post-detail/:post_slug',
    editPost: '/edit-post/:post_slug',

    // Admin
    adminPosts: '/admin/posts',
    adminUsers: '/admin/users',
    adminContacts: '/admin/contacts',
    adminContactDetail: '/admin/contact-detail/:contact_id'
}

export default routes
