import { useState, useCallback } from "react";
import { ApiKeyInput } from "../components/ApiKeyInput";
import { RecipeSearch } from "../components/RecipeSearch";
import { RecipeCard } from "../components/RecipeCard";
import { useToast } from "@/hooks/use-toast"; // Fixed import path

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchRecipes = useCallback(
    async (query: string, diet: string) => {
      if (!apiKey) {
        toast({
          title: "API Key Missing",
          description: "Please enter an API key to search recipes.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          apiKey,
          query,
          diet: diet || "",
          number: "12",
          addRecipeInformation: "true",
        });

        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?${params}`
        );

        const data = await response.json();

        if (!response.ok || data.results?.length === 0) {
          throw new Error(data.message || "No recipes found.");
        }

        setRecipes(data.results);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, toast]
  );

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-secondary p-6">
        <ApiKeyInput onKeySet={setApiKey} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-6 space-y-8">
      <div className="container mx-auto">
        <RecipeSearch onSearch={searchRecipes} isLoading={isLoading} />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg">
                <div className="bg-gray-200 h-48 rounded-t-lg" />
                <div className="p-4 space-y-2 bg-white rounded-b-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-8">
            No recipes found. Try another search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
