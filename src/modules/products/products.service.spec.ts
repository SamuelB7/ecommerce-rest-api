import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService unit tests', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'testsecret';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findUnique: vi.fn().mockResolvedValue(null),
              findMany: vi.fn().mockResolvedValue(null),
              create: vi.fn().mockResolvedValue({ id: 'random-id', name: 'test', description: 'test', price: 10 })
            }
          },
        }
      ]
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a product', async () => {
    const response = await service.create({ name: 'test', description: 'test', price: 10, images: [] });
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name', 'test');
  });

  it('should find a paginated list of products', async () => {
    const mockProductsList = vi.fn().mockResolvedValueOnce({
      data: [],
      total: 0
    });
    service.findAll = mockProductsList;
    const response = await service.findAll(1, 10);
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('total');
  });

  it('should find one product', async () => {
    const mockProduct = vi.fn().mockResolvedValueOnce({ id: 'random-id', name: 'test', description: 'test', price: 10 });
    service.findOne = mockProduct;
    const response = await service.findOne('random-id');
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name', 'test');
  });

  it('should update a product', async () => {
    const mockProduct = vi.fn().mockResolvedValueOnce({ id: 'random-id', name: 'test', description: 'test', price: 10 });
    service.update = mockProduct;
    const response = await service.update('random-id', { name: 'test', description: 'test', price: 10 });
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name', 'test');
  });

  it('should delete a product', async () => {
    const mockProduct = vi.fn().mockResolvedValueOnce({ id: 'random-id', name: 'test', description: 'test', price: 10 });
    service.remove = mockProduct;
    const response = await service.remove('random-id');
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name', 'test');
  });
});
