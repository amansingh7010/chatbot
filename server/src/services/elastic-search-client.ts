import { Client } from '@elastic/elasticsearch';

export const elasticSearchClient = new Client({
  node: process.env.ELASTIC_SEARCH_URI,
});

export async function initIndex() {
  try {
    await elasticSearchClient.indices.create({
      index: 'user_questions',
      body: {
        mappings: {
          properties: {
            question: { type: 'text' },
            vector: { type: 'dense_vector', dims: 768 },
          },
        },
      },
    });
  } catch (e) {
    console.error('Error initializing index:', e);
  }
}
