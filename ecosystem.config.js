module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "server/entry.express.mjs",
      cwd: "/var/www/html/micio86/source",
      watch: false,
      env: {
        NODE_ENV: "production",
        VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
        VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
        VITE_FIREBASE_APP_NAME: process.env.VITE_FIREBASE_APP_NAME,
        VITE_FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID,
        VITE_FIREBASE_MESSAGING_SENDER_ID:
          process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        VITE_FIREBASE_DB_URL: process.env.VITE_FIREBASE_DB_URL,
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
      ref: "origin/main",
      repo: "git@github.com:micio86dev/qwik-portfolio.git",
      path: "/var/www/html/micio86/source",
      "post-deploy":
        "bun i && bun run build && pm2 reload ecosystem.config.js --only portfolio",
      ssh_options: "StrictHostKeyChecking=no",
    },
  },
};
