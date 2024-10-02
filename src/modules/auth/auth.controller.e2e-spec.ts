import { AppModule } from "@/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('AuthController e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[POST] /auth/create-account', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/create-account')
      .send({
        name: "John Doe",
        email: "johndoe@email.com",
        password: "1234567"
      })


    expect(response.statusCode).toBe(201);
  });

  test('[POST] /auth/login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "johndoe@email.com",
        password: "1234567"
      })

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
  });

  test('[GET] /auth/profile', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        name: "John Doe",
        email: "johndoe@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${login.body.accessToken}`)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('role');
  });
});
