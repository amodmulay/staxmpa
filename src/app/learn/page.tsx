
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Learn About Technology Radars - StaxMap',
  description: 'A deep dive into the principles of a Technology Radar. Understand its structure (regions, blips), how to use it for strategic planning, and its benefits for aligning teams.',
  keywords: 'what is a technology radar, tech radar explained, thoughtworks radar, adopt, trial, assess, hold, strategic planning',
};

export default function LearnPage() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gradient sm:text-5xl">
          Understanding the Technology Radar
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          A guide to visualizing your technology portfolio and making informed strategic decisions.
        </p>
      </header>

      <article>
        <section>
          <h2>What is a Technology Radar?</h2>
          <p>
            A Technology Radar is a visual tool that helps organizations assess and manage their technology portfolio. Originally popularized by ThoughtWorks, it provides a snapshot of a company's technology landscape, from languages and frameworks to tools and platforms. Its purpose is to encourage thoughtful discussion and strategic decision-making about which technologies to invest in, which to maintain, and which to retire.
          </p>
          <p>
            Unlike a simple list, a radar organizes items by their adoption readiness, offering a forward-looking perspective on your tech stack. It's not about what's "hot" in the industry, but what's right for <strong>your</strong> organization's context and goals.
          </p>
        </section>

        <Card className="my-10 bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="text-primary" />
              Core Concept
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-xl font-medium border-l-4 border-primary pl-4">
              The Radar is a document that sets out the changes that we think are currently interesting in software development—things in motion that we think you should pay attention to and consider using in your projects.
              <footer className="text-sm text-muted-foreground mt-2">— ThoughtWorks Technology Radar</footer>
            </blockquote>
          </CardContent>
        </Card>

        <section>
          <h2>The Structure of the Radar: Regions</h2>
          <p>
            The radar is divided into several concentric rings, or "regions." These regions represent the stages of the adoption lifecycle for a technology within your organization. StaxMap uses a flexible, ring-based model. While the names can be customized, they typically follow these concepts:
          </p>
          <ul>
            <li>
              <strong>Adopt (or Today):</strong> Technologies in this ring are proven and trusted for your organization. They are the standard choice for new projects and have strong internal support, clear best practices, and established champions. You should be using these.
            </li>
            <li>
              <strong>Trial (or Tomorrow):</strong> These are promising technologies that have shown potential in a proof-of-concept or on a limited-scope project. They are ready for wider, but still controlled, adoption on projects that can handle some risk. The goal is to validate their value and establish best practices.
            </li>
            <li>
              <strong>Assess (or Recent Future):</strong> This ring is for technologies that are interesting and worth exploring. Teams should be actively "assessing" these items by building small proofs-of-concept or conducting research to understand their potential impact. They are not yet ready for production use.
            </li>
            <li>
              <strong>Hold (or Distant Future):</strong> Technologies in this ring are no longer recommended for new development. They might be legacy systems being phased out, technologies that have proven to be a poor fit, or items that have been superseded by better alternatives. The recommendation is to "hold" off on new investment and plan for migration where necessary.
            </li>
          </ul>
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
          <ul>
              <li><strong>Strategic Alignment:</strong> Provides a shared vision for technology adoption across different teams.</li>
              <li><strong>Risk Management:</strong> Helps identify and manage risks associated with new, unproven technologies and legacy systems.</li>
              <li><strong>Knowledge Sharing:</strong> Encourages sharing of experiences and best practices across the organization.</li>
              <li><strong>Fosters Innovation:</strong> Creates a structured process for exploring and adopting new technologies.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
