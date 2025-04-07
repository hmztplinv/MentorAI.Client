# Derleme Aşaması
FROM node:16-alpine AS build

WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama dosyalarını kopyala
COPY . .

# Ortam değişkenini ayarla
ENV REACT_APP_API_URL=http://localhost:8000/api/v1

# Uygulamayı derle
RUN npm run build

# Çalıştırma Aşaması
FROM nginx:alpine

# Nginx yapılandırmasını kopyala
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Derlenen uygulamayı Nginx'e kopyala
COPY --from=build /app/build /usr/share/nginx/html

# 80 portunu dışa aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]