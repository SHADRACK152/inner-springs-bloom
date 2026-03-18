import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/254720851710"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center whatsapp-pulse"
    style={{ backgroundColor: "#25D366" }}
  >
    <MessageCircle className="w-7 h-7" style={{ color: "#fff" }} />
  </a>
);

export default WhatsAppButton;
