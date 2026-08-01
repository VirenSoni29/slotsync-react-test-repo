import dotenv from 'dotenv'

dotenv.config()

const config = {
   PORT: process.env.PORT,

   DATABASE_URL: process.env.DATABASE_URL,

   JWT_SECRET: process.env.JWT_SECRET,
   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
   JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

   EMAIL_USER: process.env.EMAIL_USER,
   EMAIL_PASS: process.env.EMAIL_PASS,

   RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
   RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

   FRONTEND_URL: process.env.FRONTEND_URL,
   
   NODE_ENV: process.env.NODE_ENV
}

export default config