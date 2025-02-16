import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/hooks/use-toast";

import { ArrowLeft } from "lucide-react";

const NewRecipe = () => {

  const navigate = useNavigate();

  const { toast } = useToast();

  const [recipe, setRecipe] = useState({

    title: "",

    image: "",

    readyInMinutes: "",

    servings: "",

    instructions: "",

    ingredients: "",

  });

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    

    const newRecipe = {

      ...recipe,

      id: Date.now(),

      readyInMinutes: parseInt(recipe.readyInMinutes),

      servings: parseInt(recipe.servings),

    };

    // Save to localStorage

    const customRecipes = JSON.parse(localStorage.getItem("custom_recipes") || "[]");

    localStorage.setItem("custom_recipes", JSON.stringify([...customRecipes, newRecipe]));

    toast({

      title: "Recipe created",

      description: "Your recipe has been saved successfully",

    });

    navigate("/favorites");

  };

  return (

    <div className="min-h-screen bg-secondary p-6">

      <div className="container mx-auto max-w-2xl">

        <Button

          variant="ghost"

          className="mb-6"

          onClick={() => navigate(-1)}

        >

          <ArrowLeft className="h-4 w-4 mr-2" />

          Back

        </Button>

        <div className="space-y-6">

          <div>

            <h1 className="text-3xl font-bold tracking-tight">Create New Recipe</h1>

            <p className="text-muted-foreground">

              Add your personal recipe to your collection

            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-4">

              <div>

                <label htmlFor="title" className="block text-sm font-medium mb-1">

                  Recipe Title

                </label>

                <Input

                  id="title"

                  required

                  value={recipe.title}

                  onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}

                  placeholder="Enter recipe title"

                />

              </div>

              <div>

                <label htmlFor="image" className="block text-sm font-medium mb-1">

                  Image URL

                </label>

                <Input

                  id="image"

                  type="url"

                  required

                  value={recipe.image}

                  onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}

                  placeholder="Enter image URL"

                />

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label htmlFor="time" className="block text-sm font-medium mb-1">

                    Cooking Time (minutes)

                  </label>

                  <Input

                    id="time"

                    type="number"

                    required

                    min="1"

                    value={recipe.readyInMinutes}

                    onChange={(e) => setRecipe({ ...recipe, readyInMinutes: e.target.value })}

                    placeholder="Enter cooking time"

                  />

                </div>

                <div>

                  <label htmlFor="servings" className="block text-sm font-medium mb-1">

                    Servings

                  </label>

                  <Input

                    id="servings"

                    type="number"

                    required

                    min="1"

                    value={recipe.servings}

                    onChange={(e) => setRecipe({ ...recipe, servings: e.target.value })}

                    placeholder="Enter servings"

                  />

                </div>

              </div>

              <div>

                <label htmlFor="ingredients" className="block text-sm font-medium mb-1">

                  Ingredients

                </label>

                <Textarea

                  id="ingredients"

                  required

                  value={recipe.ingredients}

                  onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value })}

                  placeholder="Enter ingredients (one per line)"

                  className="min-h-[100px]"

                />

              </div>

              <div>

                <label htmlFor="instructions" className="block text-sm font-medium mb-1">

                  Instructions

                </label>

                <Textarea

                  id="instructions"

                  required

                  value={recipe.instructions}

                  onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}

                  placeholder="Enter cooking instructions"

                  className="min-h-[200px]"

                />

              </div>

            </div>

            <Button type="submit" className="w-full">

              Create Recipe

            </Button>

          </form>

        </div>

      </div>

    </div>

  );

};

export default NewRecipe;