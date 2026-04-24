const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { processHierarchies } = require('./processor');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Identity Fields - Replace these with your actual details
const IDENTITY = {
    user_id: "vppraneeth_26012006",
    email_id: "pv1719@srmist.edu.in",
    college_roll_number: "RA2311027020125"
};

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "Invalid input format. Expected 'data' array."
            });
        }

        const processed = processHierarchies(data);

        const response = {
            ...IDENTITY,
            ...processed
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            is_success: false,
            message: "Internal server error."
        });
    }
});

// Basic GET route for health check
app.get('/', (req, res) => {
    res.send("Tree Processor API is running.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
