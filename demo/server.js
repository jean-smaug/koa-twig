const Koa = require("koa");
const koaTwig = require("../index");

const app = new Koa();

const { NODE_ENV } = process.env;

app.use(
  koaTwig({
    views: `${__dirname}/views`,
    extension: "html", // default: "twig"
    data: { jean: "smaug", NODE_ENV },
  })
);

app.use(async (ctx) => {
  switch (ctx.path) {
    case "/":
      ctx.body = await ctx.render("home");
      break;

    case "/home":
      ctx.body = await ctx.render("home");
      break;

    case "/profile":
      ctx.body = await ctx.render("profile");
      break;

    case "/500":
      ctx.status = 500;
      break;
  }
});

app.listen(8080);
