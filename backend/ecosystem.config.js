module.exports = {
  apps: [{
    name: "calorie-counter-api",
    script: "./dist/server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 5005
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 5005
    }
  }]
}