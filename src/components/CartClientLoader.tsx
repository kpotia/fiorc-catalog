import { useEffect } from 'react';

export default function CartClientLoader() {
  useEffect(() => {
    import('./cart-client.ts');
  }, []);

  return null;
}
