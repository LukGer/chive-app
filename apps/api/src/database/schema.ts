import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const recipeStatusEnum = pgEnum("recipe_status", [
  "pending",
  "processing",
  "processed",
  "failed",
]);

// --- Tables ---
export const recipes = pgTable("recipes", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  servings: integer("servings"),
  prepTimeInMinutes: integer("prep_time_in_minutes"), // minutes
  cookTimeInMinutes: integer("cook_time_in_minutes"),
  totalTimeInMinutes: integer("total_time_in_minutes"),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
  sourceName: text("source_name"), // e.g. Cookiedoo, Instagram, etc.
  status: recipeStatusEnum("status").default("processed").notNull(),
  provenance: jsonb("provenance_json"), // stores raw extraction metadata
  confidence: real("confidence"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const ingredients = pgTable("ingredients", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  position: integer("position").notNull(),
  name: text("name").notNull(),
  quantity: real("quantity"),
  unit: text("unit"),
  raw: text("raw"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const instructions = pgTable("instructions", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  position: integer("position").notNull(),
  text: text("text").notNull(),
  timerSeconds: integer("timer_seconds"),
  mediaUrl: text("media_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
});

export const recipeTags = pgTable(
  "recipe_tags",
  {
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.tagId] })]
);

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const recipeCollections = pgTable(
  "recipe_collections",
  {
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    collectionId: uuid("collection_id")
      .references(() => collections.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.collectionId] })]
);

export const shoppingListItems = pgTable("shopping_list_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipeId: uuid("recipe_id").references(() => recipes.id, {
    onDelete: "set null",
  }),
  ingredientId: uuid("ingredient_id").references(() => ingredients.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  quantity: real("quantity"),
  unit: text("unit"),
  checked: integer("checked").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const recipesRelations = relations(recipes, ({ many }) => ({
  ingredients: many(ingredients),
  instructions: many(instructions),
  tags: many(recipeTags),
  collections: many(recipeCollections),
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [ingredients.recipeId],
    references: [recipes.id],
  }),
}));

export const instructionsRelations = relations(instructions, ({ one }) => ({
  recipe: one(recipes, {
    fields: [instructions.recipeId],
    references: [recipes.id],
  }),
}));

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;

export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;

export type Instruction = typeof instructions.$inferSelect;
export type NewInstruction = typeof instructions.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type RecipeTag = typeof recipeTags.$inferSelect;
export type NewRecipeTag = typeof recipeTags.$inferInsert;

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export type RecipeCollection = typeof recipeCollections.$inferSelect;
export type NewRecipeCollection = typeof recipeCollections.$inferInsert;

export type ShoppingListItem = typeof shoppingListItems.$inferSelect;
export type NewShoppingListItem = typeof shoppingListItems.$inferInsert;
