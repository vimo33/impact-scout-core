import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface CategoryCompletenessWidgetProps {
  categoryCompleteness: Record<string, number> | null;
}

export const CategoryCompletenessWidget = ({ categoryCompleteness }: CategoryCompletenessWidgetProps) => {
  if (!categoryCompleteness || Object.keys(categoryCompleteness).length === 0) {
    return null;
  }

  const getColorClass = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="w-4 h-4" />
          Data Completeness by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(categoryCompleteness).map(([category, percentage]) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{category.replace(/_/g, ' ')}</span>
              <span className={`font-semibold ${getColorClass(percentage)}`}>
                {percentage}%
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
