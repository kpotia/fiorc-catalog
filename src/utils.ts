import type { CartItem } from './types';

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';

export const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');

export const buildWhatsAppUrl = (phone: string, items: readonly CartItem[]) => {
  const recipient = cleanPhone(phone);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lines = [
    '*NOUVELLE COMMANDE*',
    '━━━━━━━━━━━━━━━━',
    '',
    ...items.map((item, index) => {
      const subtotal = new Intl.NumberFormat('fr-FR').format(item.price * item.quantity);
      return `${index + 1}. *${item.name}*\n   Qté: ${item.quantity} | Prix unitaire: ${new Intl.NumberFormat('fr-FR').format(item.price)} FCFA | Sous-total: ${subtotal} FCFA`;
    }),
    '',
    '━━━━━━━━━━━━━━━━',
    `*TOTAL : ${new Intl.NumberFormat('fr-FR').format(total)} FCFA*`,
    '',
    '_Disponible pour livraison._',
    'Merci !',
  ];

  const encodedMessage = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${recipient}?text=${encodedMessage}`;
};
