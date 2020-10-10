const twig = require("twig");
const util = require("util");
const fs = require("fs");

const renderFile = util.promisify(twig.renderFile);
const asyncExists = util.promisify(fs.exists);

/**
 * Give the ability to use Twig template engine in Koa
 * @param {object} config
 * @param {string} config.views - the views folder path
 * @param {object} config.error - the name of the error view, default: 404
 * @param {object} config.data - the data to pass to each view
 * @param {object} config.extension - the data to pass to each view
 */
const twigMiddleware = (config) => async (ctx, next) => {
  if (!config.views) {
    throw new Error("`views` is required in config");
  }

  const extension = config.extension || "twig";
  const defaultData = config.data || {};

  async function render(file, data = {}) {
    if (!file) {
      throw new Error("`file` is required in render");
    }

    const viewPath = `${config.views}/${file}.${extension}`;

    if (!(await asyncExists(viewPath))) {
      throw new Error("The view does not exist");
    }

    return renderFile(viewPath, {
      ...defaultData,
      ...data,
    });
  }

  ctx.response.render = render;
  ctx.render = render;

  await next();

  try {
    const errorView = config.error || ctx.status;

    const doesErrorViewExists = await asyncExists(
      `${config.views}/${errorView}.${extension}`
    );

    if ((ctx.status === 404 || ctx.status === 500) && doesErrorViewExists) {
      ctx.body = await render(errorView);
    }
  } catch (error) {}
};

module.exports = twigMiddleware;
