module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "server/entry.express.mjs",
      cwd: "/var/www/html/micio86/source",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      autorestart: true,
    },
  ],
  deploy: {
    production: {
      user: "www-data",
      host: "139.59.143.5",
      ref: "origin/master",
      repo: "git@github.com:micio86dev/qwik-portfolio.git",
      path: "/var/www/html/micio86",
      "post-deploy":
        "cp .env.example .env && bun i && bun run build && pm2 reload ecosystem.config.js --only portfolio",
      ssh_options: "StrictHostKeyChecking=no",
    },
  },
};

