import { z } from "zod";

export const InstructionSchema = z.object({
  text: z.string().min(1, "Instruction text is required"),
  timerSeconds: z.number().int().min(0).optional(),
  mediaUrl: z.url().optional(),
});

export const CreateInstructionSchema = InstructionSchema.extend({
  position: z.number().int().min(0),
});

export type Instruction = z.infer<typeof InstructionSchema>;
export type CreateInstruction = z.infer<typeof CreateInstructionSchema>;
