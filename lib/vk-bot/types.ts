// Типы для VK бота

export interface VKEvent {
  type: 'message_new' | 'message_reply' | 'confirmation';
  object: {
    message?: VKMessage;
    client_info?: VKClientInfo;
  };
  group_id: number;
  event_id: string;
}

export interface VKMessage {
  id: number;
  from_id: number;
  text: string;
  payload?: string;
  attachments?: VKAttachment[];
}

export interface VKClientInfo {
  button_actions: string[];
  keyboard: boolean;
  inline_keyboard: boolean;
  carousel: boolean;
  lang_id: number;
}

export interface VKAttachment {
  type: string;
  [key: string]: any;
}

export interface VKKeyboard {
  one_time: boolean;
  inline: boolean;
  buttons: VKButton[][];
}

export interface VKButton {
  action: {
    type: 'text' | 'callback';
    label: string;
    payload?: string;
  };
  color: 'primary' | 'secondary' | 'negative' | 'positive';
}

export interface FormattedMessage {
  text: string;
  keyboard?: VKKeyboard;
  attachments?: VKAttachment[];
}

export enum CommandType {
  START = 'start',
  PRICE = 'price',
  BOOK = 'book',
  CONTACT_HUMAN = 'contact_human',
  CANCEL = 'cancel',
  UNKNOWN = 'unknown'
}

export interface CommandParameters {
  service?: string;
  date?: string;
  time?: string;
  name?: string;
}

export interface ParsedCommand {
  type: CommandType;
  parameters: CommandParameters;
  isValid: boolean;
  errors: string[];
}

export enum DialogState {
  IDLE = 'idle',
  SELECTING_SERVICE = 'selecting_service',
  SELECTING_DATE = 'selecting_date',
  SELECTING_TIME = 'selecting_time',
  ENTERING_NAME = 'entering_name',
  CONFIRMING_BOOKING = 'confirming_booking'
}

export interface VKBookingData {
  service: string;
  date: string;
  time: string;
  clientName: string;
  vkProfile: string;
  vkUserId: number;
}

export interface UserState {
  userId: number;
  currentState: DialogState;
  bookingData: Partial<VKBookingData>;
  lastActivity: Date;
  messageHistory: string[];
}

export interface ServiceInfo {
  service: string;
  description: string;
  category: string;
  master: string;
  duration: number;
  price: number;
}

export interface BookingResult {
  success: boolean;
  booking?: VKBookingData;
  errors: string[];
}