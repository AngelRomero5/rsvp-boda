module.exports = {
    apps: [{
        name: "rsvp-app",
        script: "./server.js",
        instances: "max",
        exec_mode: "cluster",
        env: {
            NODE_ENV: "production",
        }
    }]
}