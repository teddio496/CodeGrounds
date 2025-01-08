module.exports = {
  apps: [{
    name: 'scrp',
    script: 'npm start',
    env_production: {
      ACCESS_TOKEN_SECRET: 'B2k9Xv8fH4aWyJQ',
      REFRESH_TOKEN_SECRET: 'p7Zr1NhQs0GbLxM',
      NODE_ENV: "production",
    }
  }],

  deploy: {
    production: {
      key: 'key2.pem',
      user: 'ubuntu',
      host: '3.14.248.222',
      ref: 'origin/master',
      repo: 'ssh://drprj@markus.teach.cs.toronto.edu/markus/csc309-2024-09/group_10067.git',
      path: '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && cd PP2 && . ./post-deploy.sh',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
