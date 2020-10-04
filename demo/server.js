const Koa = require("koa");
const koaTwig = require("../index");

const app = new Koa();

app.use(
  koaTwig({
    views: `${__dirname}/views`,
    extension: "html", // default: "twig"
    data: { jean: "smaug" },
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
  }
});

app.listen(8080);
