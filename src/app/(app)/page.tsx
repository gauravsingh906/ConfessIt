'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import MessagesList from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';

interface Message {
  _id: string;
  title: string;
  content: string;
  received: string;
}

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Simulate a data fetching delay
    setTimeout(() => {
      setMessages(MessagesList);
      setLoading(false);
    }, 1000); // Adjust the timeout duration as needed
  }, []);

  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col  items-center justify-center px-4 md:px-8 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-lg md:max-w-2xl"
        >
          <CarouselContent>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="p-4 flex justify-center">
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
                <CarouselItem key={message._id} className="p-4">
                  <Card className="bg-gray-800 text-white shadow-lg">
                    <CardHeader className="bg-gray-700">
                      <CardTitle className="text-xl font-semibold">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4 p-4">
                      <Mail className="text-blue-400 h-8 w-8 flex-shrink-0" />
                      <div>
                        <p className="text-gray-300">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.received}
                        </p>
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

      {/* Footer */}
      <footer className="text-center p-4 bg-gray-700 text-white">
        © 2024 Anonymous Feedback. All rights reserved.
      </footer>
    </>
  );
}
