import * as yup from 'yup';

const MAX_ALIAS_LENGTH = 20;

export const CreateShortUrlBodySchema = yup.object({
  originalUrl: yup.string().url().required(),
  alias: yup.string().max(MAX_ALIAS_LENGTH).optional(),
  expiresAt: yup.date().optional(),
});

export type CreateShortUrlBodySchemaType = yup.InferType<typeof CreateShortUrlBodySchema>;