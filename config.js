import dotenv from 'dotenv';

console.log('NODE_ENV: ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'prod') {
    dotenv.config({ path: '.env_prod' });
} else {
    dotenv.config({ path: '.env_develop' });
}
