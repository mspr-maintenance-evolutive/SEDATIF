# MSPR Maintenance Evolutive
> cbarange | 03th May 2021
---

## Build Setup

```bash
# configure pre-commit hook on linux
ln -s pre-commit.sh .git/hooks/pre-commit
chmod +x pre-commit.sh
# for windows
cp pre-commit.sh .git/hooks/pre-commit

# install dependencies
yarn install

# run for development
yarn dev

# run for production
yarn start

# run integration test
yarn test
```
