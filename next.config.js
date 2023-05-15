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
        ],
    }
}

module.exports = nextConfig
