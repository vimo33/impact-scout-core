const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-md"></div>
              <span className="text-xl font-bold text-foreground">Impact Scout AI</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Empowering Swiss family offices with sophisticated AI-driven research and investment intelligence.
            </p>
            <div className="text-sm text-muted-foreground">
              © 2024 Impact Scout AI. All rights reserved.
            </div>
          </div>
          
          {/* Platform */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Research Intelligence</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Market Analysis</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Risk Assessment</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Portfolio Insights</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Security</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              Regulated by FINMA • Swiss Financial Market Supervisory Authority
            </div>
            <div className="text-sm text-muted-foreground">
              Zurich, Switzerland
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;