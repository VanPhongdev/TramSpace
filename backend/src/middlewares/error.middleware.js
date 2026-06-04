export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;

    if (status === 500) {
        console.error(`[${new Date().toISOString()}] ${err.stack}`);
    }

    res.status(status).json({
        success: false,
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}