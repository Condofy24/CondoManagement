import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';

jest.mock('@knocklabs/node');
describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    process.env.KNOCK_SECRET_API_KEY = 'test';
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should create the service', () => {
    expect(service).toBeDefined();
  });
});
