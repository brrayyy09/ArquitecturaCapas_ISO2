// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';// libreria para cargar variables de entorno en un archivo

dotenv.config();
const PORT = process.env.PORT || 5001;
export default PORT;
export const { MONGO_URI } = process.env;
