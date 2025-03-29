'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DemoPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main page with the demo section anchor
    router.push('/#demo');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to demo section...</p>
    </div>
  );
}
