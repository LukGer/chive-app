import { z } from "zod";

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export const EmptySuccessResponse = {
  description: "Success",
};

export const SuccessResponse = <T>(schema: T) => ({
  content: {
    "application/json": {
      schema,
    },
  },
  description: "Success",
});

export const UnauthorizedResponse = {
  content: {
    "application/json": {
      schema: ErrorResponseSchema,
    },
  },
  description: "Unauthorized - Invalid API key",
};

export const NotFoundResponse = {
  content: {
    "application/json": {
      schema: ErrorResponseSchema,
    },
  },
  description: "Not found",
};

export const JobAlreadyRunningResponse = {
  content: {
    "application/json": {
      schema: ErrorResponseSchema,
    },
  },
  description: "Job already running",
};

export const InternalServerErrorResponse = {
  content: {
    "application/json": {
      schema: ErrorResponseSchema,
    },
  },
  description: "Internal server error",
};

export const BadRequestResponse = {
  content: {
    "application/json": {
      schema: ErrorResponseSchema,
    },
  },
  description: "Bad request",
};

export const NoContentResponse = {
  description: "No content",
};

export const CreatedResponse = <T>(schema: T) => ({
  content: {
    "application/json": {
      schema,
    },
  },
  description: "Created successfully",
});

export const ForbiddenResponse = {
  content: {
    "application/json": {
      schema: ErrorResponseSchema,
    },
  },
  description: "Forbidden - Insufficient permissions",
};
