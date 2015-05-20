# fake-rest-api

your fake REST API server

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

[![fake-rest-api](https://github.com/devlprs/fake-rest-api/raw/master/img/main.png)](#features)

# features

- fake api
- fake locations
- fake HTTP status codes
- fake JSON-responses

# install

```
npm install -g fake-rest-api
```

# fast start

```
fake-rest-api start
```

go http://localhost:8000

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

## cli options

| option              | description                |  
| ------------------- |:--------------------------:| 
| -c, --config <path> | path to custom config.json |
| -p, --port <number> | server tcp port            |   

[npm-image]: https://img.shields.io/npm/v/fake-rest-api.svg
[npm-url]: https://npmjs.org/package/fake-rest-api
[downloads-image]: https://img.shields.io/npm/dm/fake-rest-api.svg
[downloads-url]: https://npmjs.org/package/fake-rest-api