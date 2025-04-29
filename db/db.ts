import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: 'chalo-crm',
    });
    if (connection) console.log('Connected to DB');
  } catch (error: any) {
    throw new Error(error);
  }
};

export default connectDB;
