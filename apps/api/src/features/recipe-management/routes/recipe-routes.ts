import { createRouter } from "@/lib/createApp";
import {
  authenticate,
  requireAdmin,
  requireAuth,
} from "@/middleware/auth-middleware";
import {
  BadRequestResponse,
  CreatedResponse,
  ForbiddenResponse,
  NoContentResponse,
  NotFoundResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from "../../general/response/general.schema";
import {
  CreateRecipeSchema,
  CreateUserRecipeSchema,
  IdParamSchema,
  RecipeListQuerySchema,
  RecipeListResponseSchema,
  RecipeResponseSchema,
  RecipeStatsSchema,
  RecipeWithDetailsSchema,
  UpdateRecipeSchema,
} from "../schemas";
import { RecipeService } from "../services/recipe-service";

const router = createRouter();

router.use(authenticate);

router.openapi(
  {
    method: "post",
    path: "/recipes",
    middleware: [requireAuth],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateRecipeSchema,
          },
        },
      },
    },
    responses: {
      201: CreatedResponse(RecipeResponseSchema),
      400: BadRequestResponse,
      401: UnauthorizedResponse,
    },
    tags: ["Recipes"],
    summary: "Create a new recipe",
    description: "Create a new recipe with the provided data",
  },
  async (c) => {
    try {
      const data = c.req.valid("json");
      const recipe = await RecipeService.createRecipe(data);

      return c.json(recipe, 201);
    } catch (error) {
      return c.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to create recipe",
        },
        400
      );
    }
  }
);

router.openapi(
  {
    method: "post",
    path: "/recipes/user",
    middleware: [requireAuth],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserRecipeSchema,
          },
        },
      },
    },
    responses: {
      201: CreatedResponse(RecipeResponseSchema),
      400: BadRequestResponse,
      401: UnauthorizedResponse,
    },
    tags: ["Recipes"],
    summary: "Create a new recipe",
    description:
      "Create a new recipe with ingredients, instructions, and optional tags.",
  },
  async (c) => {
    try {
      const data = c.req.valid("json");
      const recipe = await RecipeService.createUserRecipe(data);

      return c.json(recipe, 201);
    } catch (error) {
      return c.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to create recipe",
        },
        400
      );
    }
  }
);

router.openapi(
  {
    method: "get",
    path: "/recipes",
    middleware: [requireAuth],
    request: {
      query: RecipeListQuerySchema,
    },
    responses: {
      200: SuccessResponse(RecipeListResponseSchema),
      400: BadRequestResponse,
      401: UnauthorizedResponse,
    },
    tags: ["Recipes"],
    summary: "Get list of recipes",
    description:
      "Retrieve a paginated list of recipes with optional filtering and sorting",
  },
  async (c) => {
    try {
      const query = c.req.valid("query");
      const result = await RecipeService.listRecipes(query);

      return c.json(result, 200);
    } catch (error) {
      return c.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to retrieve recipes",
        },
        400
      );
    }
  }
);

router.openapi(
  {
    method: "get",
    path: "/recipes/{id}",
    middleware: [requireAuth],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: SuccessResponse(RecipeWithDetailsSchema),
      404: NotFoundResponse,
      400: BadRequestResponse,
      401: UnauthorizedResponse,
    },
    tags: ["Recipes"],
    summary: "Get recipe by ID",
    description:
      "Retrieve a specific recipe with all its details including ingredients, instructions, and tags",
  },
  async (c) => {
    const { id } = c.req.valid("param");
    const recipe = await RecipeService.getRecipeById(id);

    if (!recipe) {
      return c.json(
        {
          error: `Recipe with ID ${id} does not exist`,
        },
        404
      );
    }

    return c.json(recipe, 200);
  }
);

router.openapi(
  {
    method: "put",
    path: "/recipes/{id}",
    middleware: [requireAuth],
    request: {
      params: IdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateRecipeSchema,
          },
        },
      },
    },
    responses: {
      200: SuccessResponse(RecipeResponseSchema),
      404: NotFoundResponse,
      400: BadRequestResponse,
      401: UnauthorizedResponse,
    },
    tags: ["Recipes"],
    summary: "Update recipe by ID",
    description: "Update an existing recipe with the provided data",
  },
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const recipe = await RecipeService.updateRecipe(id, data);

    if (!recipe) {
      return c.json(
        {
          error: `Recipe with ID ${id} does not exist`,
        },
        404
      );
    }

    return c.json(recipe, 200);
  }
);

router.openapi(
  {
    method: "delete",
    path: "/recipes/{id}",
    middleware: [requireAuth],
    request: {
      params: IdParamSchema,
    },
    responses: {
      204: NoContentResponse,
      404: NotFoundResponse,
      400: BadRequestResponse,
      401: UnauthorizedResponse,
    },
    tags: ["Recipes"],
    summary: "Delete recipe by ID",
    description: "Delete a specific recipe and all its associated data",
  },
  async (c) => {
    const { id } = c.req.valid("param");
    const deleted = await RecipeService.deleteRecipe(id);

    if (!deleted) {
      return c.json(
        {
          error: `Recipe with ID ${id} does not exist`,
        },
        404
      );
    }

    return c.body(null, 204);
  }
);

router.openapi(
  {
    method: "get",
    path: "/recipes/stats",
    middleware: [requireAdmin],
    responses: {
      200: SuccessResponse(RecipeStatsSchema),
      400: BadRequestResponse,
      401: UnauthorizedResponse,
      403: ForbiddenResponse,
    },
    tags: ["Recipes"],
    summary: "Get recipe statistics",
    description:
      "Retrieve statistics about recipes including total count and counts by status",
  },
  async (c) => {
    const stats = await RecipeService.getRecipeStats();
    return c.json(stats, 200);
  }
);

export default router;
