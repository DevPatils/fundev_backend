const express = require('express');
const app = express();
const router = require('./Routes/index');
const cors = require('cors');
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use(router);

app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});