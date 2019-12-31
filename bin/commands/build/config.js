module.exports = {
    name: 'build [file]',
    description: 'Build a production package',
    options: [
        {
            flags: '-r, --run',
            description: 'start build after compiling'
        },
        {
            flags: '-o, --run-only',
            description: 'only start a ready built package'
        },
        {
            flags: '-s, --as-service',
            description: 'run the package with nodemon'
        }
    ]
}
