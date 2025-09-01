import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Home, LayoutDashboard } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
  
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    // Handle case where router context is not available
    navigate = () => {};
  }

  const handleSignOut = async () => {
    await signOut();
    if (navigate) {
      navigate("/");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-md"></div>
            <span className="text-xl font-bold text-foreground">Impact Scout AI</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            {user && (
              <Link to="/app/dashboard" className="text-foreground hover:text-primary transition-colors flex items-center space-x-1">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
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
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="premium" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;