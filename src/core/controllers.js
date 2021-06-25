import {closed_loop_tf, chain_tfs} from './tf_ops';

import {LOCAL} from '../local';

const controllers = [
    {
        key: 'p',
        name: LOCAL('Propotional'),
        info: 'feedback: 1, C: kp',
        params: [
            {key: 'kp', name: 'K_p', min: 0, max: 20, default: 1},
        ],
        tf_system: (p, tf_plant) => closed_loop_tf(chain_tfs([[p.kp], [1]], tf_plant), [[1], [1]]),
        tf_openloop: (p, tf_plant) => chain_tfs([[p.kp], [1]], tf_plant),
    },
    {
        key: 'pi',
        name: LOCAL('PI'),
        info: 'feedback: 1, C: kp + ki/s',
        params: [
            {key: 'kp', name: 'K_p', min: 0, max: 20, default: 1},
            {key: 'ki', name: 'K_i', min: 0, max: 20, default: 1},
        ],
        tf_system: (p, tf_plant) => closed_loop_tf(chain_tfs([[p.kp, p.ki], [1, 0]], tf_plant), [[1], [1]]),
        tf_openloop: (p, tf_plant) => chain_tfs([[p.kp, p.ki], [1, 0]], tf_plant),
    },
    {
        key: 'pid',
        name: LOCAL('PID'),
        info: 'feedback: 1, C: kp + ki/s + kds',
        params: [
            {key: 'kp', name: 'K_p', min: 0, max: 20, default: 1},
            {key: 'ki', name: 'K_i', min: 0, max: 20, default: 1},
            {key: 'kd', name: 'K_d', min: 0, max: 10, default: 0},
        ],
        tf_system: (p, tf_plant) => closed_loop_tf(chain_tfs([[p.kd, p.kp, p.ki], [1, 0]], tf_plant), [[1], [1]]),
        tf_openloop: (p, tf_plant) => chain_tfs([[p.kd, p.kp, p.ki], [1, 0]], tf_plant),
    },
    {
        key: 'lead',
        name: LOCAL('Lead'),
        info: 'feedback: 1, C: kc * (s + 1/T) / (s + 1/aT)',
        params: [
            {key: 'kc', name: 'K_c', min: 0, max: 20, default: 1},
            {key: 'T_lead', name: '\\tau', min: 0, max: 2, default: 3},
            {key: 'a', name: '\\alpha', min: 0, max: 1, default: 0.5},
        ],
        tf_system: (p, tf_plant) => closed_loop_tf(chain_tfs([[p.kc, p.kc / p.T_lead], [1, 1/(p.a * p.T_lead)]], tf_plant), [[1], [1]]),
        tf_openloop: (p, tf_plant) => chain_tfs([[p.kc, p.kc / p.T_lead], [1, 1/(p.a * p.T_lead)]], tf_plant),
    },
    {
        key: 'lag',
        name: LOCAL('Lag'),
        info: 'feedback: 1, C: kc * (s + 1/T) / (s + 1/bT)',
        params: [
            {key: 'kc', name: 'K_c', min: 0, max: 20, default: 1},
            {key: 'T_lag', name: '\\tau', min: 0, max: 2, default: 3},
            {key: 'b', name: '\\beta', min: 1, max: 20, default: 2},
        ],
        tf_system: (p, tf_plant) => closed_loop_tf(chain_tfs([[p.kc, p.kc / p.T_lag], [1, 1/(p.b * p.T_lag)]], tf_plant), [[1], [1]]),
        tf_openloop: (p, tf_plant) => chain_tfs([[p.kc, p.kc / p.T_lag], [1, 1/(p.b * p.T_lag)]], tf_plant),
    },
    {
        key: 'leadlag',
        name: LOCAL('Lead-lag'),
        info: 'feedback: 1, C: C_lead + C_lag',
        params: [
            {key: 'kc', name: 'K_c', min: 0, max: 20, default: 1},
            {key: 'T_lead', name: '\\tau_{lead}', min: 0, max: 2, default: 3},
            {key: 'a', name: '\\alpha', min: 0, max: 1, default: 0.5},
            {key: 'T_lag', name: '\\tau_{lag}', min: 0, max: 2, default: 3},
            {key: 'b', name: '\\beta', min: 1, max: 20, default: 2},
        ],
        tf_system: (p, tf_plant) =>
            closed_loop_tf(
                chain_tfs(
                    chain_tfs(
                        [[p.kc, p.kc / p.T_lead], [1, 1/(p.a * p.T_lead)]],
                        [[p.kc, p.kc / p.T_lag], [1, 1/(p.b * p.T_lag)]]
                    ),
                    tf_plant
                ),
                [[1], [1]]
            ),
        tf_openloop: (p, tf_plant) => 
            chain_tfs(
                chain_tfs(
                    [[p.kc, p.kc / p.T_lead], [1, 1/(p.a * p.T_lead)]],
                    [[p.kc, p.kc / p.T_lag], [1, 1/(p.b * p.T_lag)]]
                ),
                tf_plant
            ),
    },
    {
        key: 'gain',
        name: LOCAL('Non-unity Feedback'),
        info: 'feedback: k',
        params: [
            {key: 'k', name: 'K', min: 0, max: 10, default: 1},
        ],
        tf_system: (p, tf_plant) => closed_loop_tf(tf_plant, [[p.k], [1]]),
        tf_openloop: (p, tf_plant) => chain_tfs(tf_plant, [[p.k], [1]]),
    },
]

export default controllers;