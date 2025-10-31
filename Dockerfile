# Imagen base
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install

# Copiar el resto del código fuente
COPY ./src ./src

# Exponer el puerto
EXPOSE 5000

# Comando por defecto
CMD ["npm", "start"]
