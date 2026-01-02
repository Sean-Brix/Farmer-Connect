export const menuItems = [
    {
        key: 'home',
        label: 'Home',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.707 2.293a1 1 0 0 1 1.414 0l8 8A1 1 0 0 1 19.707 11H19v8a2 2 0 0 1-2 2h-2a1 1 0 0 1-1-1v-4h-2v4a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-8h-.707a1 1 0 0 1-.707-1.707l8-8z"/>
            </svg>
        ),
        to: '/',
    },
    {
        key: 'analytics',
        label: 'Analytics',
        icon: <i className="fas fa-chart-bar w-5 h-5"></i>,
    },
    {
        key: 'profiles',
        label: 'User Profiles',
        icon: <i className="fas fa-users w-5 h-5"></i>,
    },
    {
        key: 'enrollment',
        label: 'Seminars',
        icon: <i className="fas fa-graduation-cap w-5 h-5"></i>,
    },
    {
        key: 'eic',
        label: 'EIC - Item Panel',
        icon: <i className="fas fa-tags w-5 h-5"></i>,
    },
    {
        key: 'distribution',
        label: 'Distributions',
        icon: <i className="fas fa-truck w-5 h-5"></i>,
    },
    {
        key: 'content',
        label: 'Inventory',
        icon: <i className="fas fa-warehouse w-5 h-5"></i>,
    },
    {
        key: 'audit',
        label: 'Logs / Audit Trail',
        icon: <i className="fas fa-history w-5 h-5"></i>,
    },
    {
        key: 'chat',
        label: 'Inquiries',
        icon: <i className="fas fa-comments w-5 h-5"></i>,
    },
    {
        key: 'seed',
        label: 'Seed Growth Tracking',
        icon: <i className="fas fa-seedling w-5 h-5"></i>,
    },
    {
        key: 'survey',
        label: 'Survey Forms',
        icon: <i className="fas fa-clipboard-check w-5 h-5"></i>,
    },
];
