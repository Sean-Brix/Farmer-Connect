import express from 'express'

// Route: ('/')
const router = express.Router();

router.get('/', (req, res)=>{
    res.status(200).send("<h1> Temporary Route </h1>")
})

router.post('/api/test/api_response', (req, res)=>{
    const { data1, data2 } = req.body;

    res.status(200).json({
        message: "Fetch Request Sucessful",
        payload: [data1, data2],
        status: 200
    })
});

export default router;