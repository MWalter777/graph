const removeImports = require('next-remove-imports')();

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	useFileSystemPublicRoutes: true,
	swcMinify: true,
	images: {},
	experimental: { esmExternals: true },
};

module.exports = removeImports(nextConfig);
//module.exports = nextConfig;
