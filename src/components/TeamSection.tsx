import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  linkedin_url?: string;
}

interface TeamSectionProps {
  team: TeamMember[] | null;
}

export const TeamSection = ({ team }: TeamSectionProps) => {
  if (!team || team.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No team information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="w-5 h-5" />
          Team
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {team.map((member, index) => (
          <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
