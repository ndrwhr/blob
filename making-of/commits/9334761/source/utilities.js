var Utilities = {
    /**
     * Converts a mouse event into a vec2.
     *
     * @param {MouseEvent} evt
     *
     * @return {vec2}
     */
    eventToVec2: function(evt){
        return vec2.createFrom(evt.pageX, evt.pageY);
    },

    computeHull: function(points, padding){
        var i, l;

        // Compute the cross product between OA and OB.
        function cross(o, a, b){
            return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
        }

        // Sort the points horizontally then vertically.
        points.sort(function(p1, p2){
            return (p1[0] - p2[0]) || (p1[1] - p2[1]);
        });

        var center = vec2.create();
        var lower = [];
        var upper = [];

        for (i = 0, l = points.length; i < l; i++){
            // Compute the lower hull.
            while (lower.length >= 2 &&
                cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0){
                lower.pop();
            }
            lower.push(points[i]);

            // Compute the upper hull.
            while (upper.length >= 2 &&
                cross(upper[upper.length - 2], upper[upper.length - 1], points[l - i - 1]) <= 0){
                upper.pop();
            }
            upper.push(points[l - i - 1]);

            // Add this point to the center vector.
            vec2.add(points[i], center);
        }

        // Scale the center vector by number of points to find the actual center.
        vec2.scale(center, 1 / points.length);

        // Remove the duplicate points.
        upper.pop();
        lower.pop();

        // Expand the hull outward.
        var hull = lower.concat(upper);

        if (!padding) return hull;

        var scale = Blob.PADDING;
        var offset = vec2.subtract(vec2.scale(center, scale, vec2.create()), center);
        var expandedHull = [];
        for (i = 0, l = hull.length; i < l; i++){
            // Scale the hull point then subtract the center offset so that at the end the expanded
            // hull encloses the original hull.
            expandedHull.push(vec2.subtract(vec2.scale(hull[i], scale, vec2.create()), offset,
                vec2.create()));
        }

        return expandedHull;
    },

    drawSpline: function(options){
        var context = options.context;
        var curves = this.getCurves_(options.points, options.curvature);

        this.drawPath_(context, curves);

        if (options.fillStyle){
            context.fillStyle = options.fillStyle;
            context.fill();
        }

        if (options.strokeStyle){
            context.strokeStyle = options.strokeStyle;
            context.lineWidth = options.lineWidth;
            context.stroke();
        }

        if (options.debug) this.drawDebug_(options, curves);
    },

    drawDebug_: function(options, curves){
        var context = options.context;

        context.fillStyle = options.debugFillStyle;
        context.strokeStyle = options.debugStrokeStyle;
        context.lineWidth = options.debugLineWidth;

        var i, l, curve, knot;
        for (i = 0, l = curves.length; i < l; i++){
            curve = curves[i];

            // Draw the start knot for this curve.
            context.fillRect(curve.start[0] - options.knotRadius,
                curve.start[1] - options.knotRadius,
                options.knotRadius * 2, options.knotRadius * 2);

            // Draw the control points.
            context.fillRect(curve.controls[0][0] - options.controlRadius,
                curve.controls[0][1] - options.controlRadius,
                options.controlRadius * 2, options.controlRadius * 2);

            context.fillRect(curve.controls[1][0] - options.controlRadius,
                curve.controls[1][1] - options.controlRadius,
                options.controlRadius * 2, options.controlRadius * 2);

            // Draw a line from the knots to their control points.
            context.beginPath();
            context.moveTo(curve.start[0], curve.start[1]);
            context.lineTo(curve.controls[0][0], curve.controls[0][1]);
            context.stroke();

            context.beginPath();
            context.moveTo(curve.end[0], curve.end[1]);
            context.lineTo(curve.controls[1][0], curve.controls[1][1]);
            context.stroke();
        }
    },

    drawPath_: function(context, curves){
        var i, l;

        context.beginPath();
        context.moveTo(curves[0].start[0], curves[0].start[1]);
        for (i = 0, l = curves.length; i < l; i++){
            context.bezierCurveTo(curves[i].controls[0][0], curves[i].controls[0][1],
                curves[i].controls[1][0], curves[i].controls[1][1],
                curves[i].end[0], curves[i].end[1]);
        }
    },

    getCurves_: function(points, curvature){
        var i, l;
        var controlPoints = this.getAllControlPoints_(points, curvature);
        var curves = [];

        curves.push({
            start: points[0],
            end: points[1],
            controls: [controlPoints[controlPoints.length - 1], controlPoints[0]]
        });

        var counter = 1;
        for (i = 1, l = points.length - 1; i < l; i++){
            curves.push({
                start: points[i],
                end: points[i + 1],
                controls: [controlPoints[counter++], controlPoints[counter++]]
            });
        }

        curves.push({
            start: points[i],
            end: points[0],
            controls: [controlPoints[counter++], controlPoints[counter++]]
        });

        return curves;
    },

    getAllControlPoints_: function(points, curvature){
        var i, l;
        var controlPoints = [];

        var count = 0;
        for (i = 0, l = points.length - 2; i < l; i++){
            controlPoints.push.apply(controlPoints, this.getControlPoints_(points[i], points[i + 1], points[i + 2], curvature));
        }

        controlPoints.push.apply(controlPoints, this.getControlPoints_(points[i], points[i + 1], points[0], curvature));
        controlPoints.push.apply(controlPoints, this.getControlPoints_(points[i + 1], points[0], points[1], curvature));

        return controlPoints;
    },

    getControlPoints_: function(p0, p1, p2, t){
        var d01 = vec2.dist(p0, p1);
        var d12 = vec2.dist(p1, p2);

        var fa = t * d01 / (d01 + d12);
        var fb = t - fa;

        var c1 = vec2.subtract(p0, p2, vec2.create());
        vec2.scale(c1, fa);
        vec2.add(p1, c1);
        c1.knot = p1;

        var c2 = vec2.subtract(p0, p2, vec2.create());
        vec2.scale(c2, fa);
        vec2.subtract(p1, c2);
        c2.knot = p1;

        return [c1, c2];
    }
};
