<title>Instrucciones para deploy en el vps:</title>

ssh root@VPS--IP---ID

cd /var/www/rsvp-app
git pull
npm i
npm run build
pm2 restart rsvp-app --update-env
pm2 status
pm2 logs rsvp-app

<h3>(if changes are made to ngnix: sudo systemctl reload ngnix)</h3>

<h3>if i have errors with package.json modules: </h3>

cd /var/www/rsvp-app
rm -rf node_modules package-lock.json
npm install