# Sverd
This tool installs Debian 10 servers on [Vultr.com](https://vultr.com) with Nginx, node, npm, letsencrypt, zsh, firewall (ufw), mongodb, and waveorb.

Static files are handled by Nginx, which has support for asset caching, brotli compression, https and http2. All processes are handled by `systemd`.

You also get scripts to manage deployment of apps and server updates.

### Configuration
Create a file called sverd.json in your app directory. Add you SSH public key to your Vultr account and replace the `ssh` field with your ssh script id.

Finally, replace `api` in the config file with your Vultr API key.
```javascript
{
  "domain": "waveorb.com",
  "label": "waveorb",
  "hostname": "waveorb",
  "api": "VULTR_API_KEY",
  "os": 352,
  "region": 7,
  "plan": 201,
  "ssh": "5ba4f7cab05d7",
  "desc": "Waveorb server",
  "names": "waveorb.com www.waveorb.com",
  "dir": "/var/www/waveorb",
  "exec": "server-linux",
  "pass": "http://localhost",
  "port": 4000,
  "cert": "/etc/letsencrypt/live/waveorb.com/fullchain.pem",
  "key": "/etc/letsencrypt/live/waveorb.com/privkey.pem",
  "email": "hello@waveorb.com",
  "domains": [
    "waveorb.com",
    "www.waveorb.com"
  ]
}

```
After running the `boot` script, the IP address of your server will be stored in your `sverd.json` config file.

### Usage
```bash
# Boot server on Vultr
sverd boot

# Install software
sverd install

# Update server
sverd update

# Deploy app
sverd deploy
```

ISC licensed. Enjoy!