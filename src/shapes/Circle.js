///////////////////////////////////////////////////////////////////////
//  Circle
///////////////////////////////////////////////////////////////////////
/**
 * Circle constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Shape.extend("Kinetic.Circle", {},
    {
        init: function(config) {
            this.setDefaultAttrs({
                radius: 0
            });

            this.shapeType = "Circle";
            config.drawFunc = this.drawFunc;

            // call super constructor
            this._super(config);
        },
        drawFunc: function(context) {
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, Math.PI * 2, true);
            context.closePath();
            this.fill(context);
            this.stroke(context);
        }
    }
);

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Circle, ['radius']);

/**
 * set radius
 * @name setRadius
 * @methodOf Kinetic.Circle.prototype
 * @param {Number} radius
 */

/**
 * get radius
 * @name getRadius
 * @methodOf Kinetic.Circle.prototype
 */