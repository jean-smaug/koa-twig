const Koa = require("koa");
const koaTwig = require("../index");

const app = new Koa();

const { NODE_ENV } = process.env;

app.use(
  koaTwig({
    views: `${__dirname}/views`,
    extension: "html", // default: "twig"
    data: { jean: "smaug", NODE_ENV },
    errors: {
      404: "not-found",
    },
  })
);

app.use(async (ctx) => {
  switch (ctx.path) {
    case "/":
      await ctx.render("home");
      break;

    case "/home":
      await ctx.render("home");
      break;

    case "/profile":
      await ctx.render("profile");
      break;

    case "/500":
      ctx.status = 500;
      break;
  }
});

app.listen(8080);
