import { AppModule } from "@/app.module";
import { UserRole } from "@/enums/user-role.enum";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcryptjs";
import request from 'supertest';

describe('UsersController e2e', () => {
  let app: INestApplication;
  let userAdmin: User;
  let commonUser: User;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();

    const prisma = new PrismaClient();
    const passwordHash = await hash('1234567', 7);
    userAdmin = await prisma.user.create({
      data: {
        email: "admin@email.com",
        password: passwordHash,
        role: UserRole.ADMIN
      }
    });

    commonUser = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@email.com",
        password: passwordHash,
        role: UserRole.USER
      }
    });
  });


  test('[POST] /users', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        name: "Fulano de Tal",
        email: "fulano@email.com",
        password: "1234567",
        role: UserRole.USER,
      })

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Fulano de Tal');
  });

  test('[GET] /users', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .query({
        page: 1,
        limit: 10
      })

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
  });

  test('[GET] /users/:id', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .get(`/users/${commonUser.id}`)
      .set('Authorization', `Bearer ${login.body.accessToken}`)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', commonUser.id);
  });

  test('[PATCH] /users/:id', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .patch(`/users/${commonUser.id}`)
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        name: "John Doe Updated"
      })

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', commonUser.id);
    expect(response.body).toHaveProperty('name', 'John Doe Updated');
  });

  test('[DELETE] /users/:id', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .delete(`/users/${commonUser.id}`)
      .set('Authorization', `Bearer ${login.body.accessToken}`)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', commonUser.id);
  });
});
