const twig = require('twig');
const util = require('util');

const renderFile = util.promisify(twig.renderFile);

/**
 * Give the ability to use Twig template engine in Koa
 * @param {object} config
 * @param {string} views - the views folder path
 * @param {object} data - the data to pass to each view
 */
const twigMiddleware = (config) => async (ctx, next) => {
  function render(file, data) {
    return renderFile(`${config.views}/${file}.html`, { ...config.data, ...data });
  }

  ctx.response.render = render;
  ctx.render = render;

  await next();
};

module.exports = twigMiddleware;

