// class ApiErrors extends Error {
//     constructor(
//         statusCode,
//         message = "Something went wrong",
//         errors = []) {
//         //super use for overwrite
//         super(message)
//         this.statusCode = statusCode
//         this.message = message
//         this.data = null
//         this.success = false
//         this.errors = errors

//         // if (statck) {
//         //     this.stack = statck
//         // } else {
//         //     Error.captureStackTrace(this, this.constructor)
//         // }
//     }
// }

// export { ApiErrors }