// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';// libreria para cargar variables de entorno en un archivo

dotenv.config();
const { PORT } = process.env;
export default PORT;
export const {
  MONGO_URI, MINIO_HOST, MINIO_ACCESS_KEY, MINIO_SECRET_KEY,
} = process.env;
