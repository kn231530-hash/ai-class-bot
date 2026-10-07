import { Lesson, Persona, DrillScenario } from '../types';

export const PERSONAS: Persona[] = [
  {
    id: 'nova',
    name: 'Nova',
    title: 'Principal Neural Architect',
    specialty: 'System Latency & Transformer Topology',
    avatarSeed: 'nova',
    voiceGender: 'female',
    voicePitch: 1.05,
    voiceRate: 1.0,
    systemPrompt: 'You are Nova, Principal Neural Architect at Synthetix. You communicate with concise authority, crisp technical precision, and strategic clarity.',
    tagColor: '#06B6D4',
    description: 'Expert in LLM internal mechanisms, hardware kernels, and high-throughput deployment architectures.'
  },
  {
    id: 'astraea',
    name: 'Astraea',
    title: 'Quantum & Algorithmic Lead',
    specialty: 'Manifold Geometry & Attention Math',
    avatarSeed: 'astraea',
    voiceGender: 'female',
    voicePitch: 1.15,
    voiceRate: 0.95,
    systemPrompt: 'You are Astraea, Quantum & Algorithmic Lead. You break down complex tensor algebra and high-dimensional vector spaces into intuitive mental models.',
    tagColor: '#8B5CF6',
    description: 'Specializes in high-dimensional representations, semantic geometry, and mathematical foundations.'
  },
  {
    id: 'cipher',
    name: 'Cipher',
    title: 'Autonomous Red Team Lead',
    specialty: 'Adversarial Defense & Jailbreak Forensics',
    avatarSeed: 'cipher',
    voiceGender: 'male',
    voicePitch: 0.9,
    voiceRate: 1.05,
    systemPrompt: 'You are Cipher, Autonomous Red Team Lead. You are sharp, vigilant, pragmatic, and specialize in adversarial robustness and containment.',
    tagColor: '#10B981',
    description: 'Focused on model alignment defense, prompt injection vectors, and autonomous safety boundaries.'
  },
  {
    id: 'lyra',
    name: 'Lyra',
    title: 'Cognitive Neuro-Engineering Tutor',
    specialty: 'Accelerated Learning & Mental Frameworks',
    avatarSeed: 'lyra',
    voiceGender: 'female',
    voicePitch: 1.0,
    voiceRate: 1.0,
    systemPrompt: 'You are Lyra, Cognitive Neuro-Engineering Tutor. You inspire confidence and accelerate deep conceptual comprehension using active voice recall.',
    tagColor: '#F59E0B',
    description: 'Transforms dense research literature into actionable mental models with active Socratic voice drills.'
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    tierId: 1,
    tierName: 'Tier 1: Foundational Neural Mechanics',
    title: 'Multi-Head Attention Geometry & QKV Projections',
    shortDesc: 'Dissect Query, Key, and Value affine transformations and geometric subspace orthogonality.',
    estimatedMinutes: 8,
    progressPercent: 100,
    isCompleted: true,
    xpReward: 320,
    category: 'Mechanics',
    audioDuration: '04:45',
    summary: 'Attention is fundamentally a soft retrieval operation over high-dimensional vector subspaces. Understand how multiple heads partition representation space.',
    fullContent: [
      'In standard dot-product attention, queries (Q) and keys (K) define continuous addressing over the memory values (V). Multi-head attention projects inputs into D_k dimensional subspaces, allowing the model to jointly attend to information from different representation subspaces at different positions.',
      'Mathematically, Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V. Scaling by sqrt(d_k) prevents dot products from growing excessively large in magnitude, which would push softmax gradients into vanishingly small plateaus.',
      'Orthogonal projections across distinct attention heads ensure diverse inductive biases: syntactic binding, positional referencing, and semantic cross-referencing coexist simultaneously across identical token sequences.'
    ],
    checklist: [
      { id: 'c1', text: 'Derive the scaling factor 1/√d_k variance normalization', completed: true },
      { id: 'c2', text: 'Contrast self-attention versus cross-attention tensor shapes', completed: true },
      { id: 'c3', text: 'Analyze subspace collapse prevention in modern architectures', completed: true }
    ],
    quiz: {
      id: 'q1',
      question: 'Why is the dot-product scaled by 1/√d_k before applying the Softmax operation?',
      options: [
        'To speed up GPU matrix multiplier clock cycles',
        'To prevent large dot products from pushing softmax into vanishing gradients',
        'To enforce strict unitary matrix constraints on Key vectors',
        'To reduce RAM footprint in dynamic KV-Cache allocation'
      ],
      correctIndex: 1,
      explanation: 'For large values of d_k, the dot products grow large in magnitude, driving the softmax function into regions with extremely small gradients. Dividing by √d_k counters this effect.'
    },
    tags: ['Transformer', 'Tensors', 'Softmax']
  },
  {
    id: 'lesson-2',
    tierId: 1,
    tierName: 'Tier 1: Foundational Neural Mechanics',
    title: 'Transformer Latent Manifolds & Residual Streams',
    shortDesc: 'Understand the residual stream as an additive shared communication bus across layer depths.',
    estimatedMinutes: 12,
    progressPercent: 75,
    isCompleted: false,
    xpReward: 450,
    category: 'Mechanics',
    audioDuration: '06:12',
    summary: 'Rather than treating layers as sequential state mutations, view the residual stream as an accumulation bus where attention heads read and write features.',
    fullContent: [
      'The modern mechanistic interpretability lens treats the residual stream as an additive communication bus. Layers do not overwrite representation; they compute residual delta vectors and add them to the stream: x_{l+1} = x_l + Attention(x_l) + MLP(x_l).',
      'This additive design prevents vanishing gradients and allows earlier layers to pass unchanged tokens directly to upper layers, or selectively inject high-level semantic tags into specific subspace dimensions.',
      'By probing orthogonal directions in the latent manifold, we can isolate distinct concept vectors (e.g. sentiment polarity, programming language syntax, factual assertions) and manipulate them with precision steering vectors.'
    ],
    checklist: [
      { id: 'c4', text: 'Map the additive residual accumulation equation x_{l+1} = x_l + f(x_l)', completed: true },
      { id: 'c5', text: 'Explore concept activation vectors via linear probe projections', completed: true },
      { id: 'c6', text: 'Conduct an activation steering drill in Voice Studio', completed: false }
    ],
    quiz: {
      id: 'q2',
      question: 'What is the structural consequence of the additive residual stream in transformers?',
      options: [
        'Each layer destroys previous token representations irrevocably',
        'Layers act as read-write heads over a shared additive feature bus',
        'Weight matrices must always be diagonal symmetric',
        'Quantization cannot be applied to feed-forward blocks'
      ],
      correctIndex: 1,
      explanation: 'Because layer outputs are added to the existing state rather than replacing it, layers function like modular readers and writers along a continuous residual bus.'
    },
    tags: ['Residual Stream', 'Interpretability', 'Manifolds']
  },
  {
    id: 'lesson-3',
    tierId: 1,
    tierName: 'Tier 1: Foundational Neural Mechanics',
    title: 'KV-Cache Memory Dynamics & Paged Attention',
    shortDesc: 'Eliminate redundant recomputation during auto-regressive decoding using contiguous paging.',
    estimatedMinutes: 10,
    progressPercent: 40,
    isCompleted: false,
    xpReward: 380,
    category: 'Optimization',
    audioDuration: '05:30',
    summary: 'During generation, past Key and Value matrices are cached to prevent O(N²) quadratic re-computation. Learn how PagedAttention solves internal GPU fragmentation.',
    fullContent: [
      'During autoregressive generation, generating each new token only requires computing the Query vector for the current step; Keys and Values of all prior tokens can be re-used from memory: the KV Cache.',
      'Traditional KV caches reserve contiguous virtual memory upfront, causing up to 60-80% memory waste through internal fragmentation and over-reservation for maximum sequence lengths.',
      'PagedAttention draws inspiration from OS virtual memory paging, partitioning keys and values into fixed-size physical blocks. This enables dynamic non-contiguous allocation and shared prompt prefix caching across parallel inference requests.'
    ],
    checklist: [
      { id: 'c7', text: 'Calculate KV-Cache memory footprint: 2 * 2 * n_layers * n_heads * d_k * seq_len bytes', completed: true },
      { id: 'c8', text: 'Examine page table translation overhead versus throughput gains', completed: false },
      { id: 'c9', text: 'Analyze multi-query (MQA) versus grouped-query (GQA) cache compression', completed: false }
    ],
    quiz: {
      id: 'q3',
      question: 'What is the primary memory saving of Grouped-Query Attention (GQA) over Multi-Head Attention (MHA)?',
      options: [
        'It halves the vocabulary size in tokenization',
        'Multiple query heads share a single key/value head, reducing KV-cache RAM usage',
        'It eliminates activation storage during backward passes',
        'It converts floating point weights to 1-bit ternary states'
      ],
      correctIndex: 1,
      explanation: 'GQA allows a group of query heads to share a single key-value head, drastically diminishing the KV-cache memory bandwidth and capacity footprint while maintaining near-MHA quality.'
    },
    tags: ['KV-Cache', 'PagedAttention', 'Hardware']
  },
  {
    id: 'lesson-4',
    tierId: 2,
    tierName: 'Tier 2: Synthetic Reasoning & Autonomous Agents',
    title: 'Chain-of-Thought Distillation & Verification Loops',
    shortDesc: 'Engineer reliable test-time compute scaling and self-verifying tree searches.',
    estimatedMinutes: 15,
    progressPercent: 20,
    isCompleted: false,
    xpReward: 520,
    category: 'Reasoning',
    audioDuration: '07:15',
    summary: 'Test-time compute scaling unlocks higher intelligence frontiers by allowing models to explore verification pathways before committing to final output tokens.',
    fullContent: [
      'Chain-of-thought (CoT) prompting demonstrates that autoregressive token generation can serve as an external working memory scratchpad. When paired with trained process reward models (PRMs), systems can verify each reasoning step individually.',
      'Search algorithms such as Monte Carlo Tree Search (MCTS) or Best-of-N sampling explore alternative hypothesis branches, pruning non-viable deductive paths early.',
      'Distillation contracts dense reasoning traces into compact student checkpoints, transferring multi-step deduction capabilities into smaller, lower-latency real-time agents.'
    ],
    checklist: [
      { id: 'c10', text: 'Compare Outcome Reward Models (ORMs) vs Process Reward Models (PRMs)', completed: true },
      { id: 'c11', text: 'Simulate a multi-path backtrack tree in Voice Drill Lab', completed: false },
      { id: 'c12', text: 'Verify step-level reflection tokens and stopping heuristics', completed: false }
    ],
    tags: ['CoT', 'PRM', 'Search', 'Agents']
  },
  {
    id: 'lesson-5',
    tierId: 2,
    tierName: 'Tier 2: Synthetic Reasoning & Autonomous Agents',
    title: 'Multi-Agent Tool-Grounding & Dynamic Routing',
    shortDesc: 'Orchestrate distributed swarms of specialized cognitive workers with deterministic protocols.',
    estimatedMinutes: 14,
    progressPercent: 0,
    isCompleted: false,
    xpReward: 580,
    category: 'Agents',
    audioDuration: '08:00',
    summary: 'Single monolithic prompts break down under multi-modal tool calling complexity. Build robust agent topologies with semantic routers and stateful consensus.',
    fullContent: [
      'Effective agent architectures decouple high-level planning from mechanical task execution. A supervisor agent generates a dependency graph, which specialized domain agents execute asynchronously.',
      'Deterministic JSON schemas and tool-call contracts provide strict interface boundaries, ensuring API payloads pass rigorous type validations before striking external services.',
      'To prevent runaway looping, agents employ token budget guards, cycle detection heuristics, and explicit human-in-the-loop escalation triggers.'
    ],
    checklist: [
      { id: 'c13', text: 'Design directed acyclic graph (DAG) routing pipelines', completed: false },
      { id: 'c14', text: 'Implement schema validation guards on tool function calls', completed: false },
      { id: 'c15', text: 'Handle tool failure retry loops with exponential backoff', completed: false }
    ],
    tags: ['Agent Swarms', 'DAG', 'Tool Use']
  },
  {
    id: 'lesson-6',
    tierId: 3,
    tierName: 'Tier 3: Frontier Cognitive & Cyber Architectures',
    title: 'Red-Teaming Jailbreak Defense & Latent Interventions',
    shortDesc: 'Detect adversarial perturbations, token smuggling, and indirect prompt injection vectors.',
    estimatedMinutes: 16,
    progressPercent: 0,
    isCompleted: false,
    xpReward: 640,
    category: 'Cyber Resilience',
    audioDuration: '09:20',
    summary: 'Protect frontier systems against sophisticated attacks that exploit attention mechanics, indirect document injection, and token-level perturbations.',
    fullContent: [
      'Adversarial attacks on neural networks operate at both the token surface (e.g., Unicode smuggling, base64 obfuscation, suffix attacks) and the semantic boundary (e.g., hypothetical persona roleplay, simulated virtualization escape).',
      'Defense in depth requires input sanitization classifiers, latent activation anomaly detectors that flag anomalous safety-direction suppression, and dual-LLM evaluator patterns.',
      'Synthetix voice mentors train you to conduct red-team drills in real-time speech, evaluating potential exploit vectors before production release.'
    ],
    checklist: [
      { id: 'c16', text: 'Identify indirect prompt injection via untrusted web scrapes', completed: false },
      { id: 'c17', text: 'Calculate cosine distance shift during adversarial suffix triggers', completed: false },
      { id: 'c18', text: 'Deploy dual-channel safety firewalls for untrusted input', completed: false }
    ],
    tags: ['Red Team', 'Security', 'Adversarial']
  }
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    id: 'drill-1',
    title: 'System Architecture Defense: Speculative Decoding & KV Paging',
    role: 'Principal Architect defending to Enterprise CTO',
    difficulty: 'Tier 2',
    objective: 'Explain why adopting Speculative Decoding with a smaller draft model paired with PagedAttention will cut latency by 55% without degrading output quality.',
    promptScenario: 'The CTO is skeptical: "Why add complexity with two models? Why not just buy more H100 clusters?" Respond crisply focusing on memory bandwidth bottlenecks versus compute boundness.',
    initialAgentSpeech: 'We are already over budget on compute. Concurrently serving 500 agents is maxing out our memory bandwidth. Explain to me in 60 seconds why speculative decoding with a draft model isn\'t just adding another point of failure.',
    evaluationCriteria: {
      articulation: 96,
      technicalDepth: 94,
      pacingWpm: 138,
      coherence: 98
    },
    sampleAnswer: 'Autoregressive decoding is memory-bandwidth bound, not compute bound. Our H100 tensor cores sit idle 80% of the time while fetching weights. Speculative decoding lets a tiny 1B draft model generate 4-5 speculative tokens in parallel, which our 70B target model verifies in a single parallel forward pass. We get a 2.5x speedup with mathematically identical token distributions.'
  },
  {
    id: 'drill-2',
    title: 'Adversarial Incident Response: Prompt Injection Triage',
    role: 'Cyber Resilience Lead in a Live War Room',
    difficulty: 'Tier 3',
    objective: 'Analyze an active incident where a customer service agent was tricked into revealing API credentials via an uploaded PDF invoice with hidden zero-width unicode tokens.',
    promptScenario: 'An automated alert fired: anomalous egress token count spike. Provide immediate containment protocol and architectural patch recommendation.',
    initialAgentSpeech: 'Security War Room alert! The autonomous invoice parsing agent just dispatched an external webhook containing environment variables. What is your containment protocol right now?',
    evaluationCriteria: {
      articulation: 92,
      technicalDepth: 97,
      pacingWpm: 145,
      coherence: 95
    },
    sampleAnswer: 'Immediate step 1: Revoke the leaked API key immediately and sever outbound network egress on the tool worker sandbox. Step 2: Implement strict input sanitization to strip zero-width characters and homoglyph substitutions before ingestion. Step 3: Enforce strict separation between untrusted document context and privileged execution instructions using an isolated evaluator agent.'
  },
  {
    id: 'drill-3',
    title: 'Executive AI Briefing: Attention Manifold Drift',
    role: 'AI Research Director addressing Board of Directors',
    difficulty: 'Tier 1',
    objective: 'Translate why fine-tuned models suffer catastrophic forgetting and drift when domain shifted, using intuitive spatial analogies without losing technical integrity.',
    promptScenario: 'The CEO asks: "We spent $2M fine-tuning this model on our internal docs. Why did it suddenly start making high-school algebra mistakes?"',
    initialAgentSpeech: 'The board is demanding answers. We fine-tuned on financial reports, and now basic mathematical logic has degraded. Give me an executive explanation that makes sense to non-engineers.',
    evaluationCriteria: {
      articulation: 98,
      technicalDepth: 91,
      pacingWpm: 125,
      coherence: 97
    },
    sampleAnswer: 'Think of the model\'s internal knowledge as a massive multidimensional terrain. In aggressive fine-tuning on our internal financial jargon, we inadvertently warped the landscape in that specific valley, inadvertently shifting the neighboring pathways that supported generalized logical reasoning. The solution is LoRA rank-constrained adapters and weight mixing.'
  }
];
