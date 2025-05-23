
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            return next(new Error(err))
        })
    }
}

export const globalErrorHandler = (err, req, res, next) => {
    if (err) {
        if (process.env.MODE === "development") {
            return res.status(500).json({ message: err.message, err, stack: err.stack })
        }
        res.status(500).json({ status: "ERROR", message: err.message })
    }
}