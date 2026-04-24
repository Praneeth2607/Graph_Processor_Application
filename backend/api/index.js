const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { processHierarchies } = require('../processor');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Identity Fields
const IDENTITY = {
    user_id: "vppraneeth_26012006",
    email_id: "pv1719@srmist.edu.in",
    college_roll_number: "RA2311027020125"
};

// Use a router to handle both /bfhl and /api/bfhl
const router = express.Router();

router.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid input format." });
        }
        const processed = processHierarchies(data);
        res.status(200).json({ ...IDENTITY, ...processed });
    } catch (error) {
        res.status(500).json({ is_success: false, message: "Internal server error." });
    }
});

router.get('/bfhl', (req, res) => {
    res.status(200).json({
        ...IDENTITY,
        message: "The BFHL endpoint is active."
    });
});

router.get('/', (req, res) => {
    res.send("Tree Processor API is running. Path: " + req.url);
});

// Mount the router on both / and /api to be safe
app.use('/api', router);
app.use('/', router);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
