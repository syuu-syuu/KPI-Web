module.exports = () => {
    const rewrites = () => {
        return [
            {
                source: '/api/sites',
                destination: 'http://localhost:8000/api/sites/',
            },
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*/',
            },
        ];
    };
    return {
        rewrites,
    };
};