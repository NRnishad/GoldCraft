/**
 * Standard success envelope returned by controller helpers.
 */
export interface SuccessApiResponse<TData = unknown> {
  success: true;
  message: string;
  data: TData;
}

/**
 * Standard error envelope returned by the global error handler.
 */
export interface ErrorApiResponse<TError = unknown> {
  success: false;
  message: string;
  error: TError;
}

/**
 * Union type for any API response shape documented in the spec.
 */
export type ApiResponse<TData = unknown, TError = unknown> =
  | SuccessApiResponse<TData>
  | ErrorApiResponse<TError>;
