FROM node:20

# Set timezone (optional)
ENV TZ=Asia/Jakarta

# Set working directory
WORKDIR /app

# Update dan install semua dependensi sistem yang dibutuhin
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  build-essential \
  g++ && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

# Copy package.json dan install dependencies
COPY package.json .
RUN npm install

# Copy semua file project
COPY . .

# Expose port
EXPOSE 8080

# Command untuk run app
CMD ["node", "index.js"]
