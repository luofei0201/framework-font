const _ = require('ramda')

export const Left = function(x) {
    this.__value = x
}
Left.of = function(x) {
    return new Left(x)
}
Left.prototype.map = function(f) {
    return this
}

export const Right = function(x) {
    this.__value = x
}
Right.of = function(x) {
    return new Right(x)
}
Left.prototype.map = function(f) {
    return Right.of(f(this.__value))
}

export const Either = _.curry(function(f, g, e) {
    switch (e.constructor) {
        case Left: return f(e.__value)
        case Right: return g(e.__value)
    }
})
