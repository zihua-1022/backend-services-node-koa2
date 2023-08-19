const path = require("path");

module.exports = {
  apps: [
    {
      name: "app",
      script: "app.js",
      watch: false,
      exec_mode: "cluster",
      log_date_format: "YYYY_MM_DD HH:mm:ss",
      out_file: path.join(__dirname, "..", "logs/weapp_service/out.log"), // 全部日志标准输出文件及位置
      error_file: path.join(__dirname, "..", "logs/weapp_service/error.log"), // 错误输出日志文件及位置
      env: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
