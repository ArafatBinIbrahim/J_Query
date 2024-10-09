$(function() {
    // 1 item
    $("#tabs").tabs();
    // 2 item
    var state = true;
    $("#button").on("click", function() {
        if (state) {
            $("#effect").animate({
                backgroundColor: "#aa0000",
                color: "#fff",
                width: 500
            }, 1000);
        } else {
            $("#effect").animate({
                backgroundColor: "#fff",
                color: "#000",
                width: 240
            }, 1000);
        }
        state = !state;
    });
    // 3 item
    if (!$("<canvas>")[0].getContext) {
        $("<div>").text(
            "Your browser doesn't support canvas, which is required for this demo."
        ).appendTo("#graphs");
        return;
    }

    var i = 0,
        width = 100,
        height = 100;

    $.each($.easing, function(name, impl) {
        var graph = $("<div>").addClass("graph").appendTo("#graphs"),
            text = $("<div>").text(++i + ". " + name).appendTo(graph),
            wrap = $("<div>").appendTo(graph).css('overflow', 'hidden'),
            canvas = $("<canvas>").appendTo(wrap)[0];

        canvas.width = width;
        canvas.height = height;
        var drawHeight = height * 0.8,
            cradius = 10,
            ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";

        // Draw background
        ctx.beginPath();
        ctx.moveTo(cradius, 0);
        ctx.quadraticCurveTo(0, 0, 0, cradius);
        ctx.lineTo(0, height - cradius);
        ctx.quadraticCurveTo(0, height, cradius, height);
        ctx.lineTo(width - cradius, height);
        ctx.quadraticCurveTo(width, height, width, height - cradius);
        ctx.lineTo(width, 0);
        ctx.lineTo(cradius, 0);
        ctx.fill();

        // Draw bottom line
        ctx.strokeStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(width * 0.1, drawHeight + .5);
        ctx.lineTo(width * 0.9, drawHeight + .5);
        ctx.stroke();

        // Draw top line
        ctx.strokeStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(width * 0.1, drawHeight * .3 - .5);
        ctx.lineTo(width * 0.9, drawHeight * .3 - .5);
        ctx.stroke();

        // Plot easing
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(width * 0.1, drawHeight);
        $.each(new Array(width), function(position) {
            var state = position / width,
                val = impl(state, position, 0, 1, width);
            ctx.lineTo(position * 0.8 + width * 0.1,
                drawHeight - drawHeight * val * 0.7);
        });
        ctx.stroke();

        // Animate on click
        graph.on("click", function() {
            wrap
                .animate({ height: "hide" }, 2000, name)
                .delay(800)
                .animate({ height: "show" }, 2000, name);
        });

        graph.width(width).height(height + text.height() + 10);
    });
    //   4 item
    // the widget definition, where "custom" is the namespace,
    // "colorize" the widget name
    $.widget("custom.colorize", {
        // default options
        options: {
            red: 255,
            green: 0,
            blue: 0,

            // Callbacks
            change: null,
            random: null
        },

        // The constructor
        _create: function() {
            this.element
                // add a class for theming
                .addClass("custom-colorize");

            this.changer = $("<button>", {
                    text: "change",
                    "class": "custom-colorize-changer"
                })
                .appendTo(this.element)
                .button();

            // Bind click events on the changer button to the random method
            this._on(this.changer, {
                // _on won't call random when widget is disabled
                click: "random"
            });
            this._refresh();
        },

        // Called when created, and later when changing options
        _refresh: function() {
            this.element.css("background-color", "rgb(" +
                this.options.red + "," +
                this.options.green + "," +
                this.options.blue + ")"
            );

            // Trigger a callback/event
            this._trigger("change");
        },

        // A public method to change the color to a random value
        // can be called directly via .colorize( "random" )
        random: function(event) {
            var colors = {
                red: Math.floor(Math.random() * 256),
                green: Math.floor(Math.random() * 256),
                blue: Math.floor(Math.random() * 256)
            };

            // Trigger an event, check if it's canceled
            if (this._trigger("random", event, colors) !== false) {
                this.option(colors);
            }
        },

        // Events bound via _on are removed automatically
        // revert other modifications here
        _destroy: function() {
            // remove generated elements
            this.changer.remove();

            this.element
                .removeClass("custom-colorize")
                .enableSelection()
                .css("background-color", "transparent");
        },

        // _setOptions is called with a hash of all options that are changing
        // always refresh when changing options
        _setOptions: function() {
            // _super and _superApply handle keeping the right this-context
            this._superApply(arguments);
            this._refresh();
        },

        // _setOption is called for each individual option that is changing
        _setOption: function(key, value) {
            // prevent invalid color values
            if (/red|green|blue/.test(key) && (value < 0 || value > 255)) {
                return;
            }
            this._super(key, value);
        }
    });

    // Initialize with default options
    $("#my-widget1").colorize();

    // Initialize with two customized options
    $("#my-widget2").colorize({
        red: 60,
        blue: 60
    });

    // Initialize with custom green value
    // and a random callback to allow only colors with enough green
    $("#my-widget3").colorize({
        green: 128,
        random: function(event, ui) {
            return ui.green > 128;
        }
    });

    // Click to toggle enabled/disabled
    $("#disable").on("click", function() {
        // use the custom selector created for each widget to find all instances
        // all instances are toggled together, so we can check the state from the first
        if ($(":custom-colorize").colorize("option", "disabled")) {
            $(":custom-colorize").colorize("enable");
        } else {
            $(":custom-colorize").colorize("disable");
        }
    });

    // Click to set options after initialization
    $("#green").on("click", function() {
        $(":custom-colorize").colorize("option", {
            red: 64,
            green: 250,
            blue: 8
        });
    });
});