import { useEffect } from 'react';

export default function ProductCatalogClient() {
  useEffect(() => {
    import('./product-catalog-client.ts');
  }, []);

  return null;
}
