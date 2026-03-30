import { Controller, Inject, On } from '@altv-mango/server';
import { ChatCommandService } from '@backend/domain';

@Controller()
export class ChatCommandController {
  constructor(
    @Inject(ChatCommandService) private readonly chatCommandService: ChatCommandService,
  ) {}

  @On('serverStarted')
  public onServerStarted(): void {
    this.chatCommandService.registerCommands();
  }
}
