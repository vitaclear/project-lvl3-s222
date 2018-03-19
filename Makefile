install:
	npm install
start:
	npm run babel-node -- src/bin/reader.js __tests__/__fixtures__/before.json __tests__/__fixtures__/after.json
run-help:
	npm run babel-node -- src/bin/reader.js -h
publish:
	npm publish
lint:
	npm run eslint .
test:
	npm test
