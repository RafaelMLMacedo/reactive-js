require('dotenv').config()
const url = require('url')
const { readFileSync } = require('fs')
const { cd, exec, echo, touch } = require('shelljs')

let repoUrl
let pkg = JSON.parse(readFileSync('package.json') as any)
if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error('URL does not exist in repository section')
  }
  repoUrl = pkg.repository.url
} else {
  repoUrl = pkg.repository
}

let parsedUrl = url.parse(repoUrl)
let repository = (parsedUrl.host || '') + (parsedUrl.path || '')
let ghToken = process.env.GH_TOKEN

if (ghToken === void 0) {
  throw new Error('ghToken was not defined.')
}

echo('Deploying docs!!!')
cd('docs')
touch('.nojekyll')
exec('git init')
exec('git add .')
exec('git config user.name "Rafael Macedo"')
exec('git config user.email "rafaelmacedo4@gmail.com"')
exec('git commit -m "docs(docs): update gh-pages"')
exec(`git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages`)
echo('Docs deployed!!')
