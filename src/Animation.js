///////////////////////////////////////////////////////////////////////
//  Animation
///////////////////////////////////////////////////////////////////////
/**
 * Stage constructor.  A stage is used to contain multiple layers and handle
 * animations
 * @constructor
 * @augments Kinetic.Container
 * @param {Object} config
 * @param {Function} config.func function to be executed on each animation frame
 */
gamecore.Base.extend("Kinetic.Animation", 
    //Static methods
    {
        animations: [],
        animIdCounter: 0,
        animRunning: false,
        _addAnimation: function(anim) {
            this.animations.push(anim);
        },
        _removeAnimation: function(anim) {
            var id = anim.id;
            var animations = this.animations;
            for(var n = 0; n < animations.length; n++) {
                if(animations[n].id === id) {
                    this.animations.splice(n, 1);
                    return false;
                }
            }
        },
        _updateFrameObject: function(anim) {
            var time = new Date().getTime();
            anim.frame.timeDiff = time - anim.frame.lastTime;
            anim.frame.lastTime = time;
            anim.frame.time += anim.frame.timeDiff;
        },
        _runFrames: function() {
            var nodes = {};
            /*
             * loop through all animations and execute animation
             *  function.  if the animation object has specified node,
             *  we can add the node to the nodes hash to eliminate
             *  drawing the same node multiple times.  The node property
             *  can be the stage itself or a layer
             */
            for(var n = 0; n < this.animations.length; n++) {
                var anim = this.animations[n];
                this._updateFrameObject(anim);
                if(anim.node && anim.node._id !== undefined) {
                    nodes[anim.node._id] = anim.node;
                }
                // if animation object has a function, execute it
                if(anim.func) {
                    anim.func(anim.frame);
                }
            }

            for(var key in nodes) {
                nodes[key].draw();
            }
        },
        _animationLoop: function() {
            if(this.animations.length > 0) {
                this._runFrames();
                var that = this;
                requestAnimFrame(function() {
                    that._animationLoop();
                });
            }
            else {
                this.animRunning = false;
            }
        },
        _handleAnimation: function() {
            var that = this;
            if(!this.animRunning) {
                this.animRunning = true;
                that._animationLoop();
            }
        }
    },
    //Instance methods
    {
        init: function(config) {
            if(!config) {
                config = {};
            }
            for(var key in config) {
                this[key] = config[key];
            }

            // add frame object
            this.frame = {
                time: 0,
                timeDiff: 0,
                lastTime: new Date().getTime()
            };

            this.id = Kinetic.Animation.animIdCounter++;
        },
        /**
         * start animation
         * @name start
         * @methodOf Kinetic.Animation.prototype
         */
        start: function() {
            this.stop();
            this.frame.lastTime = new Date().getTime();
            Kinetic.Animation._addAnimation(this);
            Kinetic.Animation._handleAnimation();
        },
        /**
         * stop animation
         * @name stop
         * @methodOf Kinetic.Animation.prototype
         */
        stop: function() {
            Kinetic.Animation._removeAnimation(this);
        }
    }
);


requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
