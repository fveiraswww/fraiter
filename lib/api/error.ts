/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const ErrorCode = z.enum([
  'bad_request',
  'not_found',
  'internal_server_error',
  'unauthorized',
  'forbidden',
  'rate_limit_exceeded',
  'invite_expired',
  'invite_pending',
  'exceeded_limit',
  'conflict',
  'unprocessable_entity',
]);

const errorCodeToHttpStatus: Record<z.infer<typeof ErrorCode>, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  exceeded_limit: 403,
  not_found: 404,
  conflict: 409,
  invite_pending: 409,
  invite_expired: 410,
  unprocessable_entity: 422,
  rate_limit_exceeded: 429,
  internal_server_error: 500,
};

const speakeasyErrorOverrides: Record<z.infer<typeof ErrorCode>, string> = {
  bad_request: 'BadRequest',
  unauthorized: 'Unauthorized',
  forbidden: 'Forbidden',
  exceeded_limit: 'ExceededLimit',
  not_found: 'NotFound',
  conflict: 'Conflict',
  invite_pending: 'InvitePending',
  invite_expired: 'InviteExpired',
  unprocessable_entity: 'UnprocessableEntity',
  rate_limit_exceeded: 'RateLimitExceeded',
  internal_server_error: 'InternalServerError',
};

const ErrorSchema = z.object({
  error: z.object({
    code: ErrorCode,
    message: z.string(),
    doc_url: z.string().optional(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorSchema>;

export function lattterError(
  errorCode: z.infer<typeof ErrorCode>,
  message?: string
) {
  const error = {
    code: errorCode,
    message: message ?? speakeasyErrorOverrides[errorCode],
  };

  const status = errorCodeToHttpStatus[errorCode];

  console.log(error.message);

  return NextResponse.json<ErrorResponse>({ error }, { status });
}
