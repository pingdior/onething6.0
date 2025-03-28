module.exports = {
    apps : [{
      name: 'onething',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--dns-result-order=ipv4first'
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/app-error.log',
      out_file: 'logs/app-out.log'
    }]
  };