import PathNode from './path-node';
import renderStyle from './utils/render-style';
import renderAttr from './utils/render-attribute';
import NODE_MAP from './node-map';
import { htmlEncode } from '../common';

function decodeEntities(text) {
    if (!text || !text.indexOf || text.indexOf("&") < 0) {
        return text;
    }

    var element = decodeEntities._element;
    element.innerHTML = text;
    return element.textContent || element.innerText;
}

if (typeof document !== "undefined") {
    decodeEntities._element = document.createElement("span");
}

var TextNode = (function (PathNode) {
    function TextNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) TextNode.__proto__ = PathNode;
    TextNode.prototype = Object.create( PathNode && PathNode.prototype );
    TextNode.prototype.constructor = TextNode;

    TextNode.prototype.geometryChange = function geometryChange () {
        var pos = this.pos();
        this.attr("x", pos.x);
        this.attr("y", pos.y);
        this.invalidate();
    };

    TextNode.prototype.optionsChange = function optionsChange (e) {
        if (e.field === "font") {
            this.attr("style", renderStyle(this.mapStyle()));
            this.geometryChange();
        } else if (e.field === "content") {
            PathNode.prototype.content.call(this, this.srcElement.content());
        }

        PathNode.prototype.optionsChange.call(this, e);
    };

    TextNode.prototype.mapStyle = function mapStyle (encode) {
        var style = PathNode.prototype.mapStyle.call(this, encode);
        var font = this.srcElement.options.font;

        if (encode) {
            font = htmlEncode(font);
        }

        style.push([ "font", font ]);

        return style;
    };

    TextNode.prototype.pos = function pos () {
        var pos = this.srcElement.position();
        var size = this.srcElement.measure();
        return pos.clone().setY(pos.y + size.baseline);
    };

    TextNode.prototype.renderContent = function renderContent () {
        var content = this.srcElement.content();
        content = decodeEntities(content);
        content = htmlEncode(content);

        return content;
    };

    TextNode.prototype.renderTextAnchor = function renderTextAnchor () {
        var anchor;

        if ((this.options || {}).rtl) {
            anchor = 'end';
        }

        return renderAttr("text-anchor", anchor);
    };

    TextNode.prototype.template = function template () {
        return "<text " + (this.renderTextAnchor()) + " " + (this.renderStyle()) + " " + (this.renderOpacity()) + " x='" + (this.pos().x) + "' y='" + (this.pos().y) + "'" +
                    (this.renderStroke()) + " " + (this.renderTransform()) + " " + (this.renderDefinitions()) +
                    (this.renderFill()) + ">" + (this.renderContent()) + "</text>";
    };

    return TextNode;
}(PathNode));

NODE_MAP.Text = TextNode;

export default TextNode;
//# sourceMappingURL=text-node.js.map
