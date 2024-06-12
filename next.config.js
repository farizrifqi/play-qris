/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'chart.googleapis.com',
                port: '',
                pathname: '/chart/**',
            },
            {
                protocol: 'https',
                hostname: 'api.qrserver.com',
                port: '',
                pathname: '/v1/**',
            },
        ],
    }
}

module.exports = nextConfig
