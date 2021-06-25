import {poly_mul} from './tf_ops';

import {LOCAL} from '../local';

const plants = [
    {
        key: 'first_order',
        name: LOCAL('First Order'),
        info: 'a / (s+a)',
        params: [
            {key: 'a', name: 'a', min: -0.5, max: 10, default: 3},
        ],
        tf: (p) => [[p.a], [1, p.a]],
    },
    {
        key: 'first_order_with_gain',
        name: LOCAL('First Order with Gain'),
        info: 'k / (s+a)',
        params: [
            {key: 'a', name: 'a', min: -0.5, max: 5, default: 3},
            {key: 'k', name: 'k', min: -2, max: 5, default: 1},
        ],
        tf: (p) => [[p.k], [1, p.a]],
    },
    {
        key: 'first_order_with_zero',
        name: LOCAL('First Order with Zero'),
        info: '(s+b) / (s+a)',
        params: [
            {key: 'b', name: 'b', min: 0, max: 10, default: 3},
            {key: 'a', name: 'a', min: -1, max: 10, default: 3},
        ],
        tf: (p) => [[1, p.b], [1, p.a]],
    },
    {
        key: 'integrator',
        name: LOCAL('Integrator'),
        info: 'k / s',
        params: [
            {key: 'k', name: 'k', min: 0, max: 2, default: 1},
        ],
        tf: (p) => [[p.k], [1, 0]],
    },
    {
        key: 'second_order',
        name: LOCAL('Second Order'),
        info: 'k*omega_n^2 / s^2 + 2*zeta*omega_n*s + omega_n^2',
        params: [
            {key: 'omega_n', name: '\\omega_n', min: 0, max: 10, default: 3},
            {key: 'zeta', name: '\\zeta', min: 0, max: 2, default: 0.4},
            {key: 'k', name: 'k', min: 0, max: 2, default: 1},
        ],
        tf: (p) => [[p.k * Math.pow(p.omega_n, 2.0)], [1, 2 * p.zeta * p.omega_n, Math.pow(p.omega_n, 2.0)]],
    },
    {
        key: 'second_order_with_zero',
        name: LOCAL('Second Order with Zero'),
        info: '(s + b) / s^2 + 2*zeta*omega_n*s + omega_n^2',
        params: [
            {key: 'omega_n', name: '\\omega_n', min: 0, max: 10, default: 3},
            {key: 'zeta', name: '\\zeta', min: 0, max: 2, default: 0.4},
            {key: 'b', name: 'b', min: -1, max: 20, default: 1},
        ],
        tf: (p) => [[1, p.b], [1, 2 * p.zeta * p.omega_n, Math.pow(p.omega_n, 2.0)]],
    },
    {
        key: 'third_order',
        name: LOCAL('Third Order'),
        info: 'k*alpha*omega_n^2 / [(s+a) * (s^2 + 2*zeta*omega_n*s + omega_n^2)]',
        params: [
            {key: 'alpha', name: '\\alpha', min: 0, max: 10, default: 6},
            {key: 'omega_n', name: '\\omega_n', min: 0, max: 10, default: 3},
            {key: 'zeta', name: '\\zeta', min: 0, max: 2, default: 0.4},
            {key: 'k', name: 'k', min: 0, max: 2, default: 1},
        ],
        tf: (p) => [[p.k * p.alpha * Math.pow(p.omega_n, 2.0)],
            poly_mul([1, p.alpha], [1, 2 * p.zeta * p.omega_n, Math.pow(p.omega_n, 2.0)])],
    },
    {
        key: 'mass_spring',
        name: LOCAL('Mass-spring'),
        info: 'mx.. + cx. + kx = u',
        params: [
            {key: 'm', name: 'm', min: 0, max: 10, default: 6},
            {key: 'c_damper', name: 'c', min: 0, max: 10, default: 3},
            {key: 'k_spring', name: 'k', min: 0, max: 10, default: 3},
        ],
        tf: (p) => [[1], [p.m, p.c_damper, p.k_spring]],
    },
    {
        key: 'pendulum',
        name: LOCAL('Pendulum (Linear Approx.)'),
        info: 'mr^2 theta.. + mgr theta = u',
        params: [
            {key: 'm', name: 'm', min: 0, max: 10, default: 6},
            {key: 'r', name: 'r', min: 0, max: 10, default: 3},
            {key: 'g', name: 'g', min: 0, max: 20, default: 9.81},
        ],
        tf: (p) => [[1], [p.m * p.r * p.r, 0.0, p.m * p.g * p.r]],
    },
    {
        key: 'reverse_pendulum',
        name: LOCAL('Reverse Pendulum (Linear Approx.)'),
        info: 'mr^2 theta.. - mgr theta = u',
        params: [
            {key: 'm', name: 'm', min: 0, max: 10, default: 6},
            {key: 'r', name: 'r', min: 0, max: 10, default: 3},
            {key: 'g', name: 'g', min: 0, max: 20, default: 9.81},
        ],
        tf: (p) => [[1], [p.m * p.r * p.r, 0.0, -p.m * p.g * p.r]],
    },
]

export default plants;