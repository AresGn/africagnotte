'use client';

import { FaCreditCard, FaMobile, FaBitcoin, FaPaypal } from 'react-icons/fa';

interface PaymentMethodIconProps {
  methodId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PaymentMethodIcon({ methodId, size = 'md' }: PaymentMethodIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconClass = `${sizeClasses[size]} flex items-center justify-center rounded-lg`;

  switch (methodId) {
    case 'orange_money':
      return (
        <div className={`${iconClass} bg-orange-500 text-white`}>
          <FaMobile />
        </div>
      );
    
    case 'mtn_money':
      return (
        <div className={`${iconClass} bg-yellow-500 text-white`}>
          <FaMobile />
        </div>
      );
    
    case 'airtel_money':
      return (
        <div className={`${iconClass} bg-red-500 text-white`}>
          <FaMobile />
        </div>
      );
    
    case 'wave':
      return (
        <div className={`${iconClass} bg-blue-500 text-white`}>
          <FaMobile />
        </div>
      );
    
    case 'moov_money':
      return (
        <div className={`${iconClass} bg-green-500 text-white`}>
          <FaMobile />
        </div>
      );
    
    case 'visa':
      return (
        <div className={`${iconClass} bg-blue-600 text-white`}>
          <FaCreditCard />
        </div>
      );
    
    case 'mastercard':
      return (
        <div className={`${iconClass} bg-red-600 text-white`}>
          <FaCreditCard />
        </div>
      );
    
    case 'paypal':
      return (
        <div className={`${iconClass} bg-blue-500 text-white`}>
          <FaPaypal />
        </div>
      );
    
    case 'usdt':
      return (
        <div className={`${iconClass} bg-green-500 text-white`}>
          <FaBitcoin />
        </div>
      );
    
    case 'btc':
      return (
        <div className={`${iconClass} bg-orange-500 text-white`}>
          <FaBitcoin />
        </div>
      );
    
    case 'eth':
      return (
        <div className={`${iconClass} bg-gray-700 text-white`}>
          <FaBitcoin />
        </div>
      );
    
    case 'sol':
      return (
        <div className={`${iconClass} bg-purple-500 text-white`}>
          <FaBitcoin />
        </div>
      );
    
    default:
      return (
        <div className={`${iconClass} bg-gray-400 text-white`}>
          <FaCreditCard />
        </div>
      );
  }
}
