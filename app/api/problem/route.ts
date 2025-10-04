import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { generateMathProblemGemini } from '../../../lib/gemini';



export async function POST(req: NextRequest) {
  const geminiResult = await generateMathProblemGemini();
  if (!geminiResult) {
    return NextResponse.json({ error: 'Failed to generate problem from Gemini.' }, { status: 500 });
  }
  const { problem_text, final_answer } = geminiResult;

  // Save to Supabase
  const { data, error } = await supabase
    .from('math_problem_sessions')
    .insert([{ problem_text, correct_answer: final_answer }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}
