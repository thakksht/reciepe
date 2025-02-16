import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { RecipeSearch } from "@/components/RecipeSearch";
import { RecipeCard } from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchRecipes = useCallback(async (query: string, diet: string) => {
    if (!apiKey) return;

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
      
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data.results);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch recipes. Please try again.",
        variant: "destructive",
      });
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, toast]);

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
        <div className="flex justify-between items-center mb-8">
          <RecipeSearch onSearch={searchRecipes} isLoading={isLoading} />
          <Link to="/favorites">
            <Button variant="outline" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              My Favorites
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg" />
                <div className="p-4 space-y-2 bg-white rounded-b-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;