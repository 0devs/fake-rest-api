var j = require('joi');

module.exports = j.object().keys({
    id: j.string().default(null),
    url: j.string().trim().required().regex(/\/[a-zA-Z-0-9\-_]+/),
    creation_date: j.string().required(),
    modification_date: j.string().default(null)
});