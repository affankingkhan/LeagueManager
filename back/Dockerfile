FROM node:alpine
COPY package.json package.json
RUN npm install

# Add your source files
COPY . .
EXPOSE 5000
# EXPOSE 3000
# RUN npm install -s serve
# RUN npm start & serve -l 3000 -s build
CMD [ "npm", "start" ]