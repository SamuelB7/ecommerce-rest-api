import { AppModule } from "@/app.module";
import { UserRole } from "@/enums/user-role.enum";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaClient, Product } from "@prisma/client";
import { hash } from "bcryptjs";
import request from 'supertest';

describe('ProductsController e2e', () => {
  let app: INestApplication;
  let testProduct: Product;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();

    const prisma = new PrismaClient();
    const passwordHash = await hash('1234567', 7);
    await prisma.user.create({
      data: {
        email: "admin@email.com",
        password: passwordHash,
        role: UserRole.ADMIN
      }
    });

    testProduct = await prisma.product.create({
      data: {
        name: "Product Test",
        description: "Product Test",
        price: 99.99
      }
    });
  });

  test('[POST] /products', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        name: "Product Test",
        description: "Product Test",
        price: 10,
        images: [
          'https://placehold.co/600x400',
          'https://placehold.co/600x400',
          'https://placehold.co/600x400'
        ]
      })

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Product Test');
    expect(response.body).toHaveProperty('description', 'Product Test');
  });

  test('[GET] /products', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .query({
        page: 1,
        limit: 10
      })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
  });

  test('[GET] /products/:id', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .get(`/products/${testProduct.id}`)
      .set('Authorization', `Bearer ${login.body.accessToken}`)

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testProduct.id);
    expect(response.body).toHaveProperty('name', 'Product Test');
    expect(response.body).toHaveProperty('description', 'Product Test');
  });

  test('[PATCH] /products/:id', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .patch(`/products/${testProduct.id}`)
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        name: "Product Test Updated"
      })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testProduct.id);
    expect(response.body).toHaveProperty('name', 'Product Test Updated');
    expect(response.body).toHaveProperty('description', 'Product Test');
  })

  test('[DELETE] /products/:id', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin@email.com",
        password: "1234567"
      })

    const response = await request(app.getHttpServer())
      .delete(`/products/${testProduct.id}`)
      .set('Authorization', `Bearer ${login.body.accessToken}`)

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testProduct.id);
  });
});
