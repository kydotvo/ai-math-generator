// Gemini API integration helper
// Replace YOUR_GEMINI_API_KEY with your actual Gemini API key or use env variable

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function generateMathProblemGemini() {
  const prompt = `Generate a Primary 5 math word problem. Return a JSON object with two fields: problem_text (the word problem) and final_answer (the correct numerical answer). Example: {"problem_text": "If a box contains 12 apples and 5 are taken out, how many apples are left?", "final_answer": 7}`;

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await res.json();
  // Gemini returns the response in data.candidates[0].content.parts[0].text
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function generateFeedbackGemini(problem: string, userAnswer: number, correctAnswer: number) {
  const prompt = `The following is a Primary 5 math word problem: "${problem}". The student answered: ${userAnswer}. The correct answer is: ${correctAnswer}. Give personalized feedback for the student. Return only the feedback as plain text.`;

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await res.json();
  // Gemini returns the response in data.candidates[0].content.parts[0].text
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
