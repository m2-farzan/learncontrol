const default_options = {
    mx: 1,
    sx: 1,
    my: 1,
    sy: 1,
    xlabel: '',
    ylabel: '',
    xrange: [0, 1],
    yrange: [0, 1],
    grid: true,
    n_xticks: 5,
    n_yticks: 5,
    n_gpt_x: 2,
    n_gpt_y: 2,
}

var drawAxis = function(context, custom_options) {
    const a = {...default_options, ...custom_options}
    const s = 5;

    const end_point = Math.max(2, a.my * a.yrange[1] + a.sy);
    const start_point = Math.min(context.canvas.height, a.my * a.yrange[0] + a.sy)

    context.strokeStyle = "#000";
    context.beginPath();
    context.moveTo(0, a.sy);
    context.lineTo(-2 + context.canvas.width, a.sy);
    context.lineTo(-2 + context.canvas.width - s, a.sy - s);
    context.moveTo(-2 + context.canvas.width, a.sy);
    context.lineTo(-2 + context.canvas.width - s, a.sy + s);
    

    context.moveTo(a.sx, start_point);
    context.lineTo(a.sx, end_point);
    context.lineTo(a.sx - s, end_point + s);
    context.moveTo(a.sx, end_point);
    context.lineTo(a.sx + s, end_point + s);

    context.stroke();
}

var calculate_ticks = function(n, x1, x2) {
    var initial_step_size = (x2 - x1) / n;
    var order_normalizer = Math.pow(10, 1-Math.round(Math.log10(initial_step_size)));
    var round_step_size = Math.round(initial_step_size * order_normalizer) / order_normalizer;
    var first_tick = Math.round(x1 * order_normalizer) / order_normalizer;

    return [first_tick, round_step_size];
}

var drawXTicks = function(context, custom_options) {
    const a = {...default_options, ...custom_options}
    const s = 5;

    var n = a.n_xticks;
    var [x1, x2] = a.xrange;
    const [first_tick, round_step_size] = calculate_ticks(n, x1, x2);
    
    context.strokeStyle = "#000";
    context.beginPath();
    for (var i = 0; i < n; i++) {
        const x = first_tick + i * round_step_size;
        if (Math.abs(x) < 1e-6) {
            continue;
        }
        context.moveTo(a.mx * x + a.sx, a.sy + s);
        context.lineTo(a.mx * x + a.sx, a.sy - s);
        context.fillText(x.toFixed(1), a.mx * x + a.sx, a.sy + 15)
    }
    context.stroke();
}

var drawLogXTicks = function(context, custom_options) {
    const a = {...default_options, ...custom_options}
    const s = 5;

    var n = a.n_xticks;
    var [x1, x2] = a.xrange;
    var e1 = Math.log10(x1);
    var e2 = Math.log10(x2);
    const [first_tick, round_step_size] = calculate_ticks(n, e1, e2);
    
    context.strokeStyle = "#000";
    context.beginPath();
    for (var i = 0; i < n; i++) {
        const x = i * round_step_size;
        if (Math.abs(x) < 1e-6) {
            continue;
        }
        context.moveTo(a.mx * x + a.sx, a.sy + s);
        context.lineTo(a.mx * x + a.sx, a.sy - s);
        context.fillText(Math.pow(10.0, x).toFixed(1), a.mx * x + a.sx, a.sy + 15)
    }
    context.stroke();
}


var drawYTicks = function(context, custom_options) {
    const a = {...default_options, ...custom_options}
    const s = 5;

    var n = a.n_yticks;
    var [y1, y2] = a.yrange;
    const [first_tick, round_step_size] = calculate_ticks(n, y1, y2);
    
    context.textAlign = "right";
    context.strokeStyle = "#000";
    context.beginPath();
    for (var i = 0; i < n; i++) {
        const y = first_tick + i * round_step_size;
        if (Math.abs(y) < 1e-6) {
            continue;
        }
        context.moveTo(a.sx + s, a.my * y + a.sy);
        context.lineTo(a.sx - s, a.my * y + a.sy);
        context.fillText(y.toFixed(1), a.sx - 10, a.my * y + a.sy)
    }
    context.stroke();
    context.textAlign = "center";
}

var drawXGrid = function(context, custom_options) {
    const a = {...default_options, ...custom_options}

    var n = a.n_xticks;
    var [x1, x2] = a.xrange;
    const [first_tick, round_step_size] = calculate_ticks(n, x1, x2);
    const n_grid_conservative = a.n_gpt_x * a.n_xticks;

    context.strokeStyle = "#ccc";
    context.lineWidth = 1;
    context.beginPath();
    for (var i = -n_grid_conservative; i <= n_grid_conservative; i++) {
        const x = first_tick + i * round_step_size / a.n_gpt_x;
        if (x < x1) {
            continue;
        } else if (x > x2) {
            break;
        }
        context.moveTo(a.mx * x + a.sx, 0);
        context.lineTo(a.mx * x + a.sx, context.canvas.height);
    }
    context.stroke();
    context.lineWidth = 3;
}

var drawYGrid = function(context, custom_options) {
    const a = {...default_options, ...custom_options}

    var n = a.n_yticks;
    var [y1, y2] = a.yrange;
    const [first_tick, round_step_size] = calculate_ticks(n, y1, y2);
    const n_grid_conservative = a.n_gpt_y * a.n_yticks;

    context.strokeStyle = "#ccc";
    context.lineWidth = 1;
    context.beginPath();
    for (var i = -n_grid_conservative; i <= n_grid_conservative; i++) {
        const y = first_tick + i * round_step_size / a.n_gpt_y;
        if (y < y1) {
            continue;
        } else if (y > y2) {
            break;
        }
        context.moveTo(0, a.my * y + a.sy);
        context.lineTo(context.canvas.width, a.my * y + a.sy);
    }
    context.stroke();
    context.lineWidth = 3;
}

var drawGrid = function(context, custom_options) {
    drawXGrid(context, custom_options);
    drawYGrid(context, custom_options);
}

var drawYLabel = function(context, custom_options) {
    const a = {...default_options, ...custom_options}
    const end_point = Math.max(2, a.my * a.yrange[1] + a.sy);
    const start_point = Math.min(context.canvas.height, a.my * a.yrange[0] + a.sy)
    context.textAlign = "left";
    context.textBaseline = 'top';
    context.fillText(custom_options.ylabel, a.sx + 15, end_point + 5)
    context.textAlign = "center";
    context.textBaseline = 'middle';
}

var drawXLabel = function(context, custom_options) {
    const a = {...default_options, ...custom_options}
    const start_point = Math.max(2, a.mx * a.xrange[0] + a.sx);
    const end_point = Math.min(context.canvas.width, a.mx * a.xrange[1] + a.sx)
    context.textAlign = "right";
    context.textBaseline = 'bottom';
    context.fillText(custom_options.xlabel, end_point - 5, a.sy - 15)
    context.textAlign = "center";
    context.textBaseline = 'middle';
}


export {drawAxis, drawXTicks, drawYTicks, drawGrid, drawXGrid, drawYGrid, drawXLabel, drawYLabel, drawLogXTicks};