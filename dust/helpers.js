var dust = require('dustjs-helpers');

dust.helpers['first'] = function(chunk, context, bodies) {
    if (context.stack.index == 0)
        return chunk.render(bodies.block, context);
    else if (bodies['else'])
        return chunk.render(bodies['else'], context);
    else
        return chunk;
};