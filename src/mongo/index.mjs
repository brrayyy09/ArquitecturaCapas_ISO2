import mongoose from 'mongoose';

export const startConnection = async () => {
  const url = encodeURI('mongodb+srv://brray:I7EXt89VePqOlN0s@bdiso2.2sg85fv.mongodb.net/?retryWrites=true&w=majority');
  await mongoose.connect(url);
};

export const closeConnection = async () => {
  await mongoose.connection.close();
};
