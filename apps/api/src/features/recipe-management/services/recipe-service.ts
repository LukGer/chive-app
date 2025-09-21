import { db } from "@/database/config";
import {
  Ingredient,
  ingredients,
  Instruction,
  instructions,
  NewIngredient,
  NewInstruction,
  NewRecipe,
  NewRecipeTag,
  NewTag,
  Recipe,
  recipes,
  recipeTags,
  Tag,
  tags,
} from "@/database/schema";
import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import {
  CreateRecipeInput,
  CreateUserRecipeInput,
  RecipeListQuery,
  RecipeListResponse,
  RecipeResponse,
  RecipeWithDetails,
  UpdateRecipeInput,
} from "../schemas";

export class RecipeService {
  static async createRecipe(data: CreateRecipeInput): Promise<RecipeResponse> {
    const {
      ingredients: recipeIngredients,
      instructions: recipeInstructions,
      ...recipeData
    } = data;

    return await db.transaction(async (tx) => {
      const newRecipe: NewRecipe = {
        ...recipeData,
        updatedAt: new Date(),
      };

      const [result] = await tx.insert(recipes).values(newRecipe).returning();

      if (!result) {
        throw new Error("Failed to create recipe");
      }

      // Create ingredients
      if (recipeIngredients && recipeIngredients.length > 0) {
        const newIngredients: NewIngredient[] = recipeIngredients.map(
          (ingredient) => ({
            ...ingredient,
            recipeId: result.id,
          })
        );
        await tx.insert(ingredients).values(newIngredients);
      }

      // Create instructions
      if (recipeInstructions && recipeInstructions.length > 0) {
        const newInstructions: NewInstruction[] = recipeInstructions.map(
          (instruction) => ({
            ...instruction,
            recipeId: result.id,
          })
        );
        await tx.insert(instructions).values(newInstructions);
      }

      return this.mapRecipeToResponse(result);
    });
  }

  static async createUserRecipe(
    data: CreateUserRecipeInput
  ): Promise<RecipeResponse> {
    const {
      ingredients: recipeIngredients,
      instructions: recipeInstructions,
      tags: recipeTagNames,
      ...recipeData
    } = data;

    return await db.transaction(async (tx) => {
      const newRecipe: NewRecipe = {
        ...recipeData,
        status: "processed",
        updatedAt: new Date(),
      };

      const [result] = await tx.insert(recipes).values(newRecipe).returning();

      if (!result) {
        throw new Error("Failed to create recipe");
      }

      // Create ingredients
      if (recipeIngredients && recipeIngredients.length > 0) {
        const newIngredients: NewIngredient[] = recipeIngredients.map(
          (ingredient) => ({
            ...ingredient,
            recipeId: result.id,
          })
        );
        await tx.insert(ingredients).values(newIngredients);
      }

      // Create instructions
      if (recipeInstructions && recipeInstructions.length > 0) {
        const newInstructions: NewInstruction[] = recipeInstructions.map(
          (instruction) => ({
            ...instruction,
            recipeId: result.id,
          })
        );
        await tx.insert(instructions).values(newInstructions);
      }

      // Create tags if provided
      if (recipeTagNames && recipeTagNames.length > 0) {
        for (const tagName of recipeTagNames) {
          // Check if tag exists, if not create it
          let [existingTag] = await tx
            .select()
            .from(tags)
            .where(eq(tags.name, tagName))
            .limit(1);

          if (!existingTag) {
            [existingTag] = await tx
              .insert(tags)
              .values({ name: tagName })
              .returning();
          }

          if (existingTag) {
            // Link recipe to tag
            await tx.insert(recipeTags).values({
              recipeId: result.id,
              tagId: existingTag.id,
            });
          }
        }
      }

      return this.mapRecipeToResponse(result);
    });
  }

  static async getRecipeById(id: string): Promise<RecipeWithDetails | null> {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);

    if (!recipe) {
      return null;
    }

    const [recipeIngredients, recipeInstructions, recipeTagsData] =
      await Promise.all([
        db
          .select()
          .from(ingredients)
          .where(eq(ingredients.recipeId, id))
          .orderBy(asc(ingredients.position)),
        db
          .select()
          .from(instructions)
          .where(eq(instructions.recipeId, id))
          .orderBy(asc(instructions.position)),
        db
          .select({
            id: tags.id,
            name: tags.name,
          })
          .from(tags)
          .innerJoin(recipeTags, eq(tags.id, recipeTags.tagId))
          .where(eq(recipeTags.recipeId, id)),
      ]);

    return {
      ...this.mapRecipeToResponse(recipe),
      ingredients: recipeIngredients.map((ing) => ({
        name: ing.name,
        quantity: ing.quantity ?? undefined,
        unit: ing.unit ?? undefined,
        raw: ing.raw ?? undefined,
      })),
      instructions: recipeInstructions.map((inst) => ({
        text: inst.text,
        timerSeconds: inst.timerSeconds ?? undefined,
        mediaUrl: inst.mediaUrl ?? undefined,
      })),
      tags: recipeTagsData,
    };
  }

  static async updateRecipe(
    id: string,
    data: UpdateRecipeInput
  ): Promise<RecipeResponse | null> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const [result] = await db
      .update(recipes)
      .set(updateData)
      .where(eq(recipes.id, id))
      .returning();

    if (!result) {
      return null;
    }

    return this.mapRecipeToResponse(result);
  }

  static async deleteRecipe(id: string): Promise<boolean> {
    const result = await db
      .delete(recipes)
      .where(eq(recipes.id, id))
      .returning();

    return result.length > 0;
  }

  static async listRecipes(
    query: RecipeListQuery
  ): Promise<RecipeListResponse> {
    const { page, limit, search, status, sortBy, sortOrder } = query;
    const offset = (page - 1) * limit;

    const whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(recipes.title, `%${search}%`),
          ilike(recipes.description, `%${search}%`)
        )
      );
    }

    if (status) {
      whereConditions.push(eq(recipes.status, status));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderBy =
      sortOrder === "asc" ? asc(recipes[sortBy]) : desc(recipes[sortBy]);

    const [recipesData, totalCount] = await Promise.all([
      db
        .select()
        .from(recipes)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(recipes)
        .where(whereClause)
        .then((result) => result[0]?.count || 0),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      recipes: recipesData.map((recipe) => this.mapRecipeToResponse(recipe)),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    };
  }

  static async addIngredientToRecipe(
    recipeId: string,
    ingredientData: Omit<NewIngredient, "recipeId" | "createdAt" | "updatedAt">
  ): Promise<Ingredient> {
    const newIngredient: NewIngredient = {
      ...ingredientData,
      recipeId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [result] = await db
      .insert(ingredients)
      .values(newIngredient)
      .returning();

    if (!result) {
      throw new Error("Failed to create ingredient");
    }

    return result;
  }

  static async addInstructionToRecipe(
    recipeId: string,
    instructionData: Omit<
      NewInstruction,
      "recipeId" | "createdAt" | "updatedAt"
    >
  ): Promise<Instruction> {
    const newInstruction: NewInstruction = {
      ...instructionData,
      recipeId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [result] = await db
      .insert(instructions)
      .values(newInstruction)
      .returning();

    if (!result) {
      throw new Error("Failed to create instruction");
    }

    return result;
  }

  static async addTagToRecipe(recipeId: string, tagName: string): Promise<Tag> {
    return await db.transaction(async (tx) => {
      let tag = await tx
        .select()
        .from(tags)
        .where(eq(tags.name, tagName))
        .limit(1)
        .then((result) => result[0]);

      if (!tag) {
        const newTag: NewTag = { name: tagName };
        const [createdTag] = await tx.insert(tags).values(newTag).returning();
        if (!createdTag) {
          throw new Error("Failed to create tag");
        }
        tag = createdTag;
      }

      const newRecipeTag: NewRecipeTag = {
        recipeId,
        tagId: tag.id,
      };

      await tx.insert(recipeTags).values(newRecipeTag).onConflictDoNothing();

      return tag;
    });
  }

  static async removeTagFromRecipe(
    recipeId: string,
    tagId: string
  ): Promise<boolean> {
    const result = await db
      .delete(recipeTags)
      .where(
        and(eq(recipeTags.recipeId, recipeId), eq(recipeTags.tagId, tagId))
      )
      .returning();

    return result.length > 0;
  }

  static async getRecipeStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
  }> {
    const [total, statusStats] = await Promise.all([
      db
        .select({ count: count() })
        .from(recipes)
        .then((result) => result[0]?.count || 0),
      db
        .select({
          status: recipes.status,
          count: count(),
        })
        .from(recipes)
        .groupBy(recipes.status),
    ]);

    const byStatus = statusStats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat.count;
        return acc;
      },
      {} as Record<string, number>
    );

    return { total, byStatus };
  }

  private static mapRecipeToResponse(recipe: Recipe): RecipeResponse {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      prepTimeInMinutes: recipe.prepTimeInMinutes,
      cookTimeInMinutes: recipe.cookTimeInMinutes,
      totalTimeInMinutes: recipe.totalTimeInMinutes,
      imageUrl: recipe.imageUrl,
      sourceUrl: recipe.sourceUrl,
      sourceName: recipe.sourceName,
      status: recipe.status,
      provenance: recipe.provenance as Record<string, any> | null,
      confidence: recipe.confidence,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
    };
  }
}
