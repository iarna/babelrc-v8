nvm > /dev/null || exit 1
for a in $(cat node-versions.md); do nvm use $a ; node generate-module.js; done
