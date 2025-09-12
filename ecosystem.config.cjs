// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "server/entry.express.mjs",
      cwd: "/var/www/html/micio86/source",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 5001,
        VITE_FIREBASE_API_KEY: "AIzaSyAgYHJGQfmVNWB9c5qbejqofavuEXNjTEg",
        VITE_FIREBASE_APP_ID: "1:923208738119:web:fb48c905ab5548c9005862",
        VITE_FIREBASE_APP_NAME: "portfolio-a52ee",
        VITE_FIREBASE_MEASUREMENT_ID: "G-N02R44P8NB",
        VITE_FIREBASE_MESSAGING_SENDER_ID: "923208738119",
        VITE_FIREBASE_DB_URL:
          "https://portfolio-a52ee-default-rtdb.europe-west1.firebasedatabase.app",
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
        'cp .env.production .env && bun i && bun run build && pm2 start "bun run start" --name portfolio',
      ssh_options: "StrictHostKeyChecking=no",
    },
  },
};
