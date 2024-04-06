import { Knock } from '@knocklabs/node';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class NotificationService {
  private knock: Knock;

  constructor() {
    this.knock = new Knock(process.env.KNOCK_SECRET_API_KEY);
  }

  public async dispatchNotification(
    trigger: string,
    data: { [key: string]: any },
    recipients: UserEntity[],
  ) {
    await this.knock.workflows.trigger(trigger, {
      data,
      recipients: recipients.map((user) => {
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      }),
    });
  }
}
