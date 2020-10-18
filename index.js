const twig = require("twig");
const util = require("util");
const fs = require("fs");

const renderFile = util.promisify(twig.renderFile);
const asyncExists = util.promisify(fs.exists);

/**
 * Give the ability to use Twig template engine in Koa
 * @param {object} config
 * @param {string} config.views - the views folder path
 * @param {object} config.errors - errors to filenam map
 * @param {object} config.data - the data to pass to each view
 * @param {object} config.extension - the data to pass to each view
 */
const twigMiddleware = (config) => async (ctx, next) => {
  if (!config.views) {
    throw new Error("`views` is required in config");
  }

  const extension = config.extension || "twig";
  const defaultData = config.data || {};

  /**
   * Render a twig template
   * @param {string} view
   * @param {object} data
   */
  async function render(view, data = {}) {
    if (!view) {
      throw new Error("`view` is required in render");
    }

    const viewPath = `${config.views}/${view}.${extension}`;

    if (!(await asyncExists(viewPath))) {
      throw new Error("The `view` does not exist");
    }

    ctx.type = "text/html";
    ctx.body = await renderFile(viewPath, {
      ...defaultData,
      ...data,
    });
  }

  ctx.response.render = render;
  ctx.render = render;

  await next();

  try {
    const errorView =
      (config.errors && config.errors[ctx.status]) || ctx.status;

    const doesErrorViewExists = await asyncExists(
      `${config.views}/${errorView}.${extension}`
    );

    if (
      (String(ctx.status).startsWith(4) || String(ctx.status).startsWith(5)) &&
      doesErrorViewExists
    ) {
      ctx.body = await render(errorView);
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
};

module.exports = twigMiddleware;
