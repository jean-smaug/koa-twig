# koa-twig

The usual way yo use a template engine with Koa is by using `koa-views`.
I had an issue using it with Twig. I couldn't include or extend templates as described in [this issue](https://github.com/queckezz/koa-views/issues/99).
So I created this little lib.

## Installation

```bash
yarn add -E koa-twig

# OR

npm i --exact koa-twig
```

## Config

- `views` string|required : the views folder path
- `extension` string : the files extension you want to use, by default, it's `twig`
- `errors` object|boolean : this optinal parameter allows you to customize the error handling. By default you can create `404.twig`, `500.twig`, every `STATUS_CODE.twig`. You can disable this behaviour by passing `false` to this option.
- `data` object : data you want to share accross all views
- `functions` object : functions you want to use accross all views
- `filters` object : filters you want to use accross all views

## Example

Under the hood, this module is using the [twig](https://github.com/twigjs/twig.js) module. You can find an example inside the `demo` folder of the repo.

```js
const Koa = require("koa");
const koaTwig = require("koa-twig");

const app = new Koa();

app.use(
  koaTwig({
    views: `${__dirname}/views`,
    extension: "html",
    errors: { 404: "not-found" }, // A 404 status code will render the file named `not-found`
    data: { NODE_ENV: process.env.NODE_ENV }, // Data shared accross all views
  })
);

app.use(async (ctx) => {
  switch (ctx.path) {
    case "/":
      await ctx.render("home");
      break;

    case "/profile":
      await ctx.render("profile", {
        user: { firstName: "jean", lastName: "smaug" },
      });
      break;
  }
});

app.listen(8080);
```

## Errors informations

If you define a `500.twig` (or any other STATUS_CODE.twig file) you'll be able to get error informations : `name`, `message`, `stack`.

```js
app.use(async (ctx) => {
  throw new Error("Smaug");
});
```

```html
<html>
  ...
  <body>
    <span>{{ error.name }}</span>
    <span>{{ error.message }}</span>
    <span>{{ error.stack }}</span>
  </body>
</html>
```
