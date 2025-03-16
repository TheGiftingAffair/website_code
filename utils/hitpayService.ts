import axios from 'axios';
import crypto from 'crypto';

const HITPAY_API_KEY = process.env.HITPAY_API_KEY || '';
const HITPAY_SALT = process.env.HITPAY_SALT || '';
const HITPAY_API_URL = process.env.NEXT_PUBLIC_HITPAY_API_URL || 'https://api.sandbox.hit-pay.com/v1';

interface CreatePaymentRequestParams {
  amount: number;
  currency: string;
  email: string;
  name: string;
  reference_number: string;
  redirect_url: string;
  webhook: string;
}

export const createPaymentRequest = async (formData: URLSearchParams) => {
  try {
    console.log('Making request to:', `${HITPAY_API_URL}/payment-requests`);
    console.log('With data:', Object.fromEntries(formData));
    
    // Convert formData to plain object to handle arrays properly
    const data = new URLSearchParams();
    for (const [key, value] of formData) {
      if (key.endsWith('[]')) {
        // Handle array parameters
        data.append(key, value);
      } else {
        data.append(key, value);
      }
    }

    const response = await axios({
      method: 'POST',
      url: `${HITPAY_API_URL}/payment-requests`,
      data: data,
      headers: {
        'X-BUSINESS-API-KEY': HITPAY_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    });

    console.log('HitPay response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('HitPay error details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const validateWebhook = (payload: any, hmac: string): boolean => {
  // Remove hmac from payload
  const { hmac: _, ...payloadWithoutHmac } = payload;
  
  // Sort and concatenate
  const hmacSource = Object.keys(payloadWithoutHmac)
    .sort()
    .reduce((str, key) => `${str}${key}${payloadWithoutHmac[key]}`, '');
  
  // Calculate signature
  const calculatedHmac = crypto
    .createHmac('sha256', HITPAY_SALT)
    .update(hmacSource)
    .digest('hex');
  
  return calculatedHmac === hmac;
};
