import { lattterError } from '@/lib/api/error';
import { supabaseServer } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { streamText } from 'ai';
import { match } from 'ts-pattern';

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  console.log('entrandooooo');
  try {
    const token = req.headers.get('Authorization');

    if (!token) return lattterError('unauthorized');

    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) return lattterError('unauthorized');

    const { data: userDetails } = await supabase
      .from('user_details')
      .select()
      .eq('user_id', user.id)
      .single();

    const { data: profile, error } = await supabase
      .from('profile')
      .select()
      .eq('user_id', user.id)
      .eq('profile', userDetails?.profile)
      .single();

    if (!profile)
      return lattterError(
        'bad_request',
        'There is no profile created available'
      );

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === '') {
      return new Response(
        'Missing OPENAI_API_KEY - make sure to add it to your .env file.',
        {
          status: 400,
        }
      );
    }
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const ip = req.headers.get('x-forwarded-for');
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(50, '1 d'),
      });

      const { success, limit, reset, remaining } = await ratelimit.limit(
        `novel_ratelimit_${ip}`
      );

      if (!success) {
        return new Response(
          'You have reached your request limit for the day.',
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
    }

    const context =
      'To make the change, base it on the examples:' +
      JSON.stringify(profile?.context);

    const { prompt, option, command } = await req.json();
    const messages = match(option)
      .with('continue', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that continues existing text based on context from prior text. ' +
            'Give more weight/priority to the later characters than the beginning ones. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: context + `The existing text is: ${prompt}`,
        },
      ])
      .with('improve', () => [
        {
          role: 'system',
          content:
            'You dont give introductions, nor explanations, just the concrete answer.' +
            'You are an AI writing assistant that improves existing text based on examples. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: context + `The existing text is: ${prompt}`,
        },
      ])
      .with('shorter', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that shortens existing text. ' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: context + `The existing text is: ${prompt}`,
        },
      ])
      .with('longer', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that lengthens existing text. ' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: context + `The existing text is: ${prompt}`,
        },
      ])
      .with('fix', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that fixes grammar and spelling errors in existing text. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: context + `The existing text is: ${prompt}`,
        },
      ])
      .with('zap', () => [
        {
          role: 'system',
          content:
            'You area an AI writing assistant that generates text based on a prompt. ' +
            'You take an input from the user and a command for manipulating the text' +
            'Use Markdown formatting when appropriate.' +
            context,
        },
        {
          role: 'user',
          content: `For this text: ${prompt}. You have to respect the command: ${command}`,
        },
      ])
      .run();

    const result = await streamText({
      prompt: messages[messages.length - 1].content,
      maxTokens: 4096,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      model: openai('gpt-4o'),
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return lattterError('internal_server_error', JSON.stringify(error));
  }
}
