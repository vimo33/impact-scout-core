import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface NewsItem {
  headline: string;
  date: string;
  source: string;
  url: string;
}

interface NewsSentimentSectionProps {
  newsSentiment: {
    recent_news: NewsItem[];
    market_sentiment: string | null;
  } | null;
}

export const NewsSentimentSection = ({ newsSentiment }: NewsSentimentSectionProps) => {
  const hasNews = newsSentiment?.recent_news && newsSentiment.recent_news.length > 0;
  const sentiment = newsSentiment?.market_sentiment;

  const getSentimentIcon = () => {
    if (!sentiment) return <Minus className="w-4 h-4" />;
    const lower = sentiment.toLowerCase();
    if (lower.includes("positive")) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (lower.includes("negative")) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-yellow-600" />;
  };

  const getSentimentVariant = () => {
    if (!sentiment) return "outline";
    const lower = sentiment.toLowerCase();
    if (lower.includes("positive")) return "default";
    if (lower.includes("negative")) return "destructive";
    return "secondary";
  };

  if (!hasNews && !sentiment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            News & Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No news or sentiment data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            News & Sentiment
          </div>
          {sentiment && (
            <Badge variant={getSentimentVariant()} className="flex items-center gap-1">
              {getSentimentIcon()}
              {sentiment}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasNews ? (
          newsSentiment!.recent_news.map((news, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-2">
              <h4 className="font-semibold text-sm">{news.headline}</h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{news.source}</span>
                <span>{new Date(news.date).toLocaleDateString()}</span>
              </div>
              {news.url && (
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Read more <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No recent news available</p>
        )}
      </CardContent>
    </Card>
  );
};
