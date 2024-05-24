import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

/**
 * WebSocket шлюз для сповіщень.
 */
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotifyGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  /**
   * Метод, який викликається після ініціалізації WebSocket сервера.
   * @param server WebSocket сервер
   */
  afterInit(server: any) {
    console.log('WebSocket initialized');
  }

  /**
   * Обробник повідомлень про сповіщення.
   * @param socket WebSocket з'єднання
   * @param msg Повідомлення про сповіщення
   */
  @SubscribeMessage('notify')
  async handleNotify(socket: Socket, msg: string) {
    console.log(msg);
    if (!msg) return;

    // Передача сповіщення всім клієнтам, крім поточного
    socket.broadcast.emit('notify', msg);
  }
}
