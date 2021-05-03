export default {
    PORT: 3000,
    PRODUCT_URL: 'products',
    DB_HOST: process.env.DB_HOST || 'localhost',
    BAD_REQUEST_CODE_400: 400,
    NOT_FOUND_CODE_404: 404,
    CREATED_REQUEST_CODE: 201,
    INTERNAL_SERVER_ERROR: 500,
    DB_PORT: 27017,
    DB_NAME: process.env.DB_NAME || 'mydb',
}