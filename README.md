# env-updater

CLI utility for update env
> this CLI can update many .env services with same key 


## How to use

### 1. install using npm global
   ```shell=
   npm i env-updater -g
   ```
### 2. create file env_master

```json=
# this new value will update in your .env, 
# if this key not exist will not insert

FIELD_A='1' 
FIELD_B='2'
FIELD_C='3'
FIELD_D=1000
```
### 3. create file config.json
```json=
{
    "user": "your_user",
    "privateKey": "/Users/dev/.ssh/id_rsa",
    "envMaster": "/Users/dev/env_master",
    "services": [
        {
            "name": "some_service_1",
            "host": "0.0.0.0",
            "env": "/home/dev/www/some_service_1/source/.env",
            "preCommand": "tail /home/dev/www/some_service_1/source/.env"
            "postCommand": "tail /home/dev/www/some_service_1/source/.env"
        },
        {
            "name": "some_service_2",
            "host": "0.0.0.0",
            "env": "/home/dev/www/some_service_2/source/.env",
            "preCommand": "tail /home/dev/www/some_service_2/source/.env"
            "postCommand": "tail /home/dev/www/some_service_2/source/.env"
        }
    ]
}
```
### 4. run env-updater
```shell=
 env-updater --config '/Users/dev/config.json'
```
## Backup env before update env
You can do using `preCommand`, for example :
```json=
{
    "user": "your_user",
    "privateKey": "/Users/dev/.ssh/id_rsa",
    "envMaster": "/Users/dev/env_master",
    "services": [
        {
            "name": "some_service_1",
            "host": "0.0.0.0",
            "env": "/home/dev/www/some_service_1/source/.env",
            "preCommand": "cd /home/dev/www/some_service_1/source && mkdir -p .env.backup && cp .env .env.backup/.env-$(date '+%Y.%m.%d-%H.%M.%S')",
            "postCommand": "pm2 reload some_service_1 --update-env"
        },
         {
            "name": "some_service_2",
            "host": "0.0.0.0",
            "env": "/home/dev/www/some_service_2/source/.env",
            "preCommand": "cd /home/dev/www/some_service_2/source && mkdir -p .env.backup && cp .env .env.backup/.env-$(date '+%Y.%m.%d-%H.%M.%S')",
            "postCommand": "pm2 reload some_service_2 --update-env"
        }
    ]
}
```

## Reload service after update env
You can reload app service after update env using `postCommand` 
if you using pm2, you can write like this :
```json=
{
    "user": "your_user",
    "privateKey": "/Users/dev/.ssh/id_rsa",
    "envMaster": "/Users/dev/env_master",
    "services": [
        {
            "name": "some_service_1",
            "host": "0.0.0.0",
            "env": "/home/dev/www/some_service_1/source/.env",
            "preCommand": "tail /home/dev/www/some_service_1/source/.env"
            "postCommand": "pm2 reload some_service_1 --update-env"
        },
         {
            "name": "some_service_2",
            "host": "0.0.0.0",
            "env": "/home/dev/www/some_service_2/source/.env",
            "preCommand": "tail /home/dev/www/some_service_2/source/.env"
            "postCommand": "pm2 reload some_service_2 --update-env"
        }
    ]
}
```