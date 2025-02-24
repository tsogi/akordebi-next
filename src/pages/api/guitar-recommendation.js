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

    const prompt = `You are a guitar expert seller. You are given a collection of questions and answers. Based on the answers please select which guitar is the best fit for the user.

Questions and Answers:
${formattedAnswers}

Available Guitars:
${JSON.stringify(guitars, null, 2)}

Please respond with only the name of the single best matching guitar from the available guitars list.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a guitar expert seller. You must respond with only the exact name of the best matching guitar from the available list."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const recommendedGuitarName = completion.choices[0].message.content.trim();
    const recommendedGuitar = guitars.find(g => g.name === recommendedGuitarName) || guitars[0];

    res.status(200).json({ recommendation: recommendedGuitar });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing recommendation' });
  }
} 