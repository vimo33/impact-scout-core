import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Linkedin, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Contact {
  name: string;
  title: string;
  email: string;
  linkedin: string;
}

interface ContactsSectionProps {
  contacts: Contact[] | null;
}

export const ContactsSection = ({ contacts }: ContactsSectionProps) => {
  if (!contacts || contacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No contact information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-semibold">{contact.name}</h4>
              <p className="text-sm text-muted-foreground">{contact.title}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {contact.email && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </Button>
              )}
              {contact.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={contact.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
