const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const { userRoute } = require('./routes/userRoute');

const app = express();
dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoute);

app.get('/', (req, res) => {
    res.send("Ustream is live")
});

app.listen(PORT, () => {
    console.log(`Ustream running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})