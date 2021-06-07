import MainPage from './sections/main.vue';
import StatsPage from './sections/stats.vue';
import FeedbackPage from './sections/feedback.vue';
import PendingComments from './sections/pending_comments.vue'
import CommentDelete from './sections/pending_comments_delete.vue'
import Guilds from './sections/guilds.vue';
import ThanksPage from './sections/thanks.vue';
import DashboardPage from './sections/dashboard.vue';
import ddp from './sections/dashboard/default.vue';
import prefix from './sections/dashboard/prefix.vue';
import levelconfig from './sections/dashboard/levelconfig.vue';
import cp from './sections/dashboard/cp.vue';
import welcome from './sections/dashboard/welcome.vue';
import page404 from './sections/404.vue';

export default [
    {
        name: 'MainPage',
        path: '/',
        component: MainPage
    },
    {
        name: 'StatsPage',
        path: '/stats',
        component: StatsPage
    },
    {
        name: 'FeedbackPage',
        path: '/feedback',
        component: FeedbackPage
    },
    {
        name: 'PendingComments',
        path: '/pending-comments',
        component: PendingComments
    },
    {
        name: 'CommentDelete',
        path: '/pending-comments/delete/:id',
        component: CommentDelete
    },
    {
        name: 'Guilds',
        path: '/dashboard',
        component: Guilds
    },
    {
        name: 'ThanksPage',
        path: '/thanks',
        component: ThanksPage
    },
    {
        path: '/dashboard/:guildID',
        component: DashboardPage,
        children: [
            {
                name: 'DashboardPage',
                path: '',
                component: ddp
            },
            {
                name: 'Prefix',
                path: 'prefix',
                component: prefix
            },
            {
                name: 'LevelConfig',
                path: 'levels',
                component: levelconfig
            },
            {
                name: 'CustomResponses',
                path: 'cp',
                component: cp
            },
            {
                name: 'Welcome',
                path: 'welcome',
                component: welcome
            }
        ]
    },
    {
        path: "*",
        component: page404
    }
];