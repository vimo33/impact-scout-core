import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface ProductSolution {
  name: string;
  description: string;
}

interface ProductsSolutionsSectionProps {
  products: ProductSolution[] | null;
}

export const ProductsSolutionsSection = ({ products }: ProductsSolutionsSectionProps) => {
  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Products & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No product information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Products & Solutions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
            <h4 className="font-semibold mb-2">{product.name}</h4>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
