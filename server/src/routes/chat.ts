import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import axios from 'axios';
import { Client } from '@elastic/elasticsearch';

import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

const huggingFaceEndpoint = 'https://api-inference.huggingface.co/models/gpt2';

// Initialize Elasticsearch client
const elasticClient = new Client({ node: 'http://elasticsearch-srv:9200' });

// Function to turn message to vector
// Replace with real logic to convert text to embeddings
const turnMessageToVector = (message: string) => {
  return [Math.random(), Math.random()]; // Mock
};

// Save vector to Elasticsearch
const saveVectorToElastic = async (vector: number[]) => {
  await elasticClient.index({
    index: 'message_vectors',
    body: { vector },
  });
};

// Query similar vectors in Elasticsearch
const querySimilarVectors = async (vector: number[]) => {
  const response = await elasticClient.search({
    index: 'message_vectors',
    body: {
      size: 1, // Return one similar vector
      query: {
        script_score: {
          query: { match_all: {} },
          script: {
            source:
              "cosineSimilarity(params.query_vector, doc['vector']) + 1.0",
            params: { query_vector: vector },
          },
        },
      },
    },
  });
  console.log(response);
  return response.hits.hits;
};
router.post(
  '/api/chat',
  [body('message').not().isEmpty().withMessage('Message is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { message } = req.body;

    // Turn message into a vector
    const messageVector = turnMessageToVector(message);

    // Save to Elasticsearch
    await saveVectorToElastic(messageVector);

    // Can use `similarVectors` to check if the FAQ can answer the question
    // and respond immediately if possible
    // Query similar vectors
    // const similarVectors = await querySimilarVectors(messageVector);

    // Make an API call to HuggingFace to get the GPT-2 response
    const hfResponse = await axios.post(
      huggingFaceEndpoint,
      {
        inputs: message,
        parameters: {
          repetition_penalty: 4.0,
          max_length: 50,
          num_return_sequences: 1,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    const botResponse =
      hfResponse.data[0].generated_text ||
      "I don't know how to respond to that.";

    res.send({ botResponse });
  }
);

export { router as chatRouter };
