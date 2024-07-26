module.exports = {
    apps: [
        {
            name: "MarketPlace",
            script: "./app.js",
            env_develop: {
                NODE_ENV: "develop",
            },
            env_prod: {
                NODE_ENV: "prod",
            },
        },
    ],
};
