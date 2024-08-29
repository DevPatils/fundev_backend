const express = require('express');
const app = express();
const router = require('./Routes/index');
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use(router);

app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});