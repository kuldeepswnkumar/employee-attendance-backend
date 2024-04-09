class ApiErrorResponce {
    constructor(statusCode, message = "Failure!", data, error) {
        this.statusCode = statusCode,
            this.message = message,
            this.data = data,
            this.error = error,
            this.success = false
    }
}
export { ApiErrorResponce }