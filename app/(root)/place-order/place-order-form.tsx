'use client';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/actions/order.actions';
import { useFormStatus } from 'react-dom';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createOrder();
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };
  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" disabled={pending}>
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{' '}
        Place Order
      </Button>
    );
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
