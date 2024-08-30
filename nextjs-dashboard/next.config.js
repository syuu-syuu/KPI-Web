module.exports = () => {
    const rewrites = () => {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/sites/',
            },
        ];
    };
    return {
        rewrites,
    };
};