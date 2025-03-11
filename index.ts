// llm.invoke([new HumanMessage("Hello world!")]).then((resp) =>{
//   console.log("Resp: ",resp)
// })

import express from 'express';
import { setupAgentKit } from './agent';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint with body parsing
app.post('/', async (req, res) => {
  try {
    // Validate request body
    if (!req.body || !req.body.prompt) {
      return res.status(400).send({
        status: 'error',
        message: 'Missing required prompt in request body'
      });
    }

    // Process request with body data
    const result = await setupAgentKit(req.body);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error
    });
  }
});

app.get("/", async (req, res) =>{
  res.json("Hellp MoveAgent")
})

// Start the server
app.listen(port, () => {
  console.log(`Agent API running on http://localhost:${port}`);
});