const development = {
  name: 'development',
  asset_path: '/assets',
  session_cookie_key: 'session-cookie-123',
  db: 'codeial-development',
  smtp: {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
          user: '',
          pass: ''
      }
  },
  google_client_id: "448487103035-m3assm4hqjfgmss47jgvjbl230pgmfgq.apps.googleusercontent.com",
  google_client_secret: "QOxXTH3qDiGuBWpyk3vQnfHV",
  google_call_back_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: 'jwt-secret-123',
}

const production =  {
  name: 'production'
}

module.exports = development;