module.exports = function(req, res, next){
    if(!req.user){
        res.status(401).json({
            success: false,
            message: "Please Login first"
        })
        return
    }
    next()
}