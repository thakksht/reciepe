import { useState, useEffect } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Heart, PlusCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const storedCustomRecipes = JSON.parse(localStorage.getItem("custom_recipes") || "[]");
    setFavorites(storedFavorites);
    setCustomRecipes(storedCustomRecipes);
  }, []);

  const EmptyState = ({ type }: { type: "favorites" | "custom" }) => (
    <div className="text-center py-12">
      {type === "favorites" ? (
        <>
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-4">
            Start adding recipes to your favorites collection!
          </p>
          <Link to="/">
            <Button variant="outline">Browse Recipes</Button>
          </Link>
        </>
      ) : (
        <>
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No saved recipes yet</h2>
          <p className="text-muted-foreground mb-4">
            Start creating your own recipes!
          </p>
          <Link to="/new-recipe">
            <Button variant="outline">Create Recipe</Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary p-6 space-y-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              My Recipe Collection
            </h1>
            <p className="text-muted-foreground">
              Your personally curated collection of favorite and custom recipes
            </p>
          </div>
          <Link to="/new-recipe">
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Recipe
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Recipes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="space-y-6">
            {favorites.length === 0 ? (
              <EmptyState type="favorites" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            {customRecipes.length === 0 ? (
              <EmptyState type="custom" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Favorites;