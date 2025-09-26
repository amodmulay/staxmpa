
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Learn About Technology Radars - StaxMap',
  description: 'A deep dive into the principles of a Technology Radar. Understand its structure (regions, blips), how to use it for strategic planning, and its benefits for aligning teams.',
  keywords: 'what is a technology radar, tech radar explained, thoughtworks radar, adopt, trial, assess, hold, strategic planning',
};

const RadarStructureIllustration = () => (
    <div className="relative flex justify-center items-center p-4 my-8">
        <div className="absolute w-72 h-72 rounded-full bg-primary/5 border border-primary/10"></div>
        <div className="absolute w-52 h-52 rounded-full bg-primary/5 border border-primary/10"></div>
        <div className="absolute w-32 h-32 rounded-full bg-primary/5 border-primary/10"></div>

        <div className="relative text-center space-y-2">
            <div className="font-bold text-primary text-sm">Adopt</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48">
                 <div className="font-bold text-primary/80 text-sm">Trial</div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64">
                 <div className="font-bold text-primary/60 text-sm">Assess</div>
            </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80">
                 <div className="font-bold text-primary/40 text-sm">Hold</div>
            </div>
        </div>
    </div>
);

const HeroIllustration = () => (
    <div className="flex justify-center items-center py-8">
        <svg width="250" height="200" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M52 232.5H248C252.142 232.5 255.5 229.142 255.5 225V15H44.5V225C44.5 229.142 47.8579 232.5 52 232.5Z" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="3"/>
            <rect x="62.5" y="32.5" width="175" height="15" rx="3" fill="hsl(var(--background))" stroke="hsl(var(--border))"/>
            <rect x="62.5" y="62.5" width="175" height="40" rx="3" fill="hsl(var(--background))" stroke="hsl(var(--border))"/>
            <rect x="62.5" y="118.5" width="80" height="15" rx="3" fill="hsl(var(--background))" stroke="hsl(var(--border))"/>
            <rect x="158.5" y="118.5" width="80" height="15" rx="3" fill="hsl(var(--background))" stroke="hsl(var(--border))"/>
            <circle cx="120.5" cy="180.5" r="24" fill="hsl(var(--primary))" fillOpacity="0.1" stroke="hsl(var(--primary))" strokeWidth="2"/>
            <circle cx="180.5" cy="180.5" r="24" fill="hsl(var(--primary))" fillOpacity="0.1" stroke="hsl(var(--primary))" strokeWidth="2"/>
            <path d="M149 181L151 183L153.5 178" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);


export default function LearnPage() {
  return (
    <div className="bg-background">
      <header className="text-center pt-16 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient sm:text-5xl lg:text-6xl">
            Understanding the Technology Radar
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
            A guide to visualizing your technology portfolio and making informed strategic decisions.
          </p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 max-w-4xl pb-24">
        <HeroIllustration />
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <section>
            <h2>What is a Technology Radar?</h2>
            <p>
              A Technology Radar is a visual tool that helps organizations assess and manage their technology portfolio. Originally popularized by ThoughtWorks, it provides a snapshot of a company's technology landscape, from languages and frameworks to tools and platforms. Its purpose is to encourage thoughtful discussion and strategic decision-making about which technologies to invest in, which to maintain, and which to retire.
            </p>
            <p>
              Unlike a simple list, a radar organizes items by their adoption readiness, offering a forward-looking perspective on your tech stack. It's not about what's "hot" in the industry, but what's right for <strong>your</strong> organization's context and goals.
            </p>
          </section>

          <Card className="my-12 bg-card border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="text-primary h-6 w-6" />
                <span>Core Concept</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-xl font-medium border-l-4 border-primary pl-6 m-0">
                The Radar is a document that sets out the changes that we think are currently interesting in software development—things in motion that we think you should pay attention to and consider using in your projects.
                <footer className="text-sm text-muted-foreground mt-4">— ThoughtWorks Technology Radar</footer>
              </blockquote>
            </CardContent>
          </Card>

          <section>
            <h2>The Structure of the Radar: Regions</h2>
            <p>
              The radar is divided into several concentric rings, or "regions." These regions represent the stages of the adoption lifecycle for a technology within your organization. StaxMap uses a flexible, ring-based model. While the names can be customized, they typically follow these concepts:
            </p>
            
            <RadarStructureIllustration />

            <div className="grid md:grid-cols-2 gap-6 my-8">
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Adopt (or Today)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base">Technologies in this ring are proven and trusted. They are the standard choice for new projects and have strong internal support. You should be using these.</p>
                    </CardContent>
                </Card>
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Trial (or Tomorrow)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base">Promising technologies that have shown potential. They are ready for wider, but still controlled, adoption on projects that can handle some risk.</p>
                    </CardContent>
                </Card>
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Assess (or Recent Future)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base">Interesting technologies worth exploring. Teams should be actively building proofs-of-concept to understand their potential impact. Not yet ready for production.</p>
                    </CardContent>
                </Card>
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Hold (or Distant Future)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base">Items that are no longer recommended for new development. This could be due to being superseded or being a poor fit. Plan for migration.</p>
                    </CardContent>
                </Card>
            </div>
            
            <p>
              The movement of "blips" (the individual technology items) from the outer rings to the inner rings over time shows the progression of innovation and adoption within your organization.
            </p>
          </section>

          <section>
            <h2>How to Use a Technology Radar</h2>
            <p>
              Creating a radar is a collaborative process, not a top-down decree. It's most effective when it reflects the collective intelligence of your development teams.
            </p>
            <ol>
              <li>
                <strong>Gather Candidates:</strong> Collect technology "blips" from across your teams. What tools are people using? What new frameworks are they excited about? What legacy systems are causing pain?
              </li>
              <li>
                <strong>Facilitate Discussion:</strong> The most valuable part of the process is the conversation. A group of senior technologists should facilitate a meeting to discuss each candidate blip and decide where it belongs on the radar. Why should this be in Trial and not Assess? What are the risks? Who will champion it?
              </li>
              <li>
                <strong>Publish and Share:</strong> Once created, the radar should be published and made accessible to everyone in the technology organization. It serves as a guide for developers, a communication tool for management, and a point of alignment for architects.
              </li>
              <li>
                <strong>Iterate:</strong> A radar is a living document. It should be revisited and updated regularly (e.g., every 6-12 months) to reflect changes in the technology landscape and the organization's experience.
              </li>
            </ol>
          </section>
          
          <section>
            <h2>Benefits of Using a Radar</h2>
             <ul className="space-y-4 !p-0">
                <li className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-lg">Strategic Alignment</h4>
                        <p className="!mt-1 text-muted-foreground">Provides a shared vision for technology adoption across different teams.</p>
                    </div>
                </li>
                <li className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-lg">Risk Management</h4>
                        <p className="!mt-1 text-muted-foreground">Helps identify and manage risks associated with new, unproven technologies and legacy systems.</p>
                    </div>
                </li>
                <li className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-lg">Knowledge Sharing</h4>
                        <p className="!mt-1 text-muted-foreground">Encourages sharing of experiences and best practices across the organization.</p>
                    </div>
                </li>
                <li className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-lg">Fosters Innovation</h4>
                        <p className="!mt-1 text-muted-foreground">Creates a structured process for exploring and adopting new technologies.</p>
                    </div>
                </li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
