const Koa = require("koa");
const Router = require("koa-router");
const koaTwig = require("../index");

const app = new Koa();
const router = Router();

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

router.get("/", async (ctx) => {
  await ctx.render("home");
});

router.get("/home", async (ctx) => {
  await ctx.render("home");
});
router.get("/profile", async (ctx) => {
  await ctx.render("profile");
});

router.get("/error", async (ctx) => {
  throw new Error("We have a problem");
});

router.get("/500", async (ctx) => {
  ctx.status = 500;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080);
