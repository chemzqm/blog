# Blog

A static blog https://chemzqm.me

Using Makefile and misaka for speed and simplity.

[yue.css](https://github.com/lepture/yue.css) is used for nice looking.

All of the files of my blog is included here,

I publish my blog site by just run command `Make remote`, a simple post-receive
hook including:

```
#!/bin/sh
GIT_WORK_TREE=/home/chemzqm/blog
export GIT_WORK_TREE
git checkout -f
```

is used on server side.
