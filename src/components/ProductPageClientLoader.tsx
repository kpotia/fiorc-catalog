import { useEffect } from 'react';

export default function ProductPageClientLoader() {
  useEffect(() => {
    import('./product-page-client.ts');
  }, []);

  return null;
}
