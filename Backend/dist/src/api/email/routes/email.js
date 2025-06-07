module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/send-email',
            handler: 'email.send',
            config: {
                policies: [],
                auth: false, // Set to true if you want auth
            },
        },
    ],
};
