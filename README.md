# fake-rest-api

your fake REST API server 

- fake api 
- fake locations 
- fake HTTP status codes 
- fake JSON-responses


 
# install

```
npm install -g fake-rest-api
```

# configure

create backup directory

```
mkdir -p ~/fake_rest_api_backup
```

config.json

```
{
    "host": "localhost",
    "port": 8000,
    "backup": { 
        "path": "~/fake_rest_api_backup/"
    }
}
```


# start

```
fake-rest-api -c ./config.json start
```

