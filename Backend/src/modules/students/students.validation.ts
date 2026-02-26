import { z } from 'zod';

/**
 * Schema de validação para query params da listagem de alunos
 */
export const getStudentsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export type GetStudentsQuery = z.infer<typeof getStudentsQuerySchema>;
