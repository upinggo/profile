export const profileData = {
    id: '1',
    name: 'Neil Shen',
    role: 'Developer',
    bio: 'Passionate about creating innovative AI solutions',
    avatar: 'https://avatars.githubusercontent.com/u/25785956?v=4',
    aiProfiles: [
        {
            id: '1',
            name: 'Creative Assistant',
            description: 'Helpful for brainstorming and creative tasks',
            capabilities: ['brainstorming', 'creative writing', 'idea generation']
        },
        {
            id: '2',
            name: 'Tech Expert',
            description: 'Knowledgeable in programming and tech solutions',
            capabilities: ['programming', 'debugging', 'architecture']
        },
        {
            id: '3',
            name: 'Writing Coach',
            description: 'Assists with writing and editing tasks',
            capabilities: ['editing', 'proofreading', 'style improvement']
        }
    ]
};

export const technologies = [
    {
        id: 'frontend',
        name: 'Frontend Development',
        description: 'Technologies for building user interfaces',
        children: [
            {
                id: '1',
                name: 'JavaScript',
                description: 'A versatile language for web and mobile development',
                children: []
            },
            {
                id: '2',
                name: 'React',
                description: 'A popular JavaScript library for building user interfaces'
            },
            {
                id: '3',
                name: 'Vue.js',
                description: 'A progressive framework for building user interfaces'
            }
        ]
    },
    {
        id: 'backend',
        name: 'Backend Development',
        description: 'Technologies for server-side development',
        children: [
            {
                id: '1',
                name: 'Node.js',
                description: 'A JavaScript runtime for server-side development'
            },
            {
                id: '2',
                name: 'Express.js',
                description: 'A web application framework for Node.js'
            },
            {
                id: '3',
                name: 'Django',
                description: 'A high-level Python web framework'
            }
        ]
    },
    {
        id: 'devops',
        name: 'DevOps',
        description: 'Technologies for deployment and infrastructure management',
        children: [
            {
                id: '1',
                name: 'Docker',
                description: 'Containerization platform for application deployment'
            },
            {
                id: '2',
                name: 'Kubernetes',
                description: 'Container orchestration platform'
            },
            {
                id: '3',
                name: 'AWS',
                description: 'Cloud computing services'
            }
        ]
    },
    {
        id: 'tools',
        name: 'Development Tools',
        description: 'Tools to enhance development workflow',
        children: []
    }
]