import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-7 w-7" />
            <span className="font-bold text-xl">StaxMap</span>
          </Link>
          <nav className="flex items-center space-x-2">
            <Link href="/radar">
              <Button variant="ghost">Go to App <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative isolate pt-14">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#8085ff] to-[#4c00ff] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>

          <div className="py-24 sm:py-32">
            <div className="container mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-white/20 hover:ring-white/30">
                  Power up with Agent Mode
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl max-w-3xl mx-auto">
                AI accelerates your development
              </h1>
              
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg">Start free trial</Button>
                <Button size="lg" variant="secondary">Check plans and prices</Button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Already have Visual Studio Code? <Link href="#" className="text-primary-foreground underline">Open now</Link>
              </p>
            </div>
          </div>

          <div className="container relative -mt-16">
            <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:p-4">
                <div className="relative w-full h-auto rounded-lg shadow-2xl bg-[#1e1e1e] ring-1 ring-white/10">
                    <div className="absolute -top-16 -right-16 z-20">
                      <Image 
                        src="https://placehold.co/150x150.png"
                        alt="AI Agent Mascot"
                        width={150}
                        height={150}
                        className="opacity-80"
                        data-ai-hint="glowing robot mascot"
                      />
                    </div>
                    <Image
                      src="https://placehold.co/1200x650.png"
                      alt="App screenshot"
                      width={2432}
                      height={1442}
                      className="rounded-md opacity-80"
                      data-ai-hint="dark code editor"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg"></div>
                </div>
            </div>
          </div>
          
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#8085ff] to-[#4c00ff] opacity-40 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 mt-32">
        <div className="container flex items-center justify-between py-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StaxMap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
