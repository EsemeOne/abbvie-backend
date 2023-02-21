module.exports = {
  apps: [
    {
      name: "abbvie-backend-app",
      script: "node index.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_test: {
        NODE_ENV: "test",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
