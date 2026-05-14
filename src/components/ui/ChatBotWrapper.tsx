"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ChatBot = dynamic(() => import("./ChatBot"), { ssr: false });

export default function ChatBotWrapper() {
  const pathname = usePathname();
  
  // Only show chatbot on public-facing pages, not inside portals
  const isPortal = pathname.startsWith("/admin") || 
                   pathname.startsWith("/student") || 
                   pathname.startsWith("/teacher");

  if (isPortal) return null;
  
  return <ChatBot />;
}
