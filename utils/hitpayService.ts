import axios from 'axios';
import crypto from 'crypto';

const HITPAY_API_KEY = process.env.HITPAY_API_KEY || '';
const HITPAY_SALT = process.env.HITPAY_SALT || '';
const HITPAY_API_URL = process.env.NEXT_PUBLIC_HITPAY_API_URL || 'https://api.sandbox.hit-pay.com/v1';

const PAYMENT_METHODS = [
  'paynow_online'  // Only use paynow_online for sandbox testing
];

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
    if (!HITPAY_API_KEY) {
      throw new Error('HitPay API key not configured');
    }

    // Ensure all payment methods are included
    PAYMENT_METHODS.forEach(method => {
      formData.append('payment_methods[]', method);
    });

    // Add additional required parameters
    formData.append('send_email', 'true');
    formData.append('send_sms', 'false');
    formData.append('allow_repeated_payments', 'false');

    console.log('Making HitPay request:', {
      url: `${HITPAY_API_URL}/payment-requests`,
      data: Object.fromEntries(formData),
      apiKey: HITPAY_API_KEY ? 'Present' : 'Missing'
    });

    const response = await axios({
      method: 'POST',
      url: `${HITPAY_API_URL}/payment-requests`,
      data: formData,
      headers: {
        'X-BUSINESS-API-KEY': HITPAY_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    });

    console.log('HitPay response:', response.data);
    
    if (!response.data || !response.data.url) {
      throw new Error('Invalid response from HitPay');
    }

    return response.data;

  } catch (error: any) {
    console.error('HitPay error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
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
