import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { sendOrderConfirmationEmail } from '../utils/email';

const prisma = new PrismaClient();

export const checkoutController = {
  async createOrder(req: Request, res: Response) {
    const { addressId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
      // Get user's cart with products
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!cart?.items.length) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Get shipping address
      const address = await prisma.shippingAddress.findUnique({
        where: { id: addressId }
      });

      if (!address) {
        return res.status(400).json({ message: 'Invalid shipping address' });
      }

      // Group items by seller
      const itemsBySeller: Record<string, typeof cart.items> = {};
      for (const item of cart.items) {
        const sellerId = item.product.sellerId;
        if (!itemsBySeller[sellerId]) {
          itemsBySeller[sellerId] = [];
        }
        itemsBySeller[sellerId].push(item);
      }

      // Create orders for each seller
      const orders = await Promise.all(
        Object.entries(itemsBySeller).map(async ([sellerId, items]) => {
          // Calculate total amount
          const totalAmount = items.reduce(
            (sum, item) => sum + Number(item.product.price) * item.quantity,
            0
          );

          // Create order
          return prisma.order.create({
            data: {
              buyerId: userId,
              sellerId: sellerId,
              totalAmount: new Prisma.Decimal(totalAmount),
              shippingAddress: address as any, // Convert address to JSON
              items: {
                create: items.map(item => ({
                  productId: item.product.id,
                  quantity: item.quantity,
                  price: item.product.price
                }))
              },
              status: 'PENDING'
            },
            include: {
              items: {
                include: {
                  product: true
                }
              },
              buyer: true,
              seller: true
            }
          });
        })
      );

      // Clear the cart after successful order creation
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      // Send confirmation emails
      for (const order of orders) {
        try {
          await sendOrderConfirmationEmail(order);
        } catch (emailError) {
          console.error('Failed to send email for order:', order.id, emailError);
          // Continue with the response even if email fails
        }
      }

      res.status(201).json({ 
        message: 'Orders created successfully',
        orders: orders.map(order => ({
          id: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
          items: order.items.length
        }))
      });

    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ 
        message: 'Error processing checkout',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};