import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, doc, query, orderBy, onSnapshot, getDoc, setDoc, addDoc } from 'firebase/firestore';

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientId: string;
    recipientName: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, recipientId, recipientName }) => {
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    const getConversationId = (userId1: string, userId2: string): string => {
        return [userId1, userId2].sort().join('_');
    };

    useEffect(() => {
        if (!user || !recipientId || !isOpen) {
            console.log('Skipping useEffect: user, recipientId, or isOpen is invalid', { user, recipientId, isOpen });
            return;
        }

        const conversationId = getConversationId(user.uid, recipientId);
        const conversationDocRef = doc(db, 'conversations', conversationId);
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        console.log('Setting up listener for conversation:', conversationId);
        console.log('User UID:', user.uid);
        console.log('Recipient ID:', recipientId);

        // Check if conversation exists before setting up listener
        const setupListener = async () => {
            console.log('Initializing conversation:', { conversationId, user: user?.uid, recipientId });

            try {
                const conversationSnap = await getDoc(conversationDocRef);
                if (!conversationSnap.exists()) {
                    console.log('Conversation does not exist. Creating a new one...');
                    await setDoc(conversationDocRef, {
                        participants: [user.uid, recipientId],
                        lastMessage: '',
                        lastMessageTimestamp: new Date().toISOString(),
                    });
                    console.log('Conversation created successfully.');
                } else {
                    console.log('Conversation exists:', conversationSnap.data());
                    const participants = conversationSnap.data()?.participants || [];
                    console.log('Existing participants:', participants);
                    if (!participants.includes(user.uid)) {
                        setError('You are not a participant in this conversation');
                        return;
                    }
                }

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedMessages = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    console.log('Messages fetched:', fetchedMessages);
                    setMessages(fetchedMessages);
                }, (err: any) => {
                    console.error('Error fetching messages:', err);
                    if (err.code === 'permission-denied') {
                        setError('You don’t have permission to view these messages');
                    } else {
                        setError('Failed to load messages: ' + err.message);
                    }
                });

                return () => unsubscribe();
            } catch (err: any) {
                console.error('Error initializing conversation:', err);
                setError('Failed to initialize conversation: ' + err.message);
            }
        };

        setupListener();
    }, [isOpen, user, recipientId]);

    const handleSendMessage = async () => {
        if (!user || !newMessage.trim()) return;

        try {
            const conversationId = getConversationId(user.uid, recipientId);
            const conversationDocRef = doc(db, 'conversations', conversationId);
            const messagesRef = collection(db, 'conversations', conversationId, 'messages');

            console.log('Sending message for conversation:', conversationId);

            // Update last message and timestamp
            await setDoc(
                conversationDocRef,
                {
                    lastMessage: newMessage,
                    lastMessageTimestamp: new Date().toISOString(),
                },
                { merge: true }
            );

            // Add the new message
            await addDoc(messagesRef, {
                senderId: user.uid,
                content: newMessage,
                timestamp: new Date().toISOString(),
            });

            setNewMessage('');
        } catch (err: any) {
            console.error('Error sending message:', err);
            if (err.code === 'permission-denied') {
                setError('You don’t have permission to send messages');
            } else {
                setError('Failed to send message: ' + err.message);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Chat with {recipientName}</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="h-64 overflow-y-auto mb-4 border p-4 rounded">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`mb-2 ${msg.senderId === user?.uid ? 'text-right' : 'text-left'}`}
                        >
                            <p
                                className={`inline-block p-2 rounded ${
                                    msg.senderId === user?.uid ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                            >
                                {msg.content}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded p-2"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 text-gray-500 hover:text-gray-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default MessageModal;