export interface ChatCommandService {
  registerCommands(): void;
}

export const ChatCommandService: unique symbol = Symbol('ChatCommandService');
