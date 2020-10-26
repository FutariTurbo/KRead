export const routes = [
    {
        path: '/main',
        name: 'Main',
        component: () => import('../views/Main.vue'),
        children: [
            {
                path: 'bookshelf',
                name: 'Bookshelf',
                component: () => import('../views/mainViews/Bookshelf.vue')
            },
            {
                path: 'bookstore',
                name: 'BookStore',
                component: () => import('../views/mainViews/BookStore.vue')
            },
            {
                path: 'classify',
                name: 'Classify',
                component: () => import('../views/mainViews/Classify.vue')
            },
        ]
    },
    {
        path: '/bookdetail',
        name: 'BookDetail',
        component: () => import('../views/BookDetail.vue')
    },
    {
        path: '/contents',
        name: 'Contents',
        component: () => import('../views/Contents.vue')
    },
    {
        path: '/read',
        name: 'Read',
        component: () => import('../views/Read.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },
    {
        path: '/category',
        name: 'Category',
        component: () => import('../views/Category.vue')
    },
    {
        path: '/searthresult',
        name: 'SearthResult',
        component: () => import('../views/SearthResult.vue')
    },
    {
        path: '/morecomment',
        name: 'MoreComment',
        component: () => import('../components/MoreComment.vue')
    },
    {
        path: '*',
        redirect: {
          name: 'BookStore'
        }
    }
]