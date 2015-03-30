module.exports = {
    fake: {
        base: 'http://localhost:8080/fake'
    },
    api: {
        projects: {
            base: 'http://localhost:8080/api/projects'
        },
        locations: {
            base: 'http://localhost:8080/api/locations'
        }
    },
    backup: {
        path: './backup/',
        // 5 minutes
        interval: 3600000
    }
};