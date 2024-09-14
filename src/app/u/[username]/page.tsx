'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.trim().split(specialChar).filter(Boolean);
};

const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    const [isLoading, setIsLoading] = useState(false);
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>(parseStringMessages(initialMessageString));
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [suggestError, setSuggestError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch('content');

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            });

            toast({
                title: response.data.message,
                variant: 'default',
            });
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Failed',
                description: axiosError.response?.data.message ?? 'Failed to send message',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestedMessages = async () => {
        setIsSuggestLoading(true);
        setSuggestedMessages([]);
        setSuggestError(null);

        try {
            const response = await axios.post('/api/suggest-messages');
            const messageString = response.data.message; // Assuming the response is directly a string
            setSuggestedMessages(parseStringMessages(messageString));
        } catch (error) {
            console.error('Error fetching messages:', error);
            setSuggestError('Failed to fetch suggested messages.');
        } finally {
            setIsSuggestLoading(false);
        }
    };

    return (
        <div className="container mx-auto my-8 p-8 bg-gray-300 rounded-lg shadow-lg max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Public Profile Link</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-semibold text-gray-700">
                                    Send Anonymous Message to @{username}
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here..."
                                        className="resize-none border border-gray-300 rounded-md p-3 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled className="flex items-center">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin text-gray-500" />
                                Please wait
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isLoading || !messageContent}
                                className="bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="space-y-6 my-8">
                <div className="text-center">
                    <Button
                        onClick={fetchSuggestedMessages}
                        className={`bg-green-500 text-white hover:bg-green-600 ${isSuggestLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSuggestLoading}
                    >
                        Suggest Messages
                    </Button>
                    <p className="mt-2 text-gray-600">Click on any message below to select it.</p>
                </div>
                <Card className="shadow-sm border border-gray-200 rounded-lg">
                    <CardHeader>
                        <h3 className="text-xl font-semibold text-gray-800">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4 p-4">
                        {suggestError ? (
                            <p className="text-red-500 font-medium">{suggestError}</p>
                        ) : (
                            suggestedMessages.length > 0 ? (
                                suggestedMessages.map((message, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="border border-gray-300 text-gray-800 hover:bg-gray-100"
                                        onClick={() => handleMessageClick(message)}
                                    >
                                        {message}
                                    </Button>
                                ))
                            ) : (
                                <p className="text-gray-600">No suggestions available.</p>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4 text-gray-700">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button className="bg-blue-500 text-white hover:bg-blue-600">Create Your Account</Button>
                </Link>
            </div>
        </div>
    );
}
