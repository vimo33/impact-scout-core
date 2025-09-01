import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-md"></div>
            <span className="text-xl font-bold text-foreground">Impact Scout AI</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <a href="#insights" className="text-muted-foreground hover:text-foreground transition-smooth">
              Insights
            </a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-smooth">
              Security
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Contact
            </Button>
            <Button variant="premium" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;