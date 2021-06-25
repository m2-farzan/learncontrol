#![allow(non_snake_case)]

use wasm_bindgen::prelude::*;
use ndarray::prelude::*;
use ndarray_stats::QuantileExt;
use rustnomial::{Polynomial};
use num::complex::{Complex};

// #[wasm_bindgen]
// pub struct StepResponseResult {
//     y: Vec<f64>,
//     pub maximum_overshoot: f64,
//     pub risetime: f64,
//     pub settling_time: f64,
// }

// #[wasm_bindgen]
// impl StepResponseResult {
//     #[wasm_bindgen(getter)]
//     pub fn y(&self) -> Vec<f64> {
//         return self.y.clone();
//     }
// }

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn sin(u: f64) -> f64
{
    return 5.0 + u;
}

#[wasm_bindgen]
pub fn step_response(num: Vec<f64>, dem: Vec<f64>, dt: f64, n_steps: usize) -> Vec<f64>
{
    let y = transient_response(num, dem, |_t| 1.0, dt, n_steps);
    let (maximum_overshoot, risetime, settling_time) = step_response_analysis(&y, dt);
    // Nasty code alert:
    // rustwasm has bad support for complex types. I could return a struct but that
    // required using wasm-bindgen getters & setters feature, which added a clone
    // operation overhead. So I'm just appending `maximum_overshoot, risetime, settling_time`
    // at the tail of the y(t) array.
    let mut result = y.to_vec();
    result.push(maximum_overshoot);
    result.push(risetime);
    result.push(settling_time);

    return result;
}

#[wasm_bindgen]
pub fn ramp_response(num: Vec<f64>, dem: Vec<f64>) -> Vec<f64>
{
    return transient_response(num, dem, |t| t, 0.01, 1000).to_vec();
}

fn step_response_analysis(y: &Array1::<f64>, dt: f64) -> (f64, f64, f64) {
    let n_iters = y.shape()[0];

    let lim = y[n_iters - 1];

    let mut maximum_overshoot = match y.max() {
        Ok(value) => *value,
        Err(_error) => -1.0
    };
    if maximum_overshoot < lim {
        maximum_overshoot = -1.0;
    } else {
        maximum_overshoot = 100.0 * (maximum_overshoot / lim - 1.0);
    }
    
    // rise time (95% of lim)
    let mut risetime = -1.0;
    for i in 0..n_iters {
        if y[i] > 0.95 * lim {
            risetime = dt * (i as f64);
            break;
        }
    }

    // staying in 5% band of lim
    let mut settling_time = -1.0;
    if y[n_iters - 1] < 1.05 * lim && y[n_iters - 1] > 0.95 * lim {
        for i in (0..n_iters).rev() {
            if y[i] > 1.05 * lim || y[i] < 0.95 * lim {
                settling_time = dt * (i as f64);
                break;
            }
        }
    }
    
    return (maximum_overshoot, risetime, settling_time);
}

fn transient_response(num: Vec<f64>, dem: Vec<f64>, u: fn(f64)->f64, dt: f64, n_steps: usize) -> Array1::<f64>
{
    let (A, B, C, D, n) = tf2ss(num, dem);

    // variables
    let mut x = Array1::<f64>::zeros(n); // state
    let mut Y = Array1::<f64>::zeros(n_steps); // output array

    // Run Simulation
    for i in 0..n_steps {
        let t = dt * (i as f64);
        // explicit:
        // let xdot = A.dot(&x) + (&B * u(t));
        // x += &(xdot * dt);
        // rk4:
        // let xdot_functor = |t_: f64, x_: &Array1::<f64>| A.dot(x_) + (&B * u(t_));
        let xdot_functor = |t_: f64, x_: &Array1::<f64>| A.dot(x_) + (&B * u(t_));
        x = rk4(x, xdot_functor, t, dt);
        Y[i] = C.dot(&x) + D * u(t);
    }

    return Y;
}

type V = Array1::<f64>;
fn rk4<Functor>(y: V, f: Functor, t:f64, h: f64) -> V where Functor: Fn(f64, &V) -> V
{
    // See https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
    let k1 = f(t, &y);
    let k2 = f(t + h / 2.0, &(&y + &(h * &k1 / 2.0)));
    let k3 = f(t + h / 2.0, &(&y + &(h * &k2 / 2.0)));
    let k4 = f(t + h, &(&y + &(h * &k3)));
    return y + h * (1.0 / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4);
}

fn _explicit<Functor>(y: V, f: Functor, t:f64, h: f64) -> V where Functor: Fn(f64, &V) -> V
{
    return &y + &(f(t, &y) * h);
}

fn tf2ss(num: Vec<f64>, dem: Vec<f64>) -> (Array2::<f64>, Array1::<f64>, Array1::<f64>, f64, usize)
{
    // see https://lpsa.swarthmore.edu/Representations/SysRepTransformations/TF2SS.html

    let (n, b, a) = normalize_num_dem(num, dem);
    
    let mut A = Array2::<f64>::zeros((n, n));
    for i in 0..n-1 {
        A[[i, i+1]] = 1.0;
    }
    for i in 0..n {
        A[[n - 1, i]] = -a[n - i];
    }

    let mut B = Array1::<f64>::zeros(n);
    B[n - 1] = 1.0;

    let mut C = Array1::<f64>::zeros(n);
    for i in 0..n {
        C[i] = b[n - i] - b[0] * a[n - i];
    }

    let D = b[0];

    return (A, B, C, D, n);
}

fn normalize_num_dem(num: Vec<f64>, dem: Vec<f64>) -> (usize, Array1::<f64>, Array1::<f64>)
{
    // assert
    assert!(num.len() <= dem.len());

    // pad num and dem
    // for now get in the form of:
    // b0 * s^n + b1 * s^{n-1} + ... + bn * 1
    // ---------------------------------------
    // a0 * s^n + a1 * s^{n-1} + ... + an * 1
    // let mut a = Array1::<f64>::from_vec(dem);
    let mut a = arr1(&dem);
    let n = a.len() - 1;
    let mut b = Array1::<f64>::zeros(n + 1);
    for i in 0..num.len() {
        b[i + (n + 1 - num.len())] = num[i];
    }

    // normalize
    // get in the form of:
    // b0 * s^n + b1 * s^{n-1} + ... + bn * 1
    // ---------------------------------------
    //  1 * s^n + a1 * s^{n-1} + ... + an * 1
    // i.e. a[0] = 1
    b /= a[0];
    a /= a[0];

    return (n, b, a);
}

#[wasm_bindgen]
pub fn roots(coeffs: Vec<f64>) -> Vec<f64>
{
    let poly = Polynomial::<f64>::new(coeffs);

    return match poly.roots() {
        rustnomial::Roots::OneRealRoot(a) => vec![a, 0.0],
        rustnomial::Roots::TwoRealRoots(a, b) => vec![a, 0.0, b, 0.0],
        rustnomial::Roots::ThreeRealRoots(a, b, c) => vec![a, 0.0, b, 0.0, c, 0.0],
        rustnomial::Roots::OnlyRealRoots(v) | rustnomial::Roots::ManyRealRoots(v) => {
            let mut r = vec![];
            for v_ in v {
                r.push(v_);
                r.push(0.0);
            }
            return r;
        },
        rustnomial::Roots::OneComplexRoot(a) => vec![a.re, a.im],
        rustnomial::Roots::TwoComplexRoots(a, b) => vec![a.re, a.im, b.re, b.im],
        rustnomial::Roots::ThreeComplexRoots(a, b, c) => vec![a.re, a.im, b.re, b.im, c.re, c.im],
        rustnomial::Roots::ManyComplexRoots(v) => {
            let mut r = vec![];
            for v_ in v {
                r.push(v_.re);
                r.push(v_.im);
            }
            return r;
        },
        _ => vec![],
    };
}

#[wasm_bindgen]
pub fn bode(num: Vec<f64>, dem: Vec<f64>, omega_0: f64, omega_1: f64, n_steps: usize) -> Vec<f64>
{
    let mut r = Array1::<f64>::zeros(2 * n_steps); // r[0:n_steps] = mags, r[n_steps:2*n_steps] = phases

    for i in 0..n_steps {
        let exponent = omega_0.log10() + (omega_1.log10() - omega_0.log10()) * (i as f64) / (n_steps as f64);
        let omega = (10.0 as f64).powf(exponent);
        let jw = Complex::<f64>::new(0.0, omega);
        
        let mut num_val = Complex::<f64>::new(0.0, 0.0);
        let n_num = num.len();
        for i in 0..n_num {
            num_val += jw.powi((n_num - i - 1) as i32).scale(num[i]);
        }

        let mut dem_val = Complex::<f64>::new(0.0, 0.0);
        let n_dem = dem.len();
        for i in 0..n_dem {
            dem_val += jw.powi((n_dem - i - 1) as i32).scale(dem[i]);
        }

        let tf_val = num_val / dem_val;
        r[i] = 10.0 * tf_val.norm().log10();
        if i == 0 {
            r[n_steps + i] = tf_val.arg() * 180.0 / 3.141592;
        } else {
            r[n_steps + i] = keep_phase_continuous( tf_val.arg() * 180.0 / 3.141592, r[n_steps + i - 1] );
        }
    }
    return r.to_vec();
}

fn keep_phase_continuous(phase: f64, adj_phase: f64) -> f64
{
    let d = 0.9 * (phase - adj_phase).abs(); // tend to keep original
    let downstep_d = (phase - 360.0 - adj_phase).abs();
    let upstep_d = (phase + 360.0 - adj_phase).abs();
    if downstep_d < d && downstep_d < upstep_d
    {
        return phase - 360.0;
    }
    else if upstep_d < d && upstep_d < downstep_d
    {
        return phase + 360.0;
    }
    return phase;
}