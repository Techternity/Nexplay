// components/MessageModal.tsx
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, query, orderBy, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

const MessageModal = ({ isOpen, onClose, recipientId, recipientName }: MessageModalProps) => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  // Generate a deterministic conversation ID
  const getConversationId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  // Fetch messages for the conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !recipientId) return;

      try {
        const conversationId = getConversationId(user.uid, recipientId);
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      }
    };

    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, user, recipientId]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    try {
      const conversationId = getConversationId(user.uid, recipientId);
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const conversationDocRef = doc(db, 'conversations', conversationId);

      // Create or update the conversation document
      await setDoc(
        conversationDocRef,
        {
          participants: [user.uid, recipientId],
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
      // Refetch messages
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
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