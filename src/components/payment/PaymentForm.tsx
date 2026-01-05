// src/components/payment/PaymentForm.tsx
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from '../../hooks/useToast';
import Button from '../common/Button';
import Card from '../common/Card';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm = ({ amount, onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Send paymentMethod.id to your server
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wstapp_token')}`,
        },
        body: JSON.stringify({
          amount,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      showToast('Payment successful!', 'success');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
      showToast(`Payment failed: ${err.message}`, 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card padding="lg">
      <div className="mb-6">
        <h3 className="text-lg font-bold">Payment Details</h3>
        <p className="text-gray-600">Amount due: ${amount.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-lg p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={processing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={processing}
            disabled={!stripe || processing}
            className="flex-1"
          >
            Pay ${amount.toFixed(2)}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PaymentForm;