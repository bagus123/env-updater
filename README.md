# env-updater

CLI utility for update env
> this CLI can update many .env services with same key-value 


How to use

1. install using npm global
   ```shell=
   npm i env-updater -g
   ```
3. create file env_master

```json=
# this new value will update in your .env, 
# if this key not exist will not insert

FIELD_A='1' 
FIELD_B='2'
FIELD_C='3'
FIELD_D=1000
```
4. create file config.json
```json=
{
    "user": "your_user",
    "privateKey": "/Users/dev/.ssh/id_rsa",
    "envMaster": "/Users/dev/env_master",
    "services": [
        {
            "name": "some_service",
            "host": "0.0.0.0",
            "env": "/home/dev/www/some_service/source/.env",
            "postCommand": "cat /home/dev/www/some_service/source/.env"
        }
    ]
}
```
6. run env-updater
```shell=
 env-updater --config '/Users/dev/config.json'
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
            "name": "some_service",
            "host": "0.0.0.0",
            "env": "/home/dev/www/some_service/source/.env",
            "postCommand": "pm2 reload someservice --update-env"
        }
    ]
}
```