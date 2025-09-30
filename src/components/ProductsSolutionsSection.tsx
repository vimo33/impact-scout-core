import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ExternalLink } from "lucide-react";

interface ProductSolution {
  name: string;
  description: string;
  type?: string;
  status?: string;
  link_url?: string;
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
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold">{product.name}</h4>
                {product.type && <Badge variant="secondary">{product.type}</Badge>}
                {product.status && <Badge variant="outline">{product.status}</Badge>}
              </div>
              {product.link_url && (
                <a
                  href={product.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
