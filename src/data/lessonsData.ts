import { Lesson } from '../types/physics';

export const LESSONS_DATA: Lesson[] = [
  {
    id: 'lesson-projectile',
    unitId: 'unit-1',
    unitTitle: 'Unit 1: Kinematics & 2D Motion',
    title: 'Projectile Motion & Parabolic Trajectories',
    level: 'High School',
    readTime: '8 min',
    summary: 'Master the independence of horizontal and vertical motions under constant gravitational acceleration.',
    sections: [
      {
        heading: '1. The Core Principle: Independence of Orthogonal Motions',
        content:
          'In projectile motion neglecting air resistance, an object experiences acceleration ONLY in the vertical direction (downward at g = 9.8 m/s²). The horizontal component has zero acceleration (ax = 0), meaning horizontal velocity remains constant throughout the entire flight.',
        formula: 'v_x = v_0 \\cos(\\theta), \\quad v_y = v_0 \\sin(\\theta) - gt',
        variables: [
          { symbol: 'v_0', name: 'Initial launch velocity', unit: 'm/s' },
          { symbol: '\\theta', name: 'Launch angle above horizontal', unit: 'degrees' },
          { symbol: 'g', name: 'Acceleration due to gravity', unit: 'm/s² (9.8 on Earth)' },
        ],
      },
      {
        heading: '2. Maximum Height & Flight Time',
        content:
          'At the apex (peak of the trajectory), the vertical velocity momentarily reaches exactly zero (v_y = 0). This allows us to calculate the time to the apex, t_apex = (v_0 * sin(theta)) / g. For symmetric ground-to-ground flight, total time is exactly double this value.',
        formula: 'H_{max} = \\frac{(v_0 \\sin\\theta)^2}{2g}, \\quad T_{flight} = \\frac{2 v_0 \\sin\\theta}{g}',
      },
      {
        heading: '3. Horizontal Range & Optimal Launch Angle',
        content:
          'The horizontal distance traveled before impact is the Range (R). Applying the trigonometric identity 2 sin(theta) cos(theta) = sin(2*theta), the range equation shows that for any given speed on level ground, maximum range occurs at theta = 45°. Complementary angles (such as 30° and 60°) achieve the exact same range, though 60° reaches higher and takes longer.',
        formula: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
      },
    ],
    sirFawwadTip:
      "Sir Fawwad's Golden Rule: NEVER mix vertical and horizontal components in the same kinematic equation! Time (t) is the only scalar bridge connecting both dimensions. Solve for t in one axis, then plug it into the other.",
    commonPitfalls: [
      'Assuming acceleration is zero at the peak of trajectory (g is still 9.8 m/s² downwards!).',
      'Forgetting that horizontal velocity remains non-zero at the highest point (vx = v0 * cos θ).',
      'Using the level range equation R = (v0² sin 2θ)/g when the projectile is launched from a cliff or elevated platform.',
    ],
    relatedLabId: 'projectile',
    calculator: {
      type: 'projectile',
      title: 'Interactive Trajectory Calculator',
      description: 'Adjust velocity, launch angle, and celestial gravity to predict range, apex, and hang time.',
    },
    checkUnderstanding: {
      question:
        'A cannonball is fired at 20 m/s at an angle of 30° above the horizontal on level ground (g = 9.8 m/s²). What is its vertical velocity at the highest point of its flight?',
      options: ['10 m/s', '17.3 m/s', '0 m/s', '9.8 m/s'],
      correctAnswer: 2,
      explanation:
        'Correct! At the very peak of the parabolic trajectory, the vertical component of velocity vy momentarily equals 0 m/s, while vx remains 20 * cos(30°) ≈ 17.3 m/s.',
    },
  },
  {
    id: 'lesson-optics',
    unitId: 'unit-2',
    unitTitle: 'Unit 2: Geometric & Wave Optics',
    title: "Refraction, Snell's Law & Total Internal Reflection",
    level: 'High School',
    readTime: '10 min',
    summary: "Discover why light bends across optical boundaries and how fiber optics utilize total internal reflection.",
    sections: [
      {
        heading: '1. What is Optical Density & Refractive Index?',
        content:
          'When light enters a medium with a different optical density, its wave speed changes according to v = c / n, where c is the speed of light in vacuum (3.0 × 10⁸ m/s) and n is the refractive index of the medium. The frequency f remains constant, which means the wavelength changes proportionately.',
        formula: 'n = \\frac{c}{v}, \\quad \\lambda_2 = \\frac{\\lambda_1}{n}',
        variables: [
          { symbol: 'n', name: 'Index of refraction (dimensionless)', unit: 'n ≥ 1.0' },
          { symbol: 'c', name: 'Speed of light in vacuum', unit: '3.0 × 10⁸ m/s' },
          { symbol: 'v', name: 'Speed of light in medium', unit: 'm/s' },
        ],
      },
      {
        heading: "2. Snell's Law of Refraction",
        content:
          'Snell’s Law quantifies the relationship between the angle of incidence (θ₁) and the angle of refraction (θ₂), both measured from the normal line perpendicular to the surface interface. When entering a denser medium (n₂ > n₁), the light ray bends TOWARDS the normal.',
        formula: 'n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)',
      },
      {
        heading: '3. Total Internal Reflection & Critical Angle',
        content:
          'When light travels from an optically denser medium to a rarer medium (n₁ > n₂), the refracted ray bends away from the normal. As the angle of incidence increases, θ₂ reaches 90°. The incident angle causing θ₂ = 90° is the Critical Angle (θ_c). If θ₁ > θ_c, 100% of the light is reflected internally with zero light refracted.',
        formula: '\\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)',
      },
    ],
    sirFawwadTip:
      "Sir Fawwad's Pro Tip: Always measure angles from the NORMAL (the 90° dotted perpendicular line to the boundary), never from the glass surface! Exam boards intentionally draw angles relative to the boundary to trick students.",
    commonPitfalls: [
      'Trying to calculate critical angle when light goes from a less dense to a more dense medium (TIR is only possible from denser to rarer medium!).',
      'Forgetting that frequency of light never changes when passing across different media.',
    ],
    relatedLabId: 'optics',
    calculator: {
      type: 'snell',
      title: "Snell's Law & Critical Angle Calculator",
      description: 'Compute refracted angles and determine whether total internal reflection occurs.',
    },
    checkUnderstanding: {
      question:
        'Light travels from crown glass (n = 1.52) into air (n = 1.00). What is the approximate critical angle for total internal reflection?',
      options: ['41.1°', '48.8°', '33.2°', '60.0°'],
      correctAnswer: 0,
      explanation:
        'Correct! θ_c = arcsin(1.00 / 1.52) = arcsin(0.6579) ≈ 41.1°. Any angle of incidence in glass greater than 41.1° will produce total internal reflection.',
    },
  },
  {
    id: 'lesson-pendulum',
    unitId: 'unit-3',
    unitTitle: 'Unit 3: Oscillations & Simple Harmonic Motion',
    title: 'Simple Pendulum & Mechanical Energy Conservation',
    level: 'High School',
    readTime: '7 min',
    summary: 'Analyze harmonic oscillation, restorative gravitational force, and the interplay between kinetic and potential energy.',
    sections: [
      {
        heading: '1. Condition for Simple Harmonic Motion (SHM)',
        content:
          'A simple pendulum consists of a point mass m suspended by a massless, unstretchable string of length L. For small angles of displacement (θ < 15°), the restoring force F = -mg sin(θ) ≈ -mg(x/L), which is directly proportional to displacement and directed toward the equilibrium point.',
        formula: 'F_{restoring} = -mg \\sin(\\theta) \\approx -\\left(\\frac{mg}{L}\\right) x',
      },
      {
        heading: '2. Period of Oscillation',
        content:
          'Remarkably, for small amplitudes, the period of a simple pendulum is completely INDEPENDENT of the mass of the bob and independent of amplitude! The period depends solely on length L and the local acceleration due to gravity g.',
        formula: 'T = 2\\pi \\sqrt{\\frac{L}{g}}, \\quad f = \\frac{1}{T} = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{L}}',
        variables: [
          { symbol: 'T', name: 'Period of one full oscillation', unit: 'seconds (s)' },
          { symbol: 'L', name: 'Length of suspension string', unit: 'meters (m)' },
          { symbol: 'g', name: 'Local gravitational acceleration', unit: 'm/s²' },
        ],
      },
      {
        heading: '3. Energy Conservation in SHM',
        content:
          'At maximum displacement (amplitude A), velocity is zero, so all mechanical energy is stored as Gravitational Potential Energy (PE = mgh). As the bob sweeps through the equilibrium center (h = 0), potential energy transforms entirely into Kinetic Energy (KE = 0.5 * m * v_max²). Assuming no friction, total mechanical energy E = KE + PE remains strictly constant.',
        formula: 'E_{total} = \\frac{1}{2}mv^2 + mgh = \\text{constant}',
      },
    ],
    sirFawwadTip:
      "Sir Fawwad's Pro Tip: If a test asks 'What happens to the period of a clock pendulum if you replace a 50g bob with a 200g brass bob?', the answer is: NO CHANGE! Mass cancels out because gravitational force and inertia scale equally.",
    commonPitfalls: [
      'Assuming the period depends on the mass of the bob.',
      'Applying T = 2π√(L/g) for large angles like 80° where the small-angle approximation sin(θ) ≈ θ breaks down.',
    ],
    relatedLabId: 'pendulum',
    calculator: {
      type: 'pendulum',
      title: 'Pendulum Period & Gravity Solver',
      description: 'Calculate period and frequency on Earth, Moon, Mars, and Jupiter.',
    },
    checkUnderstanding: {
      question:
        'A pendulum has a period of 2.0 seconds on Earth. If taken to the Moon where gravity is 1/6th of Earth’s, how does the period change?',
      options: [
        'It increases by a factor of √6 (becomes ~4.9s)',
        'It decreases to 2.0 / 6 = 0.33s',
        'It remains unchanged at 2.0s',
        'It increases to 12.0 seconds',
      ],
      correctAnswer: 0,
      explanation:
        'Correct! Since T = 2π√(L/g), period is inversely proportional to √g. When g becomes g/6, T becomes T * √6 ≈ 2.0 * 2.45 ≈ 4.9 seconds.',
    },
  },
  {
    id: 'lesson-lorentz',
    unitId: 'unit-4',
    unitTitle: 'Unit 4: Electromagnetism & Magnetic Fields',
    title: 'Lorentz Force & Motion of Charges in Magnetic Fields',
    level: 'AP / Honors',
    readTime: '9 min',
    summary: 'Explore magnetic deflection, cyclotron radius, and the right-hand rule for moving charges.',
    sections: [
      {
        heading: '1. The Magnetic Lorentz Force',
        content:
          'A stationary electric charge in a magnetic field experiences NO magnetic force. However, when a charge q moves with velocity v through a magnetic field B, it experiences a magnetic force given by the vector cross product F = q(v × B).',
        formula: 'F_B = |q| v B \\sin(\\theta)',
        variables: [
          { symbol: 'q', name: 'Electric charge', unit: 'Coulombs (C)' },
          { symbol: 'v', name: 'Velocity of particle', unit: 'm/s' },
          { symbol: 'B', name: 'Magnetic flux density', unit: 'Tesla (T)' },
          { symbol: '\\theta', name: 'Angle between velocity and B-field', unit: 'degrees' },
        ],
      },
      {
        heading: '2. The Right-Hand Rule & Circular Trajectories',
        content:
          'Because the magnetic force is always perpendicular to both velocity and the magnetic field vector (F ⊥ v and F ⊥ B), the magnetic force does ZERO work on the particle! It changes only the DIRECTION of motion, acting as a centripetal force that causes uniform circular motion.',
        formula: 'F_{centripetal} = \\frac{m v^2}{r} = q v B \\implies r = \\frac{m v}{q B}',
      },
      {
        heading: '3. Helical Motion & Practical Applications',
        content:
          'If the charged particle enters the magnetic field at an oblique angle (0 < θ < 90°), the component of velocity parallel to B (v_parallel = v cos θ) remains unaffected, while the perpendicular component (v_perp = v sin θ) drives circular motion. The resulting 3D path is a beautiful helix/spiral, which explains the Earth’s Van Allen radiation belts and northern aurora lights.',
      },
    ],
    sirFawwadTip:
      "Sir Fawwad's Pro Tip: The magnetic force can NEVER change the kinetic energy or speed of a charged particle—it only bends its path! If an exam question asks 'How much work was done by the magnetic field on the electron?', the answer is always 0 Joules.",
    commonPitfalls: [
      'Applying the right-hand rule directly to negative charges (electrons) without reversing the resulting force direction.',
      'Assuming magnetic fields accelerate charges in the direction of field lines (electric fields do, magnetic fields exert perpendicular forces!).',
    ],
    relatedLabId: 'lorentz',
    calculator: {
      type: 'energy',
      title: 'Cyclotron Orbit & Kinetic Energy Solver',
      description: 'Compute circular orbit radius and momentum for electrons and protons.',
    },
    checkUnderstanding: {
      question:
        'An electron moves with velocity 2.0 × 10⁶ m/s perpendicular to a uniform magnetic field of 0.05 T. How much work is done by the magnetic field on the electron after one complete revolution?',
      options: ['0 Joules', '1.6 × 10⁻¹⁴ Joules', '3.2 × 10⁻¹⁹ Joules', 'Depends on radius'],
      correctAnswer: 0,
      explanation:
        'Correct! Because the magnetic Lorentz force is always perpendicular to instantaneous displacement (F ⊥ v), the dot product F · d = 0, so the work done is strictly 0 Joules.',
    },
  },
];
