'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import MessagesList from '@/messages.json'; // Ensure your messages JSON is properly structured

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Define the Message interface
interface Message {
  _id: string;
  title: string;
  content: string;
  received: string;
}

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [altTextIndex, setAltTextIndex] = useState(0); // Index for alternating text

  // Updated alternating texts
  const alternatingTexts = [
    'Dive into the Realm of Anonymous Feedback',
    'True Feedback - Where your identity remains a secret.',
    'Share your thoughts freely without the fear of exposure.',
    'Your opinions matter, and your privacy is our priority.',
    'Anonymous feedback that leads to genuine improvement.',
  ];

  useEffect(() => {
    // Simulate a data fetching delay
    setTimeout(() => {
      setMessages(MessagesList);
      setLoading(false);
    }, 1000); // Adjust the timeout duration as needed

    // Alternate the text every 3 seconds
    const textInterval = setInterval(() => {
      setAltTextIndex((prev) => (prev + 1) % alternatingTexts.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(textInterval);
  }, []);

  return (
    <>

      <main className="flex-grow flex flex-col items-center justify-center px-2 md:px-8  pt-[7.5rem]  text-white pb-5">
        {/* Alternating Section */}
        <section className="text-center mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight transition-all duration-1000 ease-in-out">
            {alternatingTexts[altTextIndex]}
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            {altTextIndex === 0 || altTextIndex === 1
              ? 'True Feedback - Where your identity remains a secret.'
              : altTextIndex === 2
                ? 'Share your thoughts freely without the fear of exposure.'
                : altTextIndex === 3
                  ? 'Your opinions matter, and your privacy is our priority.'
                  : 'Anonymous feedback that leads to genuine improvement.'}
          </p>
        </section>

        {/* Carousel with animations */}
        <Carousel plugins={[Autoplay({ delay: 3000 })]} className="w-full max-w-lg md:max-w-2xl">
          <CarouselContent>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="p-4 flex justify-center animate-fade-in">
                  <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : (
              messages.map((message) => (
                <CarouselItem key={message._id} className="p-4 animate-slide-in">
                  <Card className="bg-[#1F2937] text-white shadow-lg transition-transform transform hover:scale-105">
                    <CardHeader className="bg-[#374151]">
                      <CardTitle className="text-xl font-semibold">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4 p-4">
                      <Mail className="text-blue-400 h-8 w-8 flex-shrink-0" />
                      <div>
                        <p className="text-gray-300">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{message.received}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious>
            <Button variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">Previous</Button>
          </CarouselPrevious>
          <CarouselNext>
            <Button variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">Next</Button>
          </CarouselNext>
        </Carousel>


      </main>
      <footer className="fixed bottom-0 left-0 right-0 pb-4 ml-[-28px] flex justify-center content-center  bg-transparent text-black  flex justify-center md:bg-opacity-80">

        <span className="text-center text-sm  md:text-base">
          © 2024 ConfessIt. All rights reserved.
        </span>

      </footer>
    </>


  );
}
