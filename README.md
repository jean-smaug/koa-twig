# koa-twig

The usual way yo use a template engine with Koa is by using `koa-views`.
I had an issue using it with Twig. I couldn't include or extend templates as described in [this issue](https://github.com/queckezz/koa-views/issues/99).
So I created this little lib.

## Installation

```bash
yarn add -DE koa-twig

# OR

npm i --save-dev --exact koa-twig
```

## Usage

Under the hood, this module is using the [twig](https://github.com/twigjs/twig.js) module.

```js
const Koa = require("koa");
const koaTwig = require("koa-twig");

const app = new Koa();

app.use(
  koaTwig({
    views: `${__dirname}/views`,
    extension: "html", // default: "twig"
    errors: { 404: "error" }, // by default you can create STATUS_CODE.twig files
    data: { NODE_ENV: process.env.NODE_ENV }, // Data shared accross all views
  })
);

app.use(async (ctx) => {
  switch (ctx.path) {
    case "/":
      ctx.body = await ctx.render("home");
      break;

    case "/profile":
      ctx.body = await ctx.render("profile", {
        user: { firstName: "jean", lastName: "smaug" },
      });
      break;
  }
});

app.listen(8080);
```
