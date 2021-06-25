/*
            G
CLTF = -----------
        1 + G * H


let: G = b / a
     H = d / c

                  b/a
CLTF = ----------------------------
          1 + (b * d) / (a * c)

              b * c
     = ---------------------
           a * c + b * d
*/

const closed_loop_tf = function (G, H) {
    const b = G[0];
    const a = G[1];
    const d = H[0];
    const c = H[1];
    return [
        poly_mul(b, c),
        poly_add(poly_mul(a, c), poly_mul(b, d))
    ];
}

const chain_tfs = function(G, H) {
    const b = G[0];
    const a = G[1];
    const d = H[0];
    const c = H[1];
    return [
        poly_mul(b, d),
        poly_mul(a, c)
    ];
}

const poly_add = function(a, b) {
    const na = a.length;
    const nb = b.length;
    const nc = Math.max(na, nb);
    var c = new Array(nc).fill(0);
    for (var i = 0; i < nc; i++) {
        if (i >= nc - na) {
            c[i] += a[i - (nc - na)];
        }
        if (i >= nc - nb) {
            c[i] += b[i - (nc - nb)];
        }
    }
    return c;
}

const poly_mul = function(a, b) {
    const na = a.length;
    const nb = b.length;
    const nc = na + nb - 1;
    var c = new Array(nc).fill(0);
    for (var i = 0; i < na; i++) {
        for (var j = 0; j < nb; j++) {
            c[i + j] += a[i] * b[j];
        }
    }
    return c;
}

export {closed_loop_tf, chain_tfs, poly_add, poly_mul};