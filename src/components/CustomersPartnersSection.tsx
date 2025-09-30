import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink } from "lucide-react";

interface CustomerPartner {
  name: string;
  type: string;
  notes?: string;
  link_url?: string;
}

interface CustomersPartnersSectionProps {
  customersPartners: CustomerPartner[] | null;
}

export const CustomersPartnersSection = ({ customersPartners }: CustomersPartnersSectionProps) => {
  if (!customersPartners || customersPartners.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customers & Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No customer or partner information available</p>
        </CardContent>
      </Card>
    );
  }

  const getTypeBadgeVariant = (type: string): "default" | "secondary" | "outline" => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("customer")) return "default";
    if (lowerType.includes("partner")) return "secondary";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Customers & Partners
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {customersPartners.map((item, index) => (
          <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{item.name}</h4>
                <Badge variant={getTypeBadgeVariant(item.type)}>{item.type}</Badge>
              </div>
              {item.link_url && (
                <a
                  href={item.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            {item.notes && (
              <p className="text-sm text-muted-foreground">{item.notes}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
