'use client';
import { useTransition } from 'react';
import { Cart, CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error('Error', {
          description: res.message,
          className: '',
          classNames: {
            toast: 'sonner-error',
          },
        });
        return;
      }

      // Handle sucess add to cart
      toast('Success', {
        description: res.message,
        action: {
          label: 'Go to cart',
          onClick: () => router.push('/cart'),
        },
      });
    });
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      toast(res.success ? 'Success' : 'Error', {
        description: res.message,
      });
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find(x => x.productId === item.productId);
  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader2 className=" w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>

      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader2 className=" w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader2 className=" w-4 h-4 animate-spin" />
      ) : (
        <>
          <Plus className="h-4 w-4" /> Add to Cart
        </>
      )}
    </Button>
  );
};

export default AddToCart;
