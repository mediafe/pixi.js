import BatchShaderGenerator from './BatchShaderGenerator';
import BatchGeometry from './BatchGeometry';
import BaseBatchRenderer from './BatchRenderer';

import defaultVertex from './texture.vert';
import defaultFragment from './texture.frag';

/**
 * Used to create new, custom BatchRenderer plugins for the Renderer.
 * @example
 * const fragment = `
 * varying vec2 vTextureCoord;
 * varying vec4 vColor;
 * varying float vTextureId;
 * uniform sampler2D uSamplers[%count%];
 *
 * void main(void){
 *     vec4 color;
 *     %forloop%
 *     gl_FragColor = vColor * vec4(color.a - color.rgb, color.a);
 * }
 * `;
 * const InvertBatchRenderer = PIXI.BatchRendererFactory.create({ fragment });
 * PIXI.Renderer.registerPlugin('invert', InvertBatchRenderer);
 * const sprite = new PIXI.Sprite();
 * sprite.pluginName = 'invert';
 *
 * @class
 * @memberof PIXI
 */
export class BatchRendererFactory
{
    /**
     * Create a new BatchRenderer plugin for Renderer. this convenience can provide an easy way
     * to extend BatchRenderer with all the necessary pieces.
     *
     * @static
     * @param {object} [options]
     * @param {string} [options.vertex=PIXI.BatchRendererFactory.defaultVertexSrc] - Vertex shader source
     * @param {string} [options.fragment=PIXI.BatchRendererFactory.defaultFragmentTemplate] - Fragment shader template
     * @param {number} [options.vertexSize=6] - Vertex size
     * @param {object} [options.geometryClass=PIXI.BatchGeometry]
     * @return {PIXI.BatchRenderer} New batch renderer plugin.
     */
    static create(options)
    {
        const { vertex, fragment, vertexSize, geometryClass } = Object.assign({
            vertex: defaultVertex,
            fragment: defaultFragment,
            geometryClass: BatchGeometry,
            vertexSize: 6,
        }, options);

        function BatchPlugin(renderer)
        {
            BaseBatchRenderer.call(this, renderer);
            this.shaderGenerator = new BatchShaderGenerator(vertex, fragment);
            this.geometryClass = geometryClass;
            this.vertexSize = vertexSize;
        }

        BatchPlugin.prototype = BaseBatchRenderer.prototype;

        return BatchPlugin;
    }

    /**
     * The default vertex shader source
     *
     * @static
     * @type {string}
     * @constant
     */
    static get defaultVertexSrc()
    {
        return defaultVertex;
    }

    /**
     * The default fragment shader source
     *
     * @static
     * @type {string}
     * @constant
     */
    static get defaultFragmentTemplate()
    {
        return defaultFragment;
    }
}

// Setup the default BatchRenderer plugin, this is what
// we'll actually export at the root level
export const BatchRenderer = BatchRendererFactory.create();