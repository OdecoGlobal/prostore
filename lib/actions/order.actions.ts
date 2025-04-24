'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.action';
import { getUserById } from './user.action';
import { insertOrderSchema } from '../validator';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';

// Create order and create the order items

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not autheticated');
    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error('User not found');
    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty',
        redirectTo: '/cart',
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: 'No shipping address',
        redirectTo: '/shipping-address',
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: 'No payment method',
        redirectTo: '/payment-method',
      };
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      itemsPrice: cart.itemsPrice,
      shippingAddress: user.address,
      taxPrice: cart.taxPrice,
      paymentMethod: user.paymentMethod,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice,
    });

    // Create transaction to create order in database
    const insertedOrderId = await prisma.$transaction(async tx => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order });
      //   Create orderitems from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }

      //   Clear the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });
      return insertedOrder.id;
    });
    if (!insertedOrderId) throw new Error('Order not created');
    return {
      success: true,
      message: 'Order created',
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}
