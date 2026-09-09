const app = require('./app');
require('dotenv').config();
const AuthService = require('./services/auth/AuthService');

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);

  await AuthService.createDefaultAdmin();
});
