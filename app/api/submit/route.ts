import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { generateFeedbackGemini } from '../../../lib/gemini';



export async function POST(req: NextRequest) {
  const { session_id, user_answer } = await req.json();

  // Get the problem session
  const { data: session, error: sessionError } = await supabase
    .from('math_problem_sessions')
    .select('*')
    .eq('id', session_id)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
  }

  const is_correct = Number(user_answer) === Number(session.correct_answer);
  const feedback_text = await generateFeedbackGemini(session.problem_text, Number(user_answer), Number(session.correct_answer));

  // Save submission
  const { data, error } = await supabase
    .from('math_problem_submissions')
    .insert([{ session_id, user_answer, is_correct, feedback_text }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submission: data });
}
