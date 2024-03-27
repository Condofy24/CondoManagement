import { Knock } from '@knocklabs/node';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BuildingService } from '../building/building.service';
import { BuildingEntity } from '../building/entities/building.entity';
import { UnitEntity } from '../unit/entities/unit.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService {
  private knock: Knock;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => BuildingService))
    private readonly buildingService: BuildingService,
  ) {
    this.knock = new Knock(process.env.KNOCK_SECRET_API_KEY);
  }

  public async sendPaymentReceivedNotification(
    unit: UnitEntity,
    amount: Number,
  ) {
    if (!unit.ownerId) return;

    const owner = (await this.userService.findUserById(
      unit.ownerId.toString(),
    )) as UserEntity;

    const building = (await this.buildingService.findBuildingById(
      unit.buildingId.toString(),
    )) as BuildingEntity;

    if (this.knock.workflows)
      await this.knock.workflows.trigger('payment', {
        data: {
          buildingName: building.name,
          paymentAmount: amount,
          unitNumber: unit.unitNumber,
        },
        recipients: [
          {
            id: owner._id.toString(),
            name: owner.name,
            email: owner.email,
          },
        ],
      });
  }
}
