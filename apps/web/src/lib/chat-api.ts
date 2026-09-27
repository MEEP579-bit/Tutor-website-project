import { apiFetchAuth } from "./api";

export interface ApiMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  senderName: string;
}

export interface ApiConversation {
  bookingId: string;
  otherPartyName: string;
  otherPartyAvatarUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export async function fetchConversations(): Promise<ApiConversation[]> {
  return apiFetchAuth<ApiConversation[]>("/api/chat");
}

export async function fetchMessages(bookingId: string): Promise<ApiMessage[]> {
  return apiFetchAuth<ApiMessage[]>(`/api/chat/${bookingId}`);
}

export async function sendMessage(bookingId: string, content: string): Promise<ApiMessage> {
  return apiFetchAuth<ApiMessage>(`/api/chat/${bookingId}`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
