module.exports = {
    apps: [{
        name: "rsvp-app",
        script: "./server.js",
        instances: 1,
        exec_mode: "cluster",
        env: {
            NODE_ENV: "production",
        },
        autorestart: true,
        watch: false, 
    }]
}