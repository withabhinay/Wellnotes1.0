import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,} from '@/components/ui/dialog'
import  LoginPage  from './LoginPage'
import { useNavigate } from 'react-router-dom'

const LoginPageHere = () => {
     const navigate = useNavigate()
      
    const handleOctoSignIn = () => {
          navigate('/login')
        }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Login to Wellnotes</h2>
      <Button onClick={handleOctoSignIn} className="w-full mb-4">
        Sign in with Octo
      </Button>
      <p>Additional login options go here</p>
    </div>
  )
}

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="container mx-auto flex items-center justify-between py-2">
        <img src="./../../public/logo.svg" alt="Wellnotes Logo" width={150} height={50} />
        <nav className="space-x-4">
          <a href="#features">Features</a>
          <a href="#contact">Contact Us</a>
          <a href="#faq">FAQs</a>
        </nav>
        <Button onClick={() => setIsModalOpen(true)}>Launch App</Button>
      </header>

      <main>
        <section className="container mx-auto text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Get Paid to Build Your Productive Wellbeing with Wellnotes</h1>
          <p className="mb-8">Write, journal, and compete with friends while building social accountability + earning rewards</p>
          <img src="../../public/dashboard.svg" alt="Wellnotes App Interface" width={800} height={600} className="mx-auto" />
        </section>

        <section className="container mx-auto py-20">
          <h2 className="text-3xl font-bold text-center mb-10">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <img src="../../public/1st-feature.png"  alt="Journal Interface" width={400} height={300} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Journal Your Thoughts -&gt; Better Clarity -&gt; More Productive</h3>
              <p>Simply type down your thoughts, and you'll feel more at ease, and feel refreshed. Also all the journals will be kept private initially, and made public only with your consent!</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto py-20 item-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className='mx-auto'>
              <h3 className="text-2xl font-bold  mb-4">Get rewarded with points, and simply Cash out into Real $$</h3>
              <p>Get rewarded with points, and simply Cash out into Real $$</p>
            </div>
            <div className='mx-auto '>
              <img src="../../public/secondFeature.svg" alt="Journal Interface" width={400} height={300} />
            </div>           
          </div>
        </section>

        <section className="container mx-auto py-20">
          <h2 className="text-3xl font-bold text-center mb-10">Join or Create Groups to be more accountable towards your productivity</h2>
          <p className="text-center mb-8">Pool in some tokens for joining, and if you build more consistency in journaling than others, get the respective pre-defined prize pool.</p>
          <img src="../../public/thirdFeature.svg" alt="Groups Interface" width={800} height={400} className="mx-auto" />
        </section>

        <section id="faq" className="container mx-auto py-20">
          <h2 className="text-3xl font-bold text-center mb-10">FAQs</h2>
          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the purpose of Groups?</AccordionTrigger>
              <AccordionContent>
                Groups are designed to help users stay motivated by journaling and working towards their goals together. Being part of a group fosters accountability and provides a supportive community to share progress and challenges.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How are group scores tracked?</AccordionTrigger>
              <AccordionContent>
                Each group has a defined number of days for the journaling challenge. You can see how many days each member has successfully journaled out of the total challenge duration.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What happens if I miss a day of journaling?</AccordionTrigger>
              <AccordionContent>
                Missing a day of journaling can affect your score within the group, but you can continue participating. Consistency earns you more points and increases your chances of being ranked higher on the leaderboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How can I win in the group?</AccordionTrigger>
              <AccordionContent>
                To win in a group, you need to stay consistent with your journaling and complete as many journal entries as possible within the group's challenge duration. Each day you successfully journal increases your score. The more consistent you are compared to other group members, the higher your rank on the leaderboard. Winners are typically determined based on total entries and streaks. Top performers may win a share of the pooled tokens or other rewards.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <footer className="container mx-auto py-10 border-t border-gray-800">
        <div className="flex justify-between">
          <div>
            <img src="../../public/logo.svg" alt="Wellnotes Logo" width={120} height={40} />
            <p className="mt-2">It's time to incentivise your thoughts and build productive wellbeing.</p>
            <p>&copy; 2024 - All rights reserved</p>
          </div>
          <div className="flex space-x-20">
            <div>
              <h3 className="font-bold mb-2">LINKS</h3>
              <ul className="space-y-1">
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Leaderboard</a></li>
                <li><a href="#">Whitepaper</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">LEGAL</h3>
              <ul className="space-y-1">
                <li><a href="#">Terms of services</a></li>
                <li><a href="#">Privacy policy</a></li>
                <li><a href="#">Licenses</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-black/50 backdrop-blur-md border border-white/10 text-white">
        <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <LoginPageHere />
        </DialogContent>
      </Dialog>
    </div>
  )
}