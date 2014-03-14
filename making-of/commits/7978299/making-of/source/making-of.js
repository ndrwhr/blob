
var Templates = (function(){
    var tmlpEls = document.querySelectorAll('script[type="text/html"]');
    var templates = {};

    [].forEach.call(tmlpEls, function(el){
        templates[el.id] = tmpl(el.innerHTML);
    });

    return templates;
})();

MakingOf = {
    /**
     * @type {Element[]} An array of revision wrapper elements.
     */
    wrappers_: null,

    start: function(){
        this.assignRandomColor_();
        this.renderCommits_();

        document.addEventListener('scroll', this.onScroll_.bind(this));
    },

    /**
     * Assigns a random color class to the body.
     */
    assignRandomColor_: function(){
        var colors = [
            'lightblue',
            'lightcoral',
            'lightgreen',
            'lightpink',
            'lightsalmon',
            'lightseagreen',
            'lightskyblue',
            'palevioletred',
            'yellowgreen',
            'peru'
        ];
        document.body.classList.add(colors[Math.floor(Math.random() * colors.length)]);
    },

    /**
     * Renders the revisions template and scrapes out the relevant elements.
     */
    renderCommits_: function(){
        var container = document.querySelector('.revisions');
        var wrappers = [];

        container.innerHTML = Templates['revisions-tmpl']({
            commits: commits
        });

        this.wrappers_ = [].slice.call(container.querySelectorAll('.blob-container'));
        this.wrappers_.forEach(function(wrapper){
            var iframe = wrapper.querySelector('iframe');
            // iframe.onload = this.onIframeLoad_.bind(this);

            // Store a reference to the iframe so we don't have to query it constantly.
            wrapper.iframe = iframe;
        }, this);

        this.onScroll_();
    },

    /**
     * Called whenever a scroll is detected or if an iframe loads. This method will check to see
     * which iframes are in view and set them up to load or pause or unpause their simulations.
     */
    onScroll_: function(){
        this.wrappers_.forEach(function(wrapper, index){
            var iframe = wrapper.iframe;

            if (this.isVisible_(wrapper)){
                if (!iframe.isLoaded && !iframe.getAttribute('src')){
                    iframe.onload = this.onIframeLoad_.bind(this);

                    iframe.setAttribute('src', iframe.getAttribute('data-iframe-src'));
                }
                console.log(index);
                this.unpauseIframe_(wrapper.iframe);
            } else {
                this.pauseIframe_(wrapper.iframe);
            }
        }, this);
    },

    /**
     * Called whenever an iframe loads.
     */
    onIframeLoad_: function(evt){
        evt.target.isLoaded = true;
        evt.target.classList.add('loaded');
        this.onScroll_();
    },

    /**
     * Returns true if the passed in element is visible.
     */
    isVisible_: function(container){
        var rect = container.getBoundingClientRect();
        return rect.top < window.innerHeight && (rect.top + rect.height) > 0;
    },

    /**
     * Pauses an iframes simulation/drawing code by swapping out requestAnimation frame and
     * setTimeout with dummy functions.
     */
    pauseIframe_: function(iframe){
        var win = iframe.contentWindow;

        if (win.originals || !iframe.isLoaded){

            return;
        }

        var functions = [
            'requestAnimationFrame',
            'setTimeout',
            'setInterval'
        ];

        win.originals = {};
        functions.forEach(function(name){
            var dummy = function(){ dummy.calls.push(arguments); };
            dummy.calls = [];

            win.originals[name] = win[name];
            win[name] = dummy;
        });
    },

    /**
     * Unpauses an iframes simulation and drawing code by putting the native functions back in
     * place and replaying their last call.
     */
    unpauseIframe_: function(iframe){
        var win = iframe.contentWindow;

        if (!win.originals) return;

        var functions = [
            'requestAnimationFrame',
            'setTimeout',
            'setInterval'
        ];

        functions.forEach(function(name){
            var dummy = win[name];
            win[name] = win.originals[name];

            dummy.calls.forEach(function(args){
                win[name].apply(win, args);
            });
        });

        delete win.originals;
    }
};

MakingOf.start();
