'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/user.model';
import { acceptMessageSchema } from '@/schemas/acceptMessagesSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

function UserDashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { toast } = useToast();

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessage);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
                variant: 'destructive',
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            setIsSwitchLoading(false);
            try {
                const response = await axios.get<ApiResponse>('/api/get-messages');
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast({
                        title: 'Messages Updated',
                        description: 'Displaying the latest messages.',
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: 'Error',
                    description: axiosError.response?.data.message ?? 'Failed to fetch messages',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
                setIsSwitchLoading(false);
            }
        },
        [setIsLoading, setMessages, toast]
    );

    // Fetch initial state from the server
    useEffect(() => {
        if (!session || !session.user) return;
        fetchAcceptMessages();
    }, [session, setValue, toast, fetchAcceptMessages]);

    // Handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast({
                title: response.data.message,
                variant: 'default',
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Failed to update message settings',
                variant: 'destructive',
            });
        }
    };

    if (!session || !session.user) {
        return <div></div>;
    }

    const { username } = session.user as User;

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'URL Copied!',
            description: 'Your unique profile link has been copied.',
        });
    };

    return (
        <div className="my-8 mt-[5.5rem] mx-1 md:mx-8 lg:mx-auto p-6  rounded-lg shadow-lg w-full max-w-6xl transition-transform transform hover:scale-105 duration-300">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Your Dashboard</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Share Your Unique Profile Link</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="border border-gray-300 rounded-md p-3 w-full bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                    <Button onClick={copyToClipboard} className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                        Copy Link
                    </Button>
                </div>
            </div>

            <div className="mb-6 flex items-center">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-3 text-gray-700">
                    Message Acceptance: {acceptMessages ? 'Enabled' : 'Disabled'}
                </span>
            </div>
            <Separator className="my-6" />

            <Button
                className="mb-6 flex items-center space-x-2"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                ) : (
                    <RefreshCcw className="h-5 w-5" />
                )}
                <span className="ml-2">Refresh Your Messages</span>
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id as string}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No messages found.</p>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
