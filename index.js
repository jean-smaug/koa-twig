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
  const errorView = config.error || ctx.status;
  const defaultData = config.data || {};

  function render(file, data = {}) {
    if (!file) {
      throw new Error("`file` is required in render");
    }

    return renderFile(`${config.views}/${file}.${extension}`, {
      ...defaultData,
      ...data,
    });
  }

  ctx.response.render = render;
  ctx.render = render;

  await next();

  try {
    const errorViewCompletePath = `${config.views}/${errorView}.${extension}`;

    if (ctx.status === 404 && asyncExists(errorViewCompletePath)) {
      ctx.body = await render(errorViewCompletePath);
    }
  } catch (error) {}
};

module.exports = twigMiddleware;
