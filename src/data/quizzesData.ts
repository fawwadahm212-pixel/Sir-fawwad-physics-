import { QuizCategory, QuizQuestion } from '../types/physics';

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'quiz-kinematics',
    title: 'Kinematics & 2D Projectiles',
    description: 'Test your understanding of trajectory parameters, apex conditions, velocity vectors, and independence of motion.',
    questionCount: 5,
    timeLimitMinutes: 10,
    badge: 'Mechanics',
  },
  {
    id: 'quiz-optics',
    title: 'Optics, Refraction & Snell’s Law',
    description: 'Calculate refractive indices, critical angles for total internal reflection, and ray behavior through prisms.',
    questionCount: 5,
    timeLimitMinutes: 10,
    badge: 'Waves & Optics',
  },
  {
    id: 'quiz-energy-shm',
    title: 'Work, Energy & Harmonic Oscillations',
    description: 'Solve energy conservation problems, pendulum periods, spring constants, and small-angle approximations.',
    questionCount: 5,
    timeLimitMinutes: 10,
    badge: 'Oscillations',
  },
  {
    id: 'quiz-em',
    title: 'Electromagnetism & Lorentz Deflection',
    description: 'Master the right-hand rule, cyclotron radius calculations, magnetic flux, and work done by B-fields.',
    questionCount: 5,
    timeLimitMinutes: 10,
    badge: 'Electromagnetism',
  },
  {
    id: 'quiz-comprehensive',
    title: 'Sir Fawwad Full Physics Board Exam',
    description: 'The ultimate high school physics review test spanning kinematics, dynamics, optics, electromagnetism, and energy.',
    questionCount: 10,
    timeLimitMinutes: 20,
    badge: 'Comprehensive Exam',
  },
];

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  'quiz-kinematics': [
    {
      id: 'k1',
      unit: 'Kinematics',
      topic: 'Projectile Range',
      difficulty: 'Easy',
      question:
        'A soccer ball is kicked from ground level at 20 m/s at an angle of 45° to the horizontal on level ground. Taking g = 10 m/s², what is the horizontal range of the ball?',
      options: ['20 m', '40 m', '80 m', '28.3 m'],
      correctIndex: 1,
      explanation:
        'Using the range formula: R = (v₀² * sin(2θ)) / g. With θ = 45°, 2θ = 90° and sin(90°) = 1. Therefore, R = (20² * 1) / 10 = 400 / 10 = 40 meters.',
      formulaUsed: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
      hint: 'Remember that sin(2 * 45°) = sin(90°) = 1.',
    },
    {
      id: 'k2',
      unit: 'Kinematics',
      topic: 'Time of Flight',
      difficulty: 'Medium',
      question:
        'An arrow is launched with an initial velocity of 50 m/s at an angle of 30° above the horizontal. How long is the arrow in the air before landing at the same elevation? (Use g = 9.8 m/s²)',
      options: ['2.55 s', '5.10 s', '8.84 s', '10.20 s'],
      correctIndex: 1,
      explanation:
        'Initial vertical velocity: v₀y = v₀ * sin(30°) = 50 * 0.5 = 25 m/s. Total time of flight T = (2 * v₀y) / g = (2 * 25) / 9.8 = 50 / 9.8 ≈ 5.10 seconds.',
      formulaUsed: 'T = \\frac{2 v_0 \\sin\\theta}{g}',
      hint: 'First find the initial vertical velocity component v₀y = v₀ sin(θ).',
    },
    {
      id: 'k3',
      unit: 'Kinematics',
      topic: 'Maximum Height',
      difficulty: 'Medium',
      question:
        'A tennis ball is hit upward with initial speed 30 m/s at an angle of 60°. What maximum height above the launch point does it achieve? (g = 9.8 m/s²)',
      options: ['45.9 m', '34.4 m', '22.9 m', '15.3 m'],
      correctIndex: 1,
      explanation:
        'Vertical component v₀y = 30 * sin(60°) = 30 * 0.8660 = 25.98 m/s. Max height H = (v₀y²) / (2g) = (25.98)² / (2 * 9.8) = 675 / 19.6 ≈ 34.44 meters.',
      formulaUsed: 'H = \\frac{(v_0 \\sin\\theta)^2}{2g}',
      hint: 'At maximum height, the vertical velocity component is zero.',
    },
    {
      id: 'k4',
      unit: 'Kinematics',
      topic: 'Complementary Angles',
      difficulty: 'Easy',
      question:
        'Two projectiles are launched with the same initial speed v₀ on flat terrain. One is launched at 35°. Which of the following launch angles will achieve the exact same horizontal range?',
      options: ['55°', '70°', '45°', '17.5°'],
      correctIndex: 0,
      explanation:
        'Since sin(2 * θ) = sin(180° - 2θ) = sin(2 * (90° - θ)), any two launch angles that add up to 90° (complementary angles) will produce identical ranges. 90° - 35° = 55°.',
      formulaUsed: 'R(\\theta) = R(90^\\circ - \\theta)',
      hint: 'Look for the angle complementary to 35°.',
    },
    {
      id: 'k5',
      unit: 'Kinematics',
      topic: 'Velocity at Peak',
      difficulty: 'Challenging',
      question:
        'A projectile is fired at speed v₀ = 40 m/s at an angle θ = 60°. What is its total speed at the instant it reaches maximum altitude?',
      options: ['0 m/s', '20 m/s', '34.6 m/s', '40 m/s'],
      correctIndex: 1,
      explanation:
        'At the apex, vertical velocity vy = 0. However, the horizontal velocity vx is unaffected by gravity and remains vx = v₀ * cos(60°) = 40 * 0.5 = 20 m/s. Hence total speed at apex is 20 m/s.',
      formulaUsed: 'v_{peak} = v_x = v_0 \\cos\\theta',
      hint: 'Does horizontal velocity ever change in ideal projectile motion?',
    },
  ],
  'quiz-optics': [
    {
      id: 'o1',
      unit: 'Optics',
      topic: 'Snell’s Law',
      difficulty: 'Easy',
      question:
        'A light beam passes from air (n₁ = 1.00) into water (n₂ = 1.33) at an angle of incidence of 30°. What is the angle of refraction in the water?',
      options: ['22.1°', '41.7°', '30.0°', '19.5°'],
      correctIndex: 0,
      explanation:
        'By Snell\'s Law: n₁ sin(θ₁) = n₂ sin(θ₂). Therefore, 1.00 * sin(30°) = 1.33 * sin(θ₂). 0.50 / 1.33 = sin(θ₂) ≈ 0.3759. θ₂ = arcsin(0.3759) ≈ 22.08° ≈ 22.1°.',
      formulaUsed: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2',
      hint: 'Substitute n₁=1.00, θ₁=30°, and n₂=1.33 into Snell\'s law.',
    },
    {
      id: 'o2',
      unit: 'Optics',
      topic: 'Critical Angle & TIR',
      difficulty: 'Medium',
      question:
        'Light travels from flint glass (refractive index n = 1.66) toward an air boundary (n = 1.00). What is the critical angle for total internal reflection?',
      options: ['37.0°', '41.8°', '53.0°', '48.6°'],
      correctIndex: 0,
      explanation:
        'The critical angle θc satisfies sin(θc) = n₂ / n₁ = 1.00 / 1.66 ≈ 0.6024. Taking arcsin(0.6024) gives θc ≈ 37.04° ≈ 37.0°.',
      formulaUsed: '\\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)',
      hint: 'sin(θc) = n_rarer / n_denser.',
    },
    {
      id: 'o3',
      unit: 'Optics',
      topic: 'Speed of Light in Media',
      difficulty: 'Easy',
      question:
        'If the speed of light in vacuum is 3.0 × 10⁸ m/s, what is the speed of light inside diamond with an index of refraction n = 2.42?',
      options: ['1.24 × 10⁸ m/s', '7.26 × 10⁸ m/s', '2.42 × 10⁸ m/s', '1.85 × 10⁸ m/s'],
      correctIndex: 0,
      explanation:
        'v = c / n = (3.0 × 10⁸ m/s) / 2.42 ≈ 1.2396 × 10⁸ m/s ≈ 1.24 × 10⁸ m/s.',
      formulaUsed: 'v = \\frac{c}{n}',
      hint: 'The refractive index represents how many times slower light travels compared to vacuum.',
    },
    {
      id: 'o4',
      unit: 'Optics',
      topic: 'Wavelength & Frequency',
      difficulty: 'Medium',
      question:
        'When monochromatic green light (λ = 532 nm in vacuum) enters a glass prism with n = 1.50, what happens to its frequency and wavelength?',
      options: [
        'Frequency remains unchanged; wavelength decreases to ~355 nm',
        'Frequency decreases; wavelength remains 532 nm',
        'Both frequency and wavelength decrease by a factor of 1.50',
        'Frequency increases; wavelength decreases',
      ],
      correctIndex: 0,
      explanation:
        'Frequency is determined solely by the emitting source and does not change across medium boundaries. Since v = f * λ and v decreases by factor n, λ_glass = λ_vacuum / n = 532 / 1.50 ≈ 354.7 nm.',
      formulaUsed: '\\lambda_n = \\frac{\\lambda_0}{n}, \\quad f = \\text{constant}',
      hint: 'The source oscillator determines the number of wave crests per second.',
    },
    {
      id: 'o5',
      unit: 'Optics',
      topic: 'Total Internal Reflection Application',
      difficulty: 'Challenging',
      question:
        'An optical fiber has a core of refractive index n_core = 1.55 and a cladding of n_cladding = 1.40. What is the minimum angle of incidence at the core-cladding boundary for total internal reflection to occur?',
      options: ['64.6°', '40.2°', '25.4°', '50.1°'],
      correctIndex: 0,
      explanation:
        'Total internal reflection occurs when the incident angle exceeds the critical angle: θ_c = arcsin(n_cladding / n_core) = arcsin(1.40 / 1.55) = arcsin(0.9032) ≈ 64.58° ≈ 64.6°.',
      formulaUsed: '\\theta_c = \\arcsin(n_2 / n_1)',
      hint: 'For TIR to occur inside the core, the angle with the boundary normal must be greater than or equal to arcsin(n_cladding / n_core).',
    },
  ],
  'quiz-energy-shm': [
    {
      id: 'e1',
      unit: 'Oscillations',
      topic: 'Simple Pendulum Period',
      difficulty: 'Easy',
      question:
        'A simple pendulum has a string of length L = 0.98 m on Earth (g = 9.8 m/s²). What is its period of oscillation?',
      options: ['1.99 s', '0.50 s', '3.14 s', '1.00 s'],
      correctIndex: 0,
      explanation:
        'T = 2π * √(L / g) = 2π * √(0.98 / 9.8) = 2π * √(0.10) = 2 * 3.14159 * 0.3162 ≈ 1.987 s ≈ 1.99 s.',
      formulaUsed: 'T = 2\\pi \\sqrt{\\frac{L}{g}}',
      hint: 'Calculate √(L/g) first, then multiply by 2π.',
    },
    {
      id: 'e2',
      unit: 'Energy',
      topic: 'Energy Conservation in Pendulum',
      difficulty: 'Medium',
      question:
        'A pendulum bob of mass 0.5 kg is pulled back until it is 0.20 m above its lowest point, then released from rest. Neglecting air drag, what is its speed as it passes through the lowest point? (g = 9.8 m/s²)',
      options: ['1.98 m/s', '3.92 m/s', '0.99 m/s', '2.80 m/s'],
      correctIndex: 0,
      explanation:
        'By conservation of mechanical energy: PE_initial = KE_bottom => mgh = 0.5 * m * v² => v = √(2gh) = √(2 * 9.8 * 0.20) = √(3.92) ≈ 1.98 m/s.',
      formulaUsed: 'v = \\sqrt{2gh}',
      hint: 'Mass cancels out: v = √(2gh).',
    },
    {
      id: 'e3',
      unit: 'Oscillations',
      topic: 'Length Scaling',
      difficulty: 'Medium',
      question:
        'To double the period of a simple pendulum from 1.0 second to 2.0 seconds, by what factor must you increase the length of the string?',
      options: ['4 times', '2 times', '√2 times', '8 times'],
      correctIndex: 0,
      explanation:
        'Since T ∝ √L, squaring both sides yields L ∝ T². To double the period (T\' = 2T), the length must be increased by 2² = 4 times.',
      formulaUsed: 'L \\propto T^2',
      hint: 'If T doubles, what happens to L under the square root?',
    },
    {
      id: 'e4',
      unit: 'Energy',
      topic: 'Work-Energy Theorem',
      difficulty: 'Challenging',
      question:
        'A 2.0 kg block slides down a frictionless incline from a vertical height of 5.0 meters. What is the total mechanical energy of the block relative to the bottom? (g = 9.8 m/s²)',
      options: ['98 Joules', '49 Joules', '196 Joules', '10 Joules'],
      correctIndex: 0,
      explanation:
        'Total mechanical energy E = PE = mgh = 2.0 kg * 9.8 m/s² * 5.0 m = 98 Joules. Since the plane is frictionless, this 98 J is conserved throughout the descent.',
      formulaUsed: 'E = mgh',
      hint: 'Total mechanical energy equals potential energy at the top.',
    },
    {
      id: 'e5',
      unit: 'Oscillations',
      topic: 'Restoring Force',
      difficulty: 'Easy',
      question:
        'At which point in a simple pendulum’s swing is the tangential restoring force at its maximum?',
      options: [
        'At the points of maximum amplitude',
        'At the lowest equilibrium point',
        'Halfway between equilibrium and maximum displacement',
        'The restoring force is constant everywhere',
      ],
      correctIndex: 0,
      explanation:
        'The restoring force F = -mg sin(θ). This is maximized when displacement angle θ is at its maximum (the endpoints or amplitude). At the bottom (θ = 0), the restoring force is 0.',
      formulaUsed: 'F_{restoring} = mg \\sin\\theta',
      hint: 'Where is the displacement angle θ largest?',
    },
  ],
  'quiz-em': [
    {
      id: 'em1',
      unit: 'Electromagnetism',
      topic: 'Lorentz Force Magnitude',
      difficulty: 'Easy',
      question:
        'A proton (q = +1.6 × 10⁻¹⁹ C) enters a uniform magnetic field of 0.40 T at a speed of 3.0 × 10⁶ m/s perpendicular to the field. What is the magnetic force acting on the proton?',
      options: ['1.92 × 10⁻¹³ N', '4.80 × 10⁻¹³ N', '0 N', '9.60 × 10⁻¹⁴ N'],
      correctIndex: 0,
      explanation:
        'F = q * v * B * sin(90°) = (1.6 × 10⁻¹⁹ C) * (3.0 × 10⁶ m/s) * 0.40 T * 1 = 1.92 × 10⁻¹³ N.',
      formulaUsed: 'F = q v B \\sin\\theta',
      hint: 'Since velocity is perpendicular to B, sin(90°) = 1.',
    },
    {
      id: 'em2',
      unit: 'Electromagnetism',
      topic: 'Work by Magnetic Field',
      difficulty: 'Easy',
      question:
        'A charged particle moves in a circle within a uniform magnetic field for 10 revolutions. How much work is done by the magnetic field on the particle?',
      options: ['0 Joules', 'q * v * B * 20πr', '0.5 * m * v²', 'Depends on the charge magnitude'],
      correctIndex: 0,
      explanation:
        'The magnetic force is always perpendicular to the particle’s velocity (F ⊥ v). Because displacement is along the direction of velocity, the angle between force and displacement is always 90°. Since cos(90°) = 0, work W = F · d = 0 Joules.',
      formulaUsed: 'W = \\vec{F} \\cdot \\vec{d} = F d \\cos(90^\\circ) = 0',
      hint: 'Recall the definition of mechanical work: W = F d cos(θ).',
    },
    {
      id: 'em3',
      unit: 'Electromagnetism',
      topic: 'Cyclotron Orbit Radius',
      difficulty: 'Medium',
      question:
        'An electron (mass = 9.11 × 10⁻³¹ kg, charge = 1.6 × 10⁻¹⁹ C) moves at 2.0 × 10⁷ m/s perpendicular to a magnetic field of 0.02 T. What is the radius of its circular orbit?',
      options: ['5.69 mm', '1.14 cm', '2.85 mm', '0.57 m'],
      correctIndex: 0,
      explanation:
        'r = (m * v) / (q * B) = (9.11 × 10⁻³¹ * 2.0 × 10⁷) / (1.6 × 10⁻¹⁹ * 0.02) = (1.822 × 10⁻²³) / (3.2 × 10⁻²¹) ≈ 5.69 × 10⁻³ m = 5.69 mm.',
      formulaUsed: 'r = \\frac{mv}{qB}',
      hint: 'Set magnetic force equal to centripetal force: qvB = mv²/r.',
    },
    {
      id: 'em4',
      unit: 'Electromagnetism',
      topic: 'Right-Hand Rule',
      difficulty: 'Medium',
      question:
        'An electron travels eastward into a region where the magnetic field points vertically upward out of the ground. In which direction is the initial magnetic force on the electron?',
      options: ['South', 'North', 'West', 'East'],
      correctIndex: 0,
      explanation:
        'Using the right-hand rule for a positive charge: thumb points east (v), fingers point upward (B), palm pushes North. However, since an electron has a NEGATIVE charge (q < 0), the actual force direction is reversed: toward the South.',
      formulaUsed: '\\vec{F} = q(\\vec{v} \\times \\vec{B})',
      hint: 'Remember that an electron is negatively charged, so invert the right-hand rule direction.',
    },
    {
      id: 'em5',
      unit: 'Electromagnetism',
      topic: 'Helical Path Condition',
      difficulty: 'Challenging',
      question:
        'Under what condition will a charged particle in a uniform magnetic field follow a helical (spiral) trajectory instead of a circle or straight line?',
      options: [
        'When its velocity vector makes an angle strictly between 0° and 90° with the magnetic field lines',
        'When the magnetic field is alternating at 60 Hz',
        'When the particle has zero charge',
        'When the speed of the particle exceeds the speed of sound',
      ],
      correctIndex: 0,
      explanation:
        'A helix results when the velocity has both a parallel component (v_parallel = v cos θ) which causes constant linear drift, and a perpendicular component (v_perp = v sin θ) which causes circular motion. This occurs when 0° < θ < 90°.',
      formulaUsed: 'v_\\parallel = v\\cos\\theta, \\quad v_\\perp = v\\sin\\theta',
      hint: 'The particle needs both a circular motion component and a forward drift component.',
    },
  ],
  'quiz-comprehensive': [
    {
      id: 'c1',
      unit: 'Kinematics',
      topic: 'Projectile Velocity',
      difficulty: 'Medium',
      question:
        'A projectile is launched from ground level with speed 25 m/s at 53.13° (cos ≈ 0.60, sin ≈ 0.80). What is its velocity vector (vx, vy) after 1.0 second? (Use g = 9.8 m/s²)',
      options: ['(15 m/s, 10.2 m/s)', '(20 m/s, 10.2 m/s)', '(15 m/s, 20 m/s)', '(10.2 m/s, 15 m/s)'],
      correctIndex: 0,
      explanation:
        'vx = v₀ cos(θ) = 25 * 0.60 = 15.0 m/s (remains constant). vy(t) = v₀ sin(θ) - gt = 25 * 0.80 - 9.8 * 1.0 = 20.0 - 9.8 = 10.2 m/s. Therefore (vx, vy) = (15 m/s, 10.2 m/s).',
      formulaUsed: 'v_x = v_0 \\cos\\theta, \\quad v_y = v_0 \\sin\\theta - gt',
      hint: 'Horizontal velocity is constant; vertical velocity decreases by 9.8 m/s every second.',
    },
    {
      id: 'c2',
      unit: 'Optics',
      topic: 'Total Internal Reflection Condition',
      difficulty: 'Easy',
      question:
        'Under which of the following conditions can Total Internal Reflection (TIR) occur?',
      options: [
        'Light travels from an optically denser medium into a rarer medium, with incident angle greater than the critical angle',
        'Light travels from air into glass at an angle greater than 45°',
        'Light travels from a rarer medium into a denser medium at normal incidence',
        'Whenever light passes through a convex glass lens',
      ],
      correctIndex: 0,
      explanation:
        'TIR requires two mandatory conditions: (1) Light must travel from a higher refractive index medium to a lower refractive index medium (n₁ > n₂), and (2) The angle of incidence must exceed the critical angle (θ₁ > θc).',
      hint: 'Light must be bending away from the normal, which only happens going into a less dense medium.',
    },
    {
      id: 'c3',
      unit: 'Oscillations',
      topic: 'Pendulum on Different Planets',
      difficulty: 'Medium',
      question:
        'A pendulum clock keeps accurate time on Earth where g = 9.8 m/s². If moved to Mars where g = 3.7 m/s², the clock will:',
      options: ['Run slower (period increases)', 'Run faster (period decreases)', 'Keep the exact same time', 'Stop completely'],
      correctIndex: 0,
      explanation:
        'Since T = 2π√(L/g), a smaller gravitational acceleration g results in a larger period T. Each swing takes longer, so the clock ticks slower and loses time.',
      formulaUsed: 'T = 2\\pi \\sqrt{\\frac{L}{g}}',
      hint: 'Check what happens to period T when g decreases.',
    },
    {
      id: 'c4',
      unit: 'Electromagnetism',
      topic: 'Lorentz Force on Neutral Particles',
      difficulty: 'Easy',
      question:
        'A neutron (charge q = 0) travels at 5.0 × 10⁶ m/s straight through a powerful 2.0 T magnetic field. What magnetic force does it experience?',
      options: ['0 N', '1.6 × 10⁻¹² N', '10⁷ N', '9.8 N'],
      correctIndex: 0,
      explanation:
        'F = q(v × B). Since a neutron has electric charge q = 0, the magnetic force is strictly 0 Newtons regardless of speed or field strength.',
      formulaUsed: 'F = q v B \\sin\\theta',
      hint: 'What is the net electric charge of a neutron?',
    },
    {
      id: 'c5',
      unit: 'Kinematics',
      topic: 'Independence of Motion',
      difficulty: 'Medium',
      question:
        'A hunter aims a tranquilizer dart rifle directly at a monkey hanging from a tree branch. The moment the dart leaves the barrel, the monkey lets go and falls freely. Assuming no air resistance:',
      options: [
        'The dart will hit the monkey regardless of launch speed (as long as it reaches before the monkey hits the ground)',
        'The dart will pass over the monkey',
        'The dart will pass under the monkey',
        'The dart only hits if fired at precisely 9.8 m/s',
      ],
      correctIndex: 0,
      explanation:
        'Both the dart and the monkey experience the exact same downward gravitational acceleration g. Relative to a line of sight, both fall by 0.5*g*t² in time t. Hence the dart will strike the monkey!',
      formulaUsed: '\\Delta y = \\frac{1}{2} g t^2',
      hint: 'Both monkey and projectile fall vertically at the exact same rate: 0.5*g*t².',
    },
    {
      id: 'c6',
      unit: 'Optics',
      topic: 'Snell’s Law Calculation',
      difficulty: 'Challenging',
      question:
        'A ray of light in air strikes an unknown transparent slab at an angle of incidence of 45°. The measured angle of refraction is 30°. What is the refractive index of the slab?',
      options: ['1.414 (√2)', '1.500', '1.732 (√3)', '1.333'],
      correctIndex: 0,
      explanation:
        'n₁ sin(θ₁) = n₂ sin(θ₂). (1.00) * sin(45°) = n₂ * sin(30°). (√2 / 2) = n₂ * (1 / 2) => n₂ = √2 ≈ 1.414.',
      formulaUsed: 'n_2 = n_1 \\frac{\\sin\\theta_1}{\\sin\\theta_2}',
      hint: 'sin(45°) = √2 / 2 and sin(30°) = 1 / 2.',
    },
    {
      id: 'c7',
      unit: 'Energy',
      topic: 'Kinetic & Potential Energy',
      difficulty: 'Medium',
      question:
        'A 0.2 kg pendulum bob is released from a height of 0.45 m above its resting point. What is its kinetic energy as it passes through the bottom of the swing? (g = 9.8 m/s²)',
      options: ['0.882 Joules', '1.764 Joules', '0.441 Joules', '4.41 Joules'],
      correctIndex: 0,
      explanation:
        'By conservation of energy, KE_bottom = PE_top = mgh = 0.2 kg * 9.8 m/s² * 0.45 m = 0.882 Joules.',
      formulaUsed: 'KE = mgh',
      hint: 'All initial gravitational potential energy converts to kinetic energy at the bottom.',
    },
    {
      id: 'c8',
      unit: 'Electromagnetism',
      topic: 'Mass Spectrometer Principle',
      difficulty: 'Challenging',
      question:
        'Two singly-charged positive ions (q₁ = q₂ = +e) are injected with identical velocity v into a uniform magnetic field B. Ion A has twice the mass of Ion B (m_A = 2 m_B). How do their orbit radii compare?',
      options: [
        'Radius of Ion A is twice that of Ion B (r_A = 2 r_B)',
        'Radius of Ion A is half that of Ion B (r_A = 0.5 r_B)',
        'Radius of Ion A is four times that of Ion B',
        'Both have the same radius',
      ],
      correctIndex: 0,
      explanation:
        'Since r = (m * v) / (q * B), orbit radius is directly proportional to mass (r ∝ m) for identical velocity, charge, and B-field. Therefore r_A / r_B = m_A / m_B = 2.',
      formulaUsed: 'r = \\frac{mv}{qB}',
      hint: 'Look at the relationship between mass m and radius r in r = mv / (qB).',
    },
    {
      id: 'c9',
      unit: 'Kinematics',
      topic: 'Optimal Angle with Elevation',
      difficulty: 'Challenging',
      question:
        'When launching a projectile from a 50-meter-high cliff above flat ground, to maximize horizontal range, the optimal launch angle should be:',
      options: ['Slightly less than 45°', 'Exactly 45°', 'Slightly greater than 45°', 'Exactly 90°'],
      correctIndex: 0,
      explanation:
        'When launching from an elevated position, gravity provides extra flight time during the fall below launch height. Spending more initial velocity on the horizontal component (vx) yields greater range, so the optimal angle is less than 45° (typically 35°–42° depending on cliff height).',
      hint: 'The projectile already has bonus hang-time because it falls below the launch plane.',
    },
    {
      id: 'c10',
      unit: 'Optics',
      topic: 'Dispersion in Prisms',
      difficulty: 'Easy',
      question:
        'When white light passes through a glass triangular prism, which color of visible light undergoes the greatest deviation (bends the most)?',
      options: ['Violet light', 'Red light', 'Green light', 'Yellow light'],
      correctIndex: 0,
      explanation:
        'In normal dispersion, refractive index increases with higher frequency / shorter wavelength (n_violet > n_red). Because violet has the highest refractive index in glass, it bends the most according to Snell\'s law.',
      formulaUsed: 'n(\\lambda) \\text{ is larger for shorter } \\lambda',
      hint: 'Remember ROYGBIV: Violet has the shortest wavelength and highest frequency.',
    },
  ],
};
