const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/moongse.js');
const user = require('./Router/User.js');
// const userRoutes = require('./router/user');
const app = express();
const cors = require('cors');
app.use(cors({ origin: 'https://mc-qweb-b9hw.vercel.app/' }));
app.use(cors());
app.use(express.json());

// Routes
app.use('/user', user);
// app.use('/api/users', userRoutes);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
