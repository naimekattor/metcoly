import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./nextInt/request.ts');


const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
      protocol:"https",
      hostname:"img.freepik.com"
    },
      {
      protocol:"https",
      hostname:"images.unsplash.com"
    },
    ]
  }
};

export default withNextIntl(nextConfig);

