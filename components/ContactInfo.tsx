// ContactInfo Component - отображение контактной информации клиента

interface ContactInfoProps {
  clientName: string;
  clientPhone?: string | null;
  vkProfile?: string | null;
  className?: string;
}

export default function ContactInfo({ 
  clientName, 
  clientPhone, 
  vkProfile, 
  className = "" 
}: ContactInfoProps) {
  const renderContactMethod = () => {
    if (vkProfile) {
      // Извлекаем ID или username из VK профиля
      const vkMatch = vkProfile.match(/vk\.com\/(.+)$/);
      const vkIdentifier = vkMatch ? vkMatch[1] : vkProfile;
      
      return (
        <a
          href={vkProfile.startsWith('http') ? vkProfile : `https://${vkProfile}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg 
            className="w-4 h-4" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.033-1.49-.117-1.49.525v1.202c0 .33-.132.525-.525.525H12.3c-1.744 0-3.28-1.066-4.378-3.28C5.588 10.395 6.621 8.7 8.7 8.7c.66 0 .66.264.66.66 0 .396-.264.66-.66.66-.396 0-.66.264-.66.66 0 .396.264.66.66.66h.66c.396 0 .66-.264.66-.66v-.66c0-.396.264-.66.66-.66s.66.264.66.66v.66c0 .396.264.66.66.66h.66c.396 0 .66-.264.66-.66 0-.396-.264-.66-.66-.66-.396 0-.66-.264-.66-.66 0-.396.264-.66.66-.66.396 0 .66.264.66.66v1.32c0 .396.264.66.66.66h1.32c.396 0 .66-.264.66-.66v-1.32c0-.396-.264-.66-.66-.66z"/>
          </svg>
          {vkIdentifier}
        </a>
      );
    }
    
    if (clientPhone) {
      return (
        <span className="text-slate-600">
          {clientPhone}
        </span>
      );
    }
    
    return (
      <span className="text-slate-400 italic">
        Контакт не указан
      </span>
    );
  };

  return (
    <p className={`text-sm text-slate-500 ${className}`}>
      <span className="font-medium">{clientName}</span>
      <span className="mx-1">•</span>
      {renderContactMethod()}
    </p>
  );
}