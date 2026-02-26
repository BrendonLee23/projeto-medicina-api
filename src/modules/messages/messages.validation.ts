import { z } from 'zod';

/**
 * Schema de validação para criação de mensagem
 */
export const createMessageSchema = z.object({
  studentId: z.string().uuid('studentId deve ser um UUID válido'),
  familyName: z.string().min(1, 'Nome da família é obrigatório'),
  relationship: z.string().min(1, 'Relacionamento é obrigatório'),
  message: z
    .string()
    .min(1, 'Mensagem é obrigatória')
    .max(900, 'Mensagem deve ter no máximo 900 caracteres'),
});

/**
 * Schema de validação para atualização de mensagem
 */
export const updateMessageSchema = z.object({
  familyName: z.string().min(1, 'Nome da família é obrigatório').optional(),
  relationship: z.string().min(1, 'Relacionamento é obrigatório').optional(),
  message: z
    .string()
    .min(1, 'Mensagem é obrigatória')
    .max(900, 'Mensagem deve ter no máximo 900 caracteres')
    .optional(),
});

/**
 * Schema de validação para query params de listagem
 */
export const getMessagesQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
export type GetMessagesQuery = z.infer<typeof getMessagesQuerySchema>;
