(function(MOTION, undefined) {
    REVISION = '1';

    _timeMode = MOTION.FRAMES;
    _valueMode = MOTION.ABSOLUTE;

    p5.prototype.registerMethod('pre', function() {
        for (var i = 0; i < _motions.length; i++)
            if (_motions[i].isAutoUpdating() && !_motions[i]._hasController)
                _motions[i].update();
    });

    p5.prototype.createMotion = function(duration, delay, easing) {
        _current = new MOTION(duration, delay, easing);
        return _current;
    };

    p5.prototype.createTween = function(object, property, end, duration, delay, easing) {
        _current = new MOTION.Tween(object, property, end, duration, delay, easing);
        return _current;
    };

    p5.prototype.createParallel = function(children) {
        _current = new MOTION.Parallel(children);
        return _current;
    };

    p5.prototype.createSequence = function(children) {
        _current = new MOTION.Sequence(children);
        return _current;
    };

    p5.prototype.createTimeline = function(children) {
        _current = new MOTION.Timeline(children);
        return _current;
    };

    var find = function() {
        if (typeof arguments[0] === 'string')
            for (var i = 0; i < _motions.length; i++)
                if (_motions.getName() == arguments[0])
                    return _motions[i];
    }

    p5.prototype.goto = function(motion) {
        if (typeof arguments[0] === 'number')
            _current = _motions[arguments[0]];
        else if (typeof arguments[0] === 'string')
            _current = find(arguments[0]);
        else if (typeof arguments[0] === 'object')
            _current = arguments[0];
    };

    p5.prototype.timeMode = function(mode) {
        _timeMode = mode;
        return this;
    };

    p5.prototype.seconds = function() {
        _timeMode = MOTION.SECONDS;

        return this;
    };

    p5.prototype.frames = function() {
        _timeMode = MOTION.FRAMES;

        return this;
    };

    _currentEasing = null;

    p5.prototype.easingMode = function(easing) {
        _currentEasing = easing;

        return this;
    };

    p5.prototype.easing = function(easing) {
        _currentEasing = easing;

        return this;
    };

    p5.prototype.relative = function() {
        _valueMode = MOTION.RELATIVE;

        // if (_current)
        //     _current.setValueMode(_valueMode)

        return this;
    };

    p5.prototype.absolute = function() {
        _valueMode = MOTION.ABSOLUTE;

        // if (_current)
        //     _current.setValueMode(_valueMode)

        return this;
    };

    p5.prototype.valueMode = function(mode) {
        _valueMode = mode;

        return this;
    };

    _current = null;

    p5.prototype.tween = function(object, property, end, duration, delay, easing) {
        t = new MOTION.Tween(object, property, end, duration, delay, easing).setValueMode(_valueMode);

        if (_currentEasing)
            t.easing(_currentEasing)

        if (_current && !_current.isPlaying()) {
            if (_current.isTimeline() && _currentKeyframe)
                _currentKeyframe.add(t);
            else
                _current.add(t);
        } else
            _current = t;

        return t;
    };

    p5.prototype.beginParallel = function(name) {
        _current = new MOTION.Parallel();

        if (typeof name != 'undefined')
            _current.setName(name);

        return _current;
    };

    p5.prototype.endParallel = function() {
        _current.updateTweens();
    };

    p5.prototype.beginSequence = function(name) {
        _current = new MOTION.Sequence();

        if (typeof name != 'undefined')
            _current.setName(name);

        return _current;
    };

    p5.prototype.endSequence = function() {
        _current.updateTweens();
    };

    p5.prototype.beginTimeline = function(name) {
        _current = new MOTION.Timeline();

        if (typeof name != 'undefined')
            _current.setName(name);

        return _current;
    };

    p5.prototype.endTimeline = function() {
        _current.updateTweens();
    };

    _currentKeyframe = null;

    p5.prototype.beginKeyframe = function(name, time) {
        _currentKeyframe = new MOTION.Keyframe();

        if (arguments.length == 1 && typeof arguments[0] != 'undefined') {
            if (typeof arguments[0] == 'number')
                _currentKeyframe.delay(arguments[0]);
            else if (typeof arguments[0] == 'string')
                _currentKeyframe.setName(arguments[0]);
        } else if (arguments.length == 2) {
            _currentKeyframe.setName(name);
            _currentKeyframe.delay(time);
        }

        return _currentKeyframe;
    };

    p5.prototype.endKeyframe = function() {
        _currentKeyframe.updateTweens();

        if (_current.isTimeline())
            _current.add(_currentKeyframe);

        _currentKeyframe = null;
    };

    p5.prototype.play = function(motion) {
        if (typeof arguments[0] === 'string')
            find(arguments[0]).play();
        else if (typeof arguments[0] === 'object')
            arguments[0].play()
        else
            _current.play();
    };

    p5.prototype.playAll = function() {
        for(var i = 0; i < _motions.length; i++)
            if(!_motions[i]._hasController)
                _motions[i].play();
    };

    p5.prototype.stop = function(motion) {
        if (typeof arguments[0] === 'string')
            find(arguments[0]).stop();
        else if (typeof arguments[0] === 'object')
            arguments[0].stop()
        else
            _current.stop();
    };

    p5.prototype.stopAll = function() {
        for(var i = 0; i < _motions.length; i++)
            if(!_motions[i]._hasController)
                _motions[i].stop();
    };

    p5.prototype.pause = function(motion) {
        if (typeof arguments[0] === 'string')
            find(arguments[0]).pause();
        else if (typeof arguments[0] === 'object')
            arguments[0].pause()
        else
            _current.pause();
    };

    p5.prototype.pauseAll = function() {
        for(var i = 0; i < _motions.length; i++)
            if(!_motions[i]._hasController)
                _motions[i].pause();
    };

    p5.prototype.resume = function(motion) {
        if (typeof arguments[0] === 'string')
            find(arguments[0]).resume();
        else if (typeof arguments[0] === 'object')
            arguments[0].resume()
        else
            _current.resume();
    };

    p5.prototype.resumeAll = function() {
        for(var i = 0; i < _motions.length; i++)
            if(!_motions[i]._hasController)
                _motions[i].resume();
    };

    p5.prototype.seek = function(motion, t) {
        if (typeof arguments[0] === 'string')
            find(arguments[0]).seek(arguments[1]);
        else if (typeof arguments[0] === 'object')
            arguments[0].seek(arguments[1])
        else
            _current.seek(arguments[0]);
    };

    p5.prototype.seekAll = function(t) {
        for(var i = 0; i < _motions.length; i++)
            if(!_motions[i]._hasController)
                _motions[i].seek(t);
    };


    p5.prototype.repeat = function(motion, duration) {
        if (typeof arguments[0] === 'string')
            find(arguments[0]).repeat(arguments[1]);
        else if (typeof arguments[0] === 'object')
            arguments[0].repeat(arguments[1]);
        else
            _current.repeat(arguments[0]);
    };

    p5.prototype.repeatAll = function(duration) {
        for(var i = 0; i < _motions.length; i++)
            if(!_motions[i]._hasController)
                _motions[i].repeat(duration);
    };

    p5.prototype.reverse = function(motion) {
        if (typeof arguments[0] === 'string')
            find(arguments[0]).reverse();
        else if (typeof arguments[0] === 'object')
            arguments[0].reverse();
        else
            _current.reverse();
    };

    p5.prototype.reverseAll = function(duration) {
        for(var i = 0; i < _motions.length; i++)
            if(!_motions[i]._hasController)
                _motions[i].reverse(duration);
    };

    p5.prototype.onStart = function(func) {
        _current.onStart(func);
        return this;
    };

    p5.prototype.onEnd = function(func) {
        _current.onEnd(func);
        return this;
    };

    p5.prototype.onUpdate = function(func) {
        _current.onUpdate(func);
        return this;
    };

    p5.prototype.onRepeat = function(func) {
        _current.onRepeat(func);
        return this;
    };

    MOTION.prototype.resume = function() {
        this._isPlaying = true;
        this._isSeeking = false;

        this._playTime = (_timeMode == MOTION.SECONDS) ? (millis() - this._playTime * 1000) : (frameCount - this._playTime);

        return this;
    };

    MOTION.prototype.updateTime = function() {
        this._time = ((_timeMode == MOTION.SECONDS) ? ((millis() - this._playTime) / 1000) : (frameCount - this._playTime)) * this._timeScale;

        if (this._isReversing && this._reverseTime !== 0)
            this._time = this._reverseTime - this._time;
    };

    MOTION.ColorProperty = function(object, field, end) {
        MOTION.Property.call(this, object, field, end);
    };

    MOTION.ColorProperty.prototype = Object.create(MOTION.Property.prototype);
    MOTION.ColorProperty.prototype.constrctor = MOTION.ColorProperty

    MOTION.ColorProperty.prototype.update = function(position) {
        this._position = position;
        this._object[this._field] = lerpColor(this._begin, this._end, this._position);
    };

    MOTION.VectorProperty = function(object, field, end) {
        MOTION.Property.call(this, object, field, end);
    };

    MOTION.VectorProperty.prototype = Object.create(MOTION.Property.prototype);
    MOTION.VectorProperty.prototype.constrctor = MOTION.VectorProperty;

    MOTION.VectorProperty.prototype.update = function(position) {
        this._position = position;
        this._object[this._field] = p5.Vector.lerp(this._begin, this._end, this._position);
    };

    MOTION.Tween.prototype.addProperty = function(object, property, end) {
        var p;

        if (typeof arguments[0] == 'string') {
            var v = this._object[arguments[0]];

            if (typeof v == 'number')
                p = new MOTION.NumberProperty(this._object, arguments[0], arguments[1]);
            else if (v instanceof p5.Color)
                p = new MOTION.ColorProperty(this._object, arguments[0], arguments[1]);
            else if (v instanceof p5.Vector)
                p = new MOTION.VectorProperty(this._object, arguments[0], arguments[1]);
            else
                console.warn('Only numbers, p5.colors and p5.vectors are supported.');
        } else {
            var v = object[property];

            if (typeof v == 'number')
                p = new MOTION.NumberProperty(object, property, end);
            else if (v instanceof p5.Color)
                p = new MOTION.ColorProperty(object, property, end);
            else if (v instanceof p5.Vector)
                p = new MOTION.VectorProperty(object, property, end);
            else
                console.warn('Only numbers, p5.colors and p5.vectors are supported.');
        }

        this._properties.push(p);
        this._propertyMap[p.getField()] = p;

        return this;
    };

    MOTION.Tween.prototype.add = MOTION.Tween.prototype.addProperty;
})(MOTION);