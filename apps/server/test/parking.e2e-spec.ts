import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { after } from 'node:test';

describe('ParkingController E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a new User', () => {
    return request(app.getHttpServer())
      .post('/user/manager')
      .send({
        email: 'testingManager1@gmail.com',
        name: 'Manager Test',
        phoneNumber: '8885554444',
        password: 'testingManager1',
        companyName: 'ManagerTest1',
        companyLocation: 'Location1 Company1',
      })
      .expect(201);
  });
});

//creating Users -> Authentication -->
