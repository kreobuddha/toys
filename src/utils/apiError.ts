import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// Failures arrive as google.rpc.Status: `message` is for logs, `details` carries the codes the
// shop translates.

const BAD_REQUEST_TYPE = 'type.googleapis.com/google.rpc.BadRequest';
const ERROR_INFO_TYPE = 'type.googleapis.com/google.rpc.ErrorInfo';

interface IFieldViolation {
  field: string;
  description: string;
}

interface IErrorDetail {
  '@type'?: string;
  fieldViolations?: IFieldViolation[];
  reason?: string;
  domain?: string;
  metadata?: Record<string, string>;
}

interface IStatusError {
  code?: number;
  message?: string;
  details?: IErrorDetail[];
}

const statusOf = (error: unknown): IStatusError | undefined => {
  if (typeof error !== 'object' || error === null || !('data' in error)) return undefined;
  const { data } = error as FetchBaseQueryError & { data?: unknown };
  return typeof data === 'object' && data !== null ? (data as IStatusError) : undefined;
};

export const httpStatusOf = (error: unknown): number | undefined => {
  if (typeof error !== 'object' || error === null || !('status' in error)) return undefined;
  const { status } = error as FetchBaseQueryError;
  return typeof status === 'number' ? status : undefined;
};

/** Validation reasons by field path, empty when the failure was not a validation one. */
export const fieldViolationsOf = (error: unknown): Record<string, string> => {
  const violations = (statusOf(error)?.details ?? [])
    .filter((detail) => detail['@type'] === BAD_REQUEST_TYPE)
    .flatMap((detail) => detail.fieldViolations ?? []);
  return Object.fromEntries(
    violations.map((violation) => [violation.field, violation.description])
  );
};

export const errorReasonOf = (error: unknown): string | undefined =>
  statusOf(error)?.details?.find((detail) => detail['@type'] === ERROR_INFO_TYPE)?.reason;
