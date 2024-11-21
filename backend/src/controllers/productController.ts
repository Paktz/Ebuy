import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateProductDTO, UpdateProductDTO, ProductFilters } from '../types/product';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Changed from class to object with methods
const ProductController = {
  // Get all products with filters
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const {
        category,
        condition,
        minPrice,
        maxPrice,
        status,
        search,
        page = 1,
        limit = 10
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const where: Prisma.ProductWhereInput = {
        AND: [
          category ? { category: category as string } : {},
          condition ? { condition: condition as string } : {},
          status ? { status: status as string } : {},
          minPrice || maxPrice
            ? {
                price: {
                  gte: minPrice ? Number(minPrice) : undefined,
                  lte: maxPrice ? Number(maxPrice) : undefined,
                },
              }
            : {},
          search
            ? {
                OR: [
                  { title: { contains: search as string, mode: 'insensitive' } },
                  { description: { contains: search as string, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            seller: {
              select: {
                username: true,
                email: true,
              },
            },
          },
          skip,
          take: Number(limit),
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        products,
        meta: {
          total,
          page: Number(page),
          lastPage: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        message: 'Error fetching products',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Get single product by ID
  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          seller: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        message: 'Error fetching product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Create new product
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: CreateProductDTO = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const product = await prisma.product.create({
        data: {
          ...productData,
          sellerId: userId,
        },
        include: {
          seller: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        message: 'Error creating product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Update product
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateProductDTO = req.body;
      const userId = req.user?.id;

      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      if (existingProduct.sellerId !== userId) {
        res.status(403).json({ message: 'Unauthorized to update this product' });
        return;
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          seller: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        message: 'Error updating product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Delete product
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      if (existingProduct.sellerId !== userId) {
        res.status(403).json({ message: 'Unauthorized to delete this product' });
        return;
      }

      await prisma.product.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        message: 'Error deleting product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};

export default ProductController;