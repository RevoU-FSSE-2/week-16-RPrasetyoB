const clientAccess = {
    limitedClient : {
        origin: ['https://week15-rpb-x.netlify.app', 'https://week15-rpb-x.netlify.app/*','https://week15-rpb-y.netlify.app', 'https://week15-rpb-y.netlify.app/*'],
        // origin: ['http://localhost:5173', 'http://localhost:5173/add'],
        methods: ['GET', 'POST']
    },
    globalClient : {
        origin: ['https://week15-rpb-y.netlify.app', 'https://week15-rpb-y.netlify.app/*'],
        methods: ['PATCH', 'DELETE']
    }
}

export default clientAccess