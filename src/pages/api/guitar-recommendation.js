import OpenAI from 'openai';
import { guitars } from '@/data/guitars';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { answers } = req.body;

    // Convert answers to a readable format for GPT
    const formattedAnswers = answers.map(a => 
      `Question: ${a.question}\nAnswer: ${a.answer}`
    ).join('\n\n');

    // First, get the guitar recommendation
    const recommendationPrompt = `You are a guitar expert seller. You are given a collection of questions and answers. Based on the answers please select which guitar is the best fit for the user.

Questions and Answers:
${formattedAnswers}

Available Guitars:
${JSON.stringify(guitars, null, 2)}

Please respond with only the name of the single best matching guitar from the available guitars list.`;

    const recommendationCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a guitar expert seller. You must respond with only the exact name of the best matching guitar from the available list."
        },
        {
          role: "user",
          content: recommendationPrompt
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const recommendedGuitarName = recommendationCompletion.choices[0].message.content.trim();
    const recommendedGuitar = guitars.find(g => g.name === recommendedGuitarName) || guitars[0];

    // Then, get the explanation and selling points
    const summaryPrompt = `Based on the user's answers and the recommended guitar (${recommendedGuitar.name}), provide:
1. A brief explanation of why this guitar is perfect for them (2-3 sentences)
2. Three key selling points that make this guitar particularly appealing to this user

Questions and Answers:
${formattedAnswers}

Please provide a compelling but honest response highlighting the guitar's benefits for this specific user.`;

    const summaryCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an enthusiastic guitar expert. Provide compelling but honest reasons why the recommended guitar is perfect for the user."
        },
        {
          role: "user",
          content: summaryPrompt
        }
      ],
      max_tokens: 350,
      temperature: 0.7,
    });

    const summary = summaryCompletion.choices[0].message.content;

    res.status(200).json({ 
      recommendation: recommendedGuitar,
      summary: summary
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing recommendation' });
  }
} 