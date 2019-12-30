const path = require('path')
// const cliModulesPath = path.resolve(path.join(__dirname, '..', 'bin', 'modules'))
const rootPath = path.resolve(process.cwd())
const buildPath = path.join(rootPath, 'build')
const publicBuildPath = path.join(buildPath, 'public')

module.exports = {
  rootPath,
  buildPath,
  publicBuildPath,
  publicSrcPath: path.join(rootPath, 'public'),
  serverSrcPath: path.join(rootPath, 'src'),
  serverBuildPath: buildPath,
//   cliModulesPath: cliModulesPath,
  userNodeModulesPath: path.join(rootPath, 'node_modules'),
  publicPath: '/',
  serverUrl: 'http://localhost:3000'
}
