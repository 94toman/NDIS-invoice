import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.resolve.alias.canvas = false;
		config.resolve.alias.encoding = false;
		return config;
	},
	outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
