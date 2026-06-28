const success = (res, data = {}, message = 'OK', status = 200, extra = {}) => {
    return res.status(status).json({
        success: true,
        message,
        data,
        ...extra
    });
};

const failure = (res, message = 'Request failed', status = 500, extra = {}) => {
    return res.status(status).json({
        success: false,
        message,
        ...extra
    });
};

module.exports = {
    success,
    failure
};
