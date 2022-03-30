FROM node:lts-alpine

ENV VITE_SUPABASE_URL=https://uobhanbtwfdjobutxres.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYmhhbmJ0d2Zkam9idXR4cmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY3MTQ4NDUsImV4cCI6MTk2MjI5MDg0NX0.RgG8PPnPy7L0A-34L38jyrPTU6tTfWGKC6dq9KwnuW8

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

RUN chown -R node /usr/src/app

USER node

CMD ["npm", "start"]
