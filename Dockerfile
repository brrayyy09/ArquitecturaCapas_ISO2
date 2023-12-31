FROM node:18-alpine

WORKDIR /usr/app/

COPY index.mjs .
COPY package.json .
COPY package-lock.json .
COPY /src ./src/

ENV MONGO_URI mongodb+srv://brray:I7EXt89VePqOlN0s@bdiso2.2sg85fv.mongodb.net/?retryWrites=true&w=majority
ENV PORT 5001
ENV MINIO_HOST=http://minio:9000
ENV MINIO_ACCESS_KEY miniouser
ENV MINIO_SECRET_KEY miniopassword

EXPOSE 5001  

RUN npm install --production
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY ifn2n4r0fmrbwoc
ENV PM2_SECRET_KEY 0u0x140rlio4mui

CMD ["pm2-runtime", "index.mjs","--instance", "2"]