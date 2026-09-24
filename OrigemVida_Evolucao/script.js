/**
 * Bio-N-Class: Origem da Vida e Estudo da Evolução
 * Arquivo de Scripts JavaScript
 * Contém: Configuração do Tailwind, KaTeX, Controladores Alpine.js, Simulação P5.js e Fallbacks.
 */

// ==========================================================================
// 1. CONFIGURAÇÃO DO TAILWIND CSS
// ==========================================================================
tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Outfit', 'sans-serif'],
          },
          colors: {
            bio: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              300: '#86efac',
              400: '#4ade80',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
              950: '#052e16',
            },
            fossil: {
              50: '#fdfbf7',
              100: '#f7f2e9',
              200: '#ece1cb',
              300: '#dec9a4',
              400: '#ccad7b',
              500: '#be955c',
              600: '#a87c48',
              700: '#875f3a',
              800: '#6f4d33',
              900: '#5c402d',
            }
          }
        }
      }
    }

// ==========================================================================
// 2. RENDERIZAÇÃO DE EQUAÇÕES CIENTÍFICAS (KaTeX)
// ==========================================================================
function renderEquations(el = document.body) {
      if (typeof renderMathInElement === 'function' && el) {
        try {
          renderMathInElement(el, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false,
            errorColor: '#ef4444',
            strict: false
          });
        } catch (e) {
          console.warn('Aviso KaTeX:', e);
        }
      }
    }
    window.addEventListener('DOMContentLoaded', () => {
      renderEquations();
      setTimeout(renderEquations, 400);
      setTimeout(renderEquations, 1200);
    });
    window.addEventListener('load', () => {
      renderEquations();
    });

// ==========================================================================
// 3. CONTROLADORES ALPINE.JS, SIMULAÇÕES P5.JS E SISTEMA DE ÁUDIO
// ==========================================================================
// ==============================================================
    // [AJUSTÁVEL] VARIÁVEIS GLOBAIS DE CONTROLE DA SIMULAÇÃO P5.JS
    // O professor/instrutor pode ajustar estes valores padrão abaixo:
    // ==============================================================
    window.SIM_CONFIG = {
      initialPopSize: 24,       // [AJUSTÁVEL] População inicial de criaturas
      foodCount: 50,            // [AJUSTÁVEL] Abundância de alimento (2 a 250)
      mutationRate: 20,         // [AJUSTÁVEL] Variação percentual máxima de velocidade ao reproduzir
      simSpeed: 1,              // [AJUSTÁVEL] Multiplicador de velocidade (0.5x a 4x)
      minSpeed: 0.8,            // [AJUSTÁVEL] Velocidade física mínima permitida
      maxSpeed: 7.5,            // [AJUSTÁVEL] Velocidade física máxima permitida (ampliada para extremos de velocidade!)
      creatureBaseRadius: 9,    // [AJUSTÁVEL] Tamanho visual da criatura
      foodRadius: 4.5,          // [AJUSTÁVEL] Raio da comida visual
      isRunning: true,          // [AJUSTÁVEL] Estado inicial de execução
      soundEnabled: false       // [AJUSTÁVEL] Efeitos sonoros ao spawnar comida (inicia mutado por padrão)
    };

    // Objeto compartilhado para atualização de estatísticas no DOM
    window.SIM_STATS = {
      generation: 1,
      currentPop: 24,
      avgSpeed: 2.0,
      totalBirths: 0,
      currentDay: 1
    };

    // ==============================================================
    // COMPONENTE ALPINE.JS: CONTROLES DA SIMULAÇÃO
    // ==============================================================
    function simulationControls() {
      return {
        foodCount: window.SIM_CONFIG.foodCount,
        mutationRate: window.SIM_CONFIG.mutationRate,
        simSpeed: window.SIM_CONFIG.simSpeed,
        isRunning: window.SIM_CONFIG.isRunning,
        soundEnabled: window.SIM_CONFIG.soundEnabled,

        updateParams() {
          window.SIM_CONFIG.foodCount = Number(this.foodCount);
          window.SIM_CONFIG.mutationRate = Number(this.mutationRate);
          window.SIM_CONFIG.simSpeed = Number(this.simSpeed);
        },

        togglePlay() {
          this.isRunning = !this.isRunning;
          window.SIM_CONFIG.isRunning = this.isRunning;
          if (this.isRunning && window.audioSynth) {
            window.audioSynth.resume();
          }
        },

        toggleSound() {
          this.soundEnabled = !this.soundEnabled;
          window.SIM_CONFIG.soundEnabled = this.soundEnabled;
          if (this.soundEnabled && window.audioSynth) {
            window.audioSynth.resume();
            window.audioSynth.playSpawn();
          }
        },

        resetPopulation() {
          if (window.resetP5Sim) {
            window.resetP5Sim();
          }
        },

        scrollToSimulation() {
          const target = document.getElementById('simulador-container') || document.getElementById('p5-canvas-container');
          if (target) {
            const headerOffset = 76;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Feedback visual de foco com anel bio suave
            target.classList.add('ring-4', 'ring-bio-500/60', 'shadow-2xl');
            setTimeout(() => {
              target.classList.remove('ring-4', 'ring-bio-500/60', 'shadow-2xl');
            }, 1500);
          }
        },

        applyPreset(food, mutation, speed = null) {
          this.foodCount = food;
          this.mutationRate = mutation;
          if (speed !== null) this.simSpeed = speed;
          this.updateParams();
          if (!this.isRunning) {
            this.isRunning = true;
            window.SIM_CONFIG.isRunning = true;
          }
          if (window.audioSynth) {
            window.audioSynth.resume();
            window.audioSynth.playSpawn();
          }
          this.scrollToSimulation();
        },

        triggerCataclysmPhase1() {
          this.foodCount = 250;
          this.mutationRate = 60;
          this.simSpeed = 1.5;
          this.updateParams();
          if (!this.isRunning) {
            this.isRunning = true;
            window.SIM_CONFIG.isRunning = true;
          }
          if (window.audioSynth) {
            window.audioSynth.resume();
            window.audioSynth.playSpawn();
          }
          this.scrollToSimulation();
        },

        triggerCataclysmPhase2() {
          this.foodCount = 2;
          this.mutationRate = 5;
          this.simSpeed = 1.0;
          this.updateParams();
          if (!this.isRunning) {
            this.isRunning = true;
            window.SIM_CONFIG.isRunning = true;
          }
          if (window.audioSynth) {
            window.audioSynth.resume();
            window.audioSynth.playDeath();
          }
          this.scrollToSimulation();
        }
      };
    }

    // ==============================================================
    // COMPONENTE ALPINE.JS: MÓDULO DE FIXAÇÃO & FLASHCARDS
    // ==============================================================
    // ==============================================================
    // COMPONENTE ALPINE.JS: CONTROLES DO SIMULADOR DE LAMARCK
    // ==============================================================
    function lamarckControls() {
      return {
        stretchRate: 20,
        inheritanceRate: 100,
        atrophyRate: 10,
        weismannActive: false,

        updateParams() {
          if (window.updateLamarckParams) {
            window.updateLamarckParams(this.stretchRate, this.inheritanceRate, this.atrophyRate);
          }
        },

        triggerWeismannTest() {
          this.weismannActive = true;
          if (window.applyWeismannTest) {
            window.applyWeismannTest();
          }
          setTimeout(() => {
            this.weismannActive = false;
          }, 4500);
        },

        resetSim() {
          if (window.resetLamarckSim) {
            window.resetLamarckSim();
          }
        }
      };
    }

    // ==============================================================
    // COMPONENTE ALPINE.JS: MÓDULO DE FIXAÇÃO & FLASHCARDS
    // ==============================================================
    function quizModule() {
      return {
        activeSubTab: 'quiz',
        score: 0,

        questions: [
          {
            id: 1,
            topic: 'Origem da Vida e Atmosfera Primitiva',
            prompt: 'De acordo com o modelo de evolução química formulado por Oparin e Haldane e corroborado pelo experimento de Miller e Urey, a síntese abiótica de moléculas orgânicas na Terra primitiva só foi possível porque:',
            options: [
              'Havia grande abundância de gás oxigênio livre (O₂), que atuava acelerando reações de oxidação celular.',
              'A atmosfera era fortemente redutora e anóxica (sem O₂ livre), permitindo que descargas elétricas e radiação UV gerassem compostos estáveis sem sofrer degradação oxidativa imediata.',
              'As primeiras células fotossintetizantes já produziam matéria orgânica em larga escala na crosta terrestre.',
              'As temperaturas do planeta eram gélidas, impedindo qualquer evaporação das águas oceânicas.'
            ],
            correctAnswer: 1,
            answered: false,
            selectedAnswer: null,
            isCorrect: false,
            feedback: 'Exato! O O₂ livre é um gás altamente reagente e oxidante. Se houvesse oxigênio livre na atmosfera primitiva, os precursores orgânicos teriam sido oxidados e degradados antes de se acumularem nos mares primitivos (a "sopa primordial").'
          },
          {
            id: 2,
            topic: 'Biogênese x Abiogênese (Pasteur)',
            prompt: 'Qual foi a inovação experimental decisiva do frasco com "pescoço de cisne" criado por Louis Pasteur para refutar definitivamente a teoria da geração espontânea (abiogênese)?',
            options: [
              'O frasco era hermeticamente lacrado a vácuo, provando que microrganismos não sobrevivem sem ar ambiente.',
              'Ele adicionou substâncias químicas tóxicas ao caldo de carne para demonstrar a inviabilidade de novos seres.',
              'O tubo sinuoso permitia a livre entrada e saída de ar (preservando o suposto "princípio vital"), mas sua curvatura retinha partículas de poeira e micróbios por gravidade, mantendo o caldo estéril até ser quebrado ou inclinado.',
              'O experimento provou que o calor gerava novas formas de vida microscópicas a partir da matéria inanimada.'
            ],
            correctAnswer: 2,
            answered: false,
            selectedAnswer: null,
            isCorrect: false,
            feedback: 'Correto! Os defensores da abiogênese alegavam que ferver e selar o frasco destruía a "força vital" do ar. Pasteur provou que o ar continuava entrando em contato com o líquido e nada nascia, a menos que o caldo tocasse as partículas e micróbios retidos no gargalo sinuoso.'
          },
          {
            id: 3,
            topic: 'Evidências da Evolução: Deriva Continental',
            prompt: 'A ocorrência de fósseis idênticos do pequeno réptil aquático de água doce Mesosaurus, restritos exclusivamente a formações sedimentares permianas do Sul do Brasil e do Sudoeste Africano, constitui uma prova biogeográfica de que:',
            options: [
              'O Mesosaurus era dotado de adaptações morfológicas para nadar milhares de quilômetros em mar aberto salgado até colonizar outro continente.',
              'Os continentes sul-americano e africano estiveram no passado geológico unidos em um supercontinente (Gondwana/Pangeia), separando-se posteriormente pela tectônica de placas.',
              'As duas populações surgiram independentemente em cada lado do oceano por pura coincidência genética.',
              'Fósseis de animais marinhos são facilmente transportados pelo vento entre diferentes hemisférios.'
            ],
            correctAnswer: 1,
            answered: false,
            selectedAnswer: null,
            isCorrect: false,
            feedback: 'Perfeito! O Mesosaurus era um réptil de anatomia delicada e habitat dulcícola (água doce), incapaz de atravessar a barreira fisiológica e oceânica do Atlântico Sul aberto. Sua distribuição só faz sentido no arranjo geológico conjunto da Gondwana.'
          },
          {
            id: 4,
            topic: 'Mecanismos Evolutivos: Camaleão e Projeção de Língua',
            prompt: 'Analise duas explicações para o comprimento e velocidade da língua retrátil do camaleão:\n\nHipótese I: Ao longo das gerações, os camaleões precisaram esticar com esforço a língua para alcançar insetos velozes; o uso contínuo fortaleceu o órgão, e os filhotes herdaram línguas maiores.\n\nHipótese II: Em populações ancestrais de camaleões, já existia variação genética natural no comprimento da língua; indivíduos com línguas ligeiramente mais ágeis capturavam mais presas, sobreviviam e geravam mais descendentes férteis.\n\nAssinale a correlação científica correta:',
            options: [
              'Hipótese I é Darwinista e Hipótese II é Lamarckista.',
              'Ambas as hipóteses representam o Neodarwinismo contemporâneo.',
              'Hipótese I fundamenta-se nas Leis de Lamarck (Uso/Desuso e Herança de Caracteres Adquiridos), enquanto Hipótese II baseia-se na Seleção Natural de Darwin e Wallace.',
              'Hipótese II é criacionista e nega a existência de seleção natural.'
            ],
            correctAnswer: 2,
            answered: false,
            selectedAnswer: null,
            isCorrect: false,
            feedback: 'Excelente! A Hipótese I atribui a causa da variação ao esforço ativo do organismo e sua transmissão somática (Lamarck). A Hipótese II baseia-se na variação pré-existente e no sucesso reprodutivo diferencial provocado pela pressão ecológica (Darwin e Wallace).'
          },
          {
            id: 5,
            topic: 'Origem da Complexidade Celular: Endossimbiose',
            prompt: 'A Teoria da Endossimbiose Sequencial, proposta por Lynn Margulis, revolucionou a biologia evolutiva ao explicar a origem de mitocôndrias e cloroplastos. Qual conjunto de evidências moleculares e citológicas comprova a ancestralidade bacteriana dessas organelas em células eucarióticas?',
            options: [
              'Presença de DNA próprio circular, ribossomos do tipo 70S (semelhantes aos de bactérias) e capacidade de divisão independente por fissão binária.',
              'Presença de uma membrana única e ausência de qualquer material genético dentro das organelas.',
              'Incapacidade total de produzir proteínas próprias sem o auxílio do retículo endoplasmático do hospedeiro.',
              'Origem idêntica à do complexo de Golgi e dos lisossomos através de invaginações simples da carioteca.'
            ],
            correctAnswer: 0,
            answered: false,
            selectedAnswer: null,
            isCorrect: false,
            feedback: 'Exatamente! Mitocôndrias e cloroplastos possuem DNA circular próprio (não associado a histonas, como nas bactérias), ribossomos 70S sensíveis aos mesmos antibióticos que afetam procariotos, dupla membrana (sendo a interna similar à membrana bacteriana) e se replicam por fissão binária independente.'
          }
        ],

        flashcards: [
          {
            category: 'História da Ciência',
            icon: '🧫',
            term: 'Biogênese (Pasteur & Redi)',
            definition: 'Princípio fundamental comprovando que todo organismo vivo origina-se exclusivamente de outro ser vivo pré-existente por meio da reprodução, refutando a geração espontânea.',
            flipped: false
          },
          {
            category: 'Evidência Paleontológica',
            icon: '🦖',
            term: 'Fóssil & Deriva Continental',
            definition: 'Restos minerais de organismos pretéritos (como Mesosaurus e Archaeopteryx) que documentam transições anatômicas e a fragmentação do supercontinente Gondwana ao longo de milhões de anos.',
            flipped: false
          },
          {
            category: 'Mecanismo Evolutivo',
            icon: '🌿',
            term: 'Seleção Natural (Darwin & Wallace)',
            definition: 'Processo no qual indivíduos de uma população portando variações hereditárias mais vantajosas ao habitat sobrevivem e deixam proporcionalmente mais descendentes férteis.',
            flipped: false
          },
          {
            category: 'Lamarckismo & Genética',
            icon: '🦒',
            term: 'Uso e Desuso vs. Weismann',
            definition: 'Proposta histórica de Lamarck de que o uso contínuo desenvolve um órgão e o desuso o atrofia. Refutada por Weismann: alterações somáticas não atingem o código genético nos gametas.',
            flipped: false
          },
          {
            category: 'Evolução Celular',
            icon: '🔬',
            term: 'Endossimbiose (Lynn Margulis)',
            definition: 'Teoria demonstrando que mitocôndrias e cloroplastos descendem de bactérias aeróbias e fotossintetizantes engolfadas em simbiose mútua permanente por células eucarióticas primitivas.',
            flipped: false
          },
          {
            category: 'Anatomia Comparada',
            icon: '🦴',
            term: 'Homologia vs. Analogia',
            definition: 'Homologia: mesma origem embrionária e ancestralidade comum (asa de morcego e braço humano). Analogia: mesma função por convergência adaptativa, sem parentesco imediato (asa de ave e asa de inseto).',
            flipped: false
          },
          {
            category: 'Adaptações Ecológicas',
            icon: '🎨',
            term: 'Aposematismo & Mimetismo',
            definition: 'Aposematismo: cores de aviso chamativas que sinalizam toxicidade a predadores. Mimetismo: semelhança evolutiva na qual uma espécie imita o padrão visual de outra espécie tóxica para proteção.',
            flipped: false
          },
          {
            category: 'Filogenia Molecular',
            icon: '🌳',
            term: 'Os 3 Domínios (Carl Woese)',
            definition: 'Classificação filogenética baseada no RNA ribossômico que divide toda a vida em Bacteria, Archaea e Eukarya, demonstrando que todos os seres compartilham um ancestral comum universal (LUCA).',
            flipped: false
          }
        ],

        answerQuestion(question, optionIdx) {
          if (question.answered) return;
          question.answered = true;
          question.selectedAnswer = optionIdx;
          question.isCorrect = (optionIdx === question.correctAnswer);
          if (question.isCorrect) {
            this.score += 20; // 5 perguntas x 20 = 100 pontos
          }
        },

        answeredCount() {
          return this.questions.filter(q => q.answered).length;
        }
      };
    }

    // ==============================================================
    // SIMULAÇÃO BIOLÓGICA CONTÍNUA COM P5.JS & WEB AUDIO API
    // ==============================================================
    (function () {
      let creatures = [];
      let foods = [];
      let mitosisEffects = [];
      let deathEffects = [];
      let canvasW, canvasH;
      let extinctionTimer = 0;
      let dayFrameCount = 0;
      let currentDay = 1;
      const framesPerDay = 500; // Duração de 1 ciclo diário biológico

      // --------------------------------------------------------------
      // SINTETIZADOR DE ÁUDIO PROCEDURAL (WEB AUDIO API NATIVA)
      // --------------------------------------------------------------
      class SoundSynthesizer {
        constructor() {
          this.ctx = null;
          this.lastSpawnTime = 0;
          this.lastEatTime = 0;
          this.lastBirthTime = 0;
          this.lastDeathTime = 0;
        }

        init() {
          if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
              this.ctx = new AudioCtx();
            }
          }
        }

        resume() {
          this.init();
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        }

        // Som de Spawn: "pop" suave semelhante a uma gota d'água
        playSpawn() {
          if (!window.SIM_CONFIG.soundEnabled) return;
          this.init();
          if (!this.ctx || this.ctx.state !== 'running') return;

          const now = performance.now();
          if (now - this.lastSpawnTime < 80) return; // Limite de taxa suave
          this.lastSpawnTime = now;

          try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(540, t);
            osc.frequency.exponentialRampToValueAtTime(260, t + 0.08);

            gain.gain.setValueAtTime(0.045, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.085);
          } catch (e) { }
        }

        // Som de Coleta: sutil e crocante
        playEat() {
          if (!window.SIM_CONFIG.soundEnabled) return;
          this.init();
          if (!this.ctx || this.ctx.state !== 'running') return;

          const now = performance.now();
          if (now - this.lastEatTime < 60) return;
          this.lastEatTime = now;

          try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(580, t);
            osc.frequency.exponentialRampToValueAtTime(880, t + 0.05);

            gain.gain.setValueAtTime(0.035, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.055);
          } catch (e) { }
        }

        // Som de Nascimento: arpejo harmônico cristalino de reprodução (Dó-Mi-Sol)
        playBirth() {
          if (!window.SIM_CONFIG.soundEnabled) return;
          this.init();
          if (!this.ctx || this.ctx.state !== 'running') return;

          const now = performance.now();
          if (now - this.lastBirthTime < 130) return;
          this.lastBirthTime = now;

          try {
            const t = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99]; // Dó (C5), Mi (E5), Sol (G5)
            notes.forEach((freq, idx) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, t + idx * 0.055);
              gain.gain.setValueAtTime(0.04, t + idx * 0.055);
              gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.055 + 0.16);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(t + idx * 0.055);
              osc.stop(t + idx * 0.055 + 0.17);
            });
          } catch (e) { }
        }

        // Som de Morte/Inanição: tom melancólico descendente com filtro ressonante
        playDeath() {
          if (!window.SIM_CONFIG.soundEnabled) return;
          this.init();
          if (!this.ctx || this.ctx.state !== 'running') return;

          const now = performance.now();
          if (now - this.lastDeathTime < 75) return; // Limite de taxa suave para evitar sobreposição excessiva
          this.lastDeathTime = now;

          try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            // Onda triangle com filtro passa-baixas dinâmico simulando o sopro da vida se esvaindo
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, t);
            osc.frequency.exponentialRampToValueAtTime(65, t + 0.20);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(650, t);
            filter.frequency.exponentialRampToValueAtTime(110, t + 0.20);

            gain.gain.setValueAtTime(0.065, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.21);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.22);
          } catch (e) { }
        }
      }

      const soundSynth = new SoundSynthesizer();
      window.audioSynth = soundSynth;

      // Desbloqueia o AudioContext no primeiro clique do usuário na página
      const enableAudioOnInteraction = () => {
        soundSynth.resume();
        window.removeEventListener('click', enableAudioOnInteraction);
        window.removeEventListener('keydown', enableAudioOnInteraction);
      };
      window.addEventListener('click', enableAudioOnInteraction);
      window.addEventListener('keydown', enableAudioOnInteraction);

      // Função para disparar a animação visual de mitose celular
      function spawnMitosisEffect(px, py, cx, cy) {
        let mx = (px + cx) / 2;
        let my = (py + cy) / 2;
        let particles = [];
        for (let i = 0; i < 8; i++) {
          let a = Math.random() * Math.PI * 2;
          let spd = Math.random() * 2.2 + 0.8;
          particles.push({
            x: mx,
            y: my,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            size: Math.random() * 2.5 + 1.5,
            alpha: 255
          });
        }
        mitosisEffects.push({
          x: mx,
          y: my,
          radius: 8,
          maxRadius: 36,
          alpha: 255,
          particles: particles
        });
      }

      // Função para disparar a animação visual de morte / inanição celular
      function spawnDeathEffect(x, y, radius, speed) {
        let particles = [];
        let normSpeed = (speed - window.SIM_CONFIG.minSpeed) / (window.SIM_CONFIG.maxSpeed - window.SIM_CONFIG.minSpeed);
        normSpeed = Math.max(0, Math.min(1, normSpeed));
        let r = Math.floor(normSpeed * 230 + 40);
        let g = Math.floor((1 - normSpeed) * 80 + 30);
        let b = Math.floor((1 - normSpeed) * 220 + 40);

        for (let i = 0; i < 9; i++) {
          let a = Math.random() * Math.PI * 2;
          let spd = Math.random() * 2.0 + 0.6;
          particles.push({
            x: x,
            y: y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd - 0.75, // Flutua suavemente para cima como poeira de energia
            size: Math.random() * 3.2 + 1.5,
            alpha: 240,
            r: r,
            g: g,
            b: b
          });
        }
        deathEffects.push({
          x: x,
          y: y,
          radius: radius,
          maxRadius: radius * 2.8,
          alpha: 230,
          r: r,
          g: g,
          b: b,
          particles: particles
        });
      }

      // --------------------------------------------------------------
      // CLASSE ALIMENTO COM ANIMAÇÃO DE SPAWN E HALO LUMINOSO
      // --------------------------------------------------------------
      class Food {
        constructor(x, y) {
          this.x = x !== undefined ? x : Math.random() * (canvasW - 40) + 20;
          this.y = y !== undefined ? y : Math.random() * (canvasH - 40) + 20;
          this.eaten = false;
          this.spawnProgress = 0; // 0 até 1
          this.rippleProgress = 0; // 0 até 1
          this.baseRadius = window.SIM_CONFIG.foodRadius;
        }

        update(dt = 1) {
          if (this.spawnProgress < 1) {
            this.spawnProgress = Math.min(1, this.spawnProgress + 0.08 * dt);
          }
          if (this.rippleProgress < 1) {
            this.rippleProgress = Math.min(1, this.rippleProgress + 0.05 * dt);
          }
        }

        draw(p) {
          if (this.eaten) return;

          // 1. Halo ondulatório elástico ao surgir (efeito "onda de spawn")
          if (this.rippleProgress < 1) {
            let rRadius = this.baseRadius + this.rippleProgress * 18;
            let alpha = (1 - this.rippleProgress) * 160;
            p.noFill();
            p.stroke(34, 197, 94, alpha);
            p.strokeWeight(1.5);
            p.circle(this.x, this.y, rRadius * 2);
          }

          // 2. Crescimento com efeito elástico / pop
          let scale = Math.sin(this.spawnProgress * Math.PI * 0.5);
          if (this.spawnProgress < 1) {
            scale *= (1 + 0.35 * (1 - this.spawnProgress));
          }
          let r = this.baseRadius * scale;

          // 3. Brilho bioluminescente sutil
          p.noStroke();
          p.fill(34, 197, 94, 60);
          p.circle(this.x, this.y, (r + 2.5) * 2);

          // 4. Núcleo do alimento
          p.fill(34, 197, 94);
          p.circle(this.x, this.y, r * 2);

          // 5. Ponto de reflexo brilhante
          p.fill(220, 252, 231, 220);
          p.circle(this.x - r * 0.3, this.y - r * 0.3, r * 0.7);
        }
      }

      // --------------------------------------------------------------
      // CLASSE CRIATURA ("BLOB") - ESTÉTICA ORIGINAL & FISIOLOGIA AO VIVO
      // --------------------------------------------------------------
      class Creature {
        constructor(x, y, speed, generation = 1) {
          this.x = x !== undefined ? x : Math.random() * (canvasW - 40) + 20;
          this.y = y !== undefined ? y : Math.random() * (canvasH - 40) + 20;

          // Traço herdável: Velocidade com limites fenotípicos ampliados
          this.speed = Math.max(window.SIM_CONFIG.minSpeed, Math.min(window.SIM_CONFIG.maxSpeed, speed || (1.5 + Math.random() * 1.5)));

          // Fisiologia Energética Contínua
          this.energy = 360; // Inicia com reserva saudável
          this.maxEnergy = 560;
          this.alive = true;
          this.radius = window.SIM_CONFIG.creatureBaseRadius;
          this.generation = generation;

          // Acúmulo de Alimentos e Digestão Gradual
          this.storedFood = 0;      // Quantidade de blobs acumulados (máx: 4)
          this.maxStoredFood = 4;
          this.totalDigested = 0;   // Blobs digeridos desde a última reprodução
          this.digestionTimer = 0;  // Contagem para queimar o próximo blob
          this.digestPulse = 0;     // Pulso luminoso ao digerir alimento
          this.eatPulse = 0;        // Salto elástico visual ao comer

          // Navegação e Movimento Errante Suave
          this.angle = Math.random() * Math.PI * 2;
          this.changeDirectionTimer = Math.floor(Math.random() * 30);
        }

        update(dt = 1) {
          if (!this.alive) return;

          // 1. Custo Metabólico Basal + Cinético: E_gasto = 0.18 + 0.035 * v² (Darwinismo Energético)
          let metabolicCost = (0.18 + 0.035 * (this.speed * this.speed)) * dt;
          this.energy -= metabolicCost;

          // 2. Morte por inanição se a energia esgotar completamente
          if (this.energy <= 0) {
            this.alive = false;
            return;
          }

          // 3. Mecânica de Digestão Inteligente dos Blobs Armazenados
          // Se a energia estiver crítica (< 120), ocorre DIGESTÃO DE EMERGÊNCIA IMEDIATA (sem esperar timer)
          // Em estado normal, digere suavemente 1 blob a cada 30 frames se houver espaço na barra de energia
          if (this.storedFood > 0) {
            let isEmergency = (this.energy < 120);
            this.digestionTimer += dt;

            if (isEmergency || (this.digestionTimer >= 30 && this.energy < 440)) {
              this.storedFood--;
              this.energy = Math.min(this.maxEnergy, this.energy + 140);
              this.totalDigested++;
              this.digestPulse = 1.0;
              this.digestionTimer = 0;
            }
          }

          // Efeitos visuais suaves de pulso
          if (this.digestPulse > 0) this.digestPulse = Math.max(0, this.digestPulse - 0.05 * dt);
          if (this.eatPulse > 0) this.eatPulse = Math.max(0, this.eatPulse - 0.08 * dt);

          // 4. Reprodução Assexuada com Mutação (Seleção Natural de Darwin & Wallace)
          // Ocorre quando acumula energia excedente e já metabolizou pelo menos 2 alimentos
          if (this.energy > 460 && this.totalDigested >= 2 && creatures.length < 65) {
            this.energy -= 200; // Progenitor doa energia ao descendente
            this.totalDigested = 0;

            // Mutação genética controlada pelo slider
            let mutFactor = 1 + ((Math.random() - 0.5) * 2 * (window.SIM_CONFIG.mutationRate / 100));
            let childSpeed = this.speed * mutFactor;

            let child = new Creature(
              this.x + (Math.random() - 0.5) * 16,
              this.y + (Math.random() - 0.5) * 16,
              childSpeed,
              this.generation + 1
            );
            child.energy = 240; // Energia inicial transmitida pelo pai
            child.eatPulse = 1.3;
            this.eatPulse = 1.3;

            creatures.push(child);
            soundSynth.playBirth();
            spawnMitosisEffect(this.x, this.y, child.x, child.y);

            window.SIM_STATS.totalBirths++;
            if (child.generation > window.SIM_STATS.generation) {
              window.SIM_STATS.generation = child.generation;
            }
          }

          // 5. Percepção Sensorial e Busca de Comida
          let needsFood = (this.storedFood < this.maxStoredFood) || (this.energy < 220);
          let closestFood = null;
          let sensorRadius = 90 + this.speed * 16; // Alcance visual proporcional à velocidade

          if (needsFood) {
            let minDistance = sensorRadius;
            for (let f of foods) {
              if (!f.eaten) {
                let d = Math.hypot(f.x - this.x, f.y - this.y);
                if (d < minDistance) {
                  minDistance = d;
                  closestFood = f;
                }
              }
            }
          }

          if (closestFood) {
            // Rastreamento suave e direcionado até a comida
            let targetAngle = Math.atan2(closestFood.y - this.y, closestFood.x - this.x);
            let diff = targetAngle - this.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.angle += diff * (0.18 * Math.min(1.5, dt));
          } else {
            // Movimentação errante realista (Wander)
            this.changeDirectionTimer -= dt;
            if (this.changeDirectionTimer <= 0) {
              this.angle += (Math.random() - 0.5) * 1.4;
              this.changeDirectionTimer = 20 + Math.floor(Math.random() * 40);
            }
          }

          // Atualização de posição física escalada pelo tempo
          this.x += Math.cos(this.angle) * this.speed * dt;
          this.y += Math.sin(this.angle) * this.speed * dt;

          // Rebater nas margens do ecossistema
          if (this.x < this.radius) { this.x = this.radius; this.angle = Math.PI - this.angle; }
          if (this.x > canvasW - this.radius) { this.x = canvasW - this.radius; this.angle = Math.PI - this.angle; }
          if (this.y < this.radius) { this.y = this.radius; this.angle = -this.angle; }
          if (this.y > canvasH - this.radius) { this.y = canvasH - this.radius; this.angle = -this.angle; }

          // 6. Colisão e Coleta de Alimentos no Cenário
          for (let f of foods) {
            if (!f.eaten) {
              let d = Math.hypot(f.x - this.x, f.y - this.y);
              if (d < this.radius + f.baseRadius) {
                f.eaten = true;
                this.eatPulse = 1.0;
                soundSynth.playEat();

                // Recarga imediata de socorro ao capturar (evita morte por inanição durante coleta)
                this.energy = Math.min(this.maxEnergy, this.energy + 45);

                if (this.storedFood < this.maxStoredFood) {
                  this.storedFood++;
                } else {
                  // Se o estômago já estiver cheio, converte todo o valor restante imediatamente
                  this.energy = Math.min(this.maxEnergy, this.energy + 100);
                  this.totalDigested++;
                }
                break;
              }
            }
          }
        }

        draw(p) {
          if (!this.alive) return;

          p.push();
          p.translate(this.x, this.y);

          // Interpolação cromática pelo fenótipo da velocidade:
          // Azul suave (lento: ~0.8) -> Roxo (médio: ~3.0) -> Vermelho Vivo (rápido: >5.0)
          let normSpeed = (this.speed - window.SIM_CONFIG.minSpeed) / (window.SIM_CONFIG.maxSpeed - window.SIM_CONFIG.minSpeed);
          normSpeed = Math.max(0, Math.min(1, normSpeed));

          let r = Math.floor(normSpeed * 230 + 40);
          let g = Math.floor((1 - normSpeed) * 80 + 30);
          let b = Math.floor((1 - normSpeed) * 220 + 40);

          // Efeito de pulso de digestão (esverdeado temporário no organismo)
          if (this.digestPulse > 0) {
            r = Math.floor(r * (1 - this.digestPulse * 0.4) + 34 * this.digestPulse * 0.4);
            g = Math.floor(g * (1 - this.digestPulse * 0.5) + 210 * this.digestPulse * 0.5);
          }

          // Feedback de baixa energia (pisca sutil quando faminto < 80 de energia)
          let alpha = 240;
          if (this.energy < 80) {
            alpha = (p.frameCount % 10 < 5) ? 140 : 255;
          }

          // Tamanho com leve salto elástico ao se alimentar ou reproduzir
          let currentRadius = this.radius * (1 + this.eatPulse * 0.22);

          // Contorno e corpo da criatura
          p.stroke(255, 255, 255, alpha * 0.85);
          p.strokeWeight(1.5);
          p.fill(r, g, b, alpha);
          p.circle(0, 0, currentRadius * 2);

          // ----------------------------------------------------------
          // VISUALIZAÇÃO DOS BLOBS DE COMIDA ACUMULADOS
          // Pequenas esferas esmeraldas brilhantes ordenadas na parte dorsal
          // ----------------------------------------------------------
          p.rotate(this.angle);

          if (this.storedFood > 0) {
            const blobAngles = [-Math.PI * 0.72, -Math.PI * 0.88, Math.PI * 0.88, Math.PI * 0.72];
            for (let i = 0; i < this.storedFood && i < 4; i++) {
              let a = blobAngles[i];
              let bx = Math.cos(a) * (currentRadius + 3.5);
              let by = Math.sin(a) * (currentRadius + 3.5);

              p.stroke(255, 255, 255, 220);
              p.strokeWeight(1);
              p.fill(34, 197, 94);
              p.circle(bx, by, 5.5);

              p.noStroke();
              p.fill(220, 252, 231);
              p.circle(bx - 0.8, by - 0.8, 1.8);
            }
          }

          // Olhos direcionais expressivos (olham para a rota de movimento)
          p.fill(255);
          p.noStroke();
          p.circle(3, -3.2, 4.2);
          p.circle(3, 3.2, 4.2);

          p.fill(0);
          p.circle(4.6, -3.2, 2.2);
          p.circle(4.6, 3.2, 2.2);

          // Pingo de cansaço/suor se estiver em inanição crítica
          if (this.energy < 80) {
            p.fill(56, 189, 248, 220);
            p.noStroke();
            p.circle(-2, -currentRadius - 3.5, 3.5);
          }

          p.pop();
        }
      }

      // Função para criar uma nova unidade de alimento com efeito sonoro
      function spawnFoodItem(playSound = true) {
        let f = new Food();
        foods.push(f);
        if (playSound) {
          soundSynth.playSpawn();
        }
      }

      // Função global para reiniciar o laboratório do zero
      window.resetP5Sim = function () {
        soundSynth.resume();
        window.SIM_STATS.generation = 1;
        window.SIM_STATS.totalBirths = 0;
        extinctionTimer = 0;
        dayFrameCount = 0;
        currentDay = 1;
        mitosisEffects = [];
        deathEffects = [];

        creatures = [];
        for (let i = 0; i < window.SIM_CONFIG.initialPopSize; i++) {
          creatures.push(new Creature());
        }

        // Limpa e distribui alimentos iniciais
        foods = [];
        let initialFoodCount = Math.max(2, Math.floor(window.SIM_CONFIG.foodCount * 0.7));
        for (let i = 0; i < initialFoodCount; i++) {
          spawnFoodItem(false);
        }

        updateHUD();
      };

      // Atualização dos indicadores de telemetria e gráficos no DOM
      function updateHUD() {
        const statGen = document.getElementById('stat-gen');
        const statPop = document.getElementById('stat-pop');
        const statSpd = document.getElementById('stat-speed');
        const statTimer = document.getElementById('stat-timer');

        let activePop = creatures.length;
        let avgSpd = activePop > 0 ? (creatures.reduce((acc, cr) => acc + cr.speed, 0) / activePop).toFixed(2) : '0.00';
        let activeFoods = foods.filter(f => !f.eaten).length;

        window.SIM_STATS.currentPop = activePop;
        window.SIM_STATS.avgSpeed = avgSpd;
        window.SIM_STATS.currentDay = currentDay;

        if (statGen) statGen.innerText = window.SIM_STATS.generation;
        if (statPop) statPop.innerText = activePop;
        if (statSpd) statSpd.innerText = avgSpd;

        if (statTimer) {
          if (activePop > 0) {
            statTimer.innerText = `🟢 ${activeFoods} Alimentos • ${activePop} Vivos • Dia ${currentDay}`;
          } else {
            statTimer.innerText = `⚠️ População Extinta`;
          }
        }

        // 1. Atualizar Histograma de Frequência de Velocidade (5 faixas)
        let bins = [0, 0, 0, 0, 0];
        for (let cr of creatures) {
          if (cr.speed < 1.8) bins[0]++;
          else if (cr.speed < 2.8) bins[1]++;
          else if (cr.speed < 3.8) bins[2]++;
          else if (cr.speed < 4.8) bins[3]++;
          else bins[4]++;
        }

        for (let b = 0; b < 5; b++) {
          let countEl = document.getElementById('hist-count-' + b);
          let barEl = document.getElementById('hist-bar-' + b);
          if (countEl) countEl.innerText = bins[b];
          if (barEl) {
            let pct = activePop > 0 ? Math.round((bins[b] / activePop) * 100) : 0;
            barEl.style.height = pct + '%';
          }
        }

        // 2. Atualizar Monitor de Recursos vs. População
        const monFoods = document.getElementById('mon-foods');
        const monPop = document.getElementById('mon-pop');
        const monFoodBar = document.getElementById('mon-food-bar');
        const monPopBar = document.getElementById('mon-pop-bar');
        const monBirths = document.getElementById('mon-births');
        const monDay = document.getElementById('mon-day');
        const ecoStatusText = document.getElementById('eco-status-text');

        if (monFoods) monFoods.innerText = activeFoods;
        if (monPop) monPop.innerText = activePop;
        if (monBirths) monBirths.innerText = window.SIM_STATS.totalBirths;
        if (monDay) monDay.innerText = 'Dia ' + currentDay;

        let maxFoodCap = Math.max(10, Math.floor(window.SIM_CONFIG.foodCount * 1.35));
        if (monFoodBar) monFoodBar.style.width = Math.min(100, Math.round((activeFoods / maxFoodCap) * 100)) + '%';
        if (monPopBar) monPopBar.style.width = Math.min(100, Math.round((activePop / 70) * 100)) + '%';

        if (ecoStatusText) {
          if (activePop === 0) {
            ecoStatusText.innerText = '⚠️ Extinção Ecológica';
            ecoStatusText.className = 'text-[11px] font-mono font-bold text-red-500';
          } else if (activeFoods < 10) {
            ecoStatusText.innerText = '🔴 Escassez Severa';
            ecoStatusText.className = 'text-[11px] font-mono font-bold text-red-500';
          } else if (activeFoods > 80) {
            ecoStatusText.innerText = '🟢 Superabundância';
            ecoStatusText.className = 'text-[11px] font-mono font-bold text-emerald-500';
          } else {
            ecoStatusText.innerText = '⚖️ Equilíbrio Ativo';
            ecoStatusText.className = 'text-[11px] font-mono font-bold text-bio-600 dark:text-bio-400';
          }
        }
      }

      // Instância P5.js com renderização contínua e HUD do Dia
      const sketch = function (p) {
        p.setup = function () {
          const container = document.getElementById('p5-canvas-container');
          canvasW = container ? container.clientWidth : (window.innerWidth < 800 ? window.innerWidth : 800);
          canvasH = window.innerWidth < 640 ? 300 : 420;
          let canvas = p.createCanvas(canvasW, canvasH);
          canvas.parent('p5-canvas-container');
          p.frameRate(60);

          // Inicializar ecossistema
          window.resetP5Sim();
        };

        p.windowResized = function () {
          const container = document.getElementById('p5-canvas-container');
          if (container) {
            const targetW = container.clientWidth;
            const targetH = window.innerWidth < 640 ? 300 : 420;
            if (targetW !== canvasW || targetH !== canvasH) {
              canvasW = targetW;
              canvasH = targetH;
              p.resizeCanvas(canvasW, canvasH);
            }
          }
        };

        p.draw = function () {
          // Fundo escuro de laboratório biológico
          p.background(10, 15, 26);

          // Grid sutil decorativo
          p.stroke(255, 255, 255, 12);
          p.strokeWeight(1);
          for (let x = 0; x < canvasW; x += 30) p.line(x, 0, x, canvasH);
          for (let y = 0; y < canvasH; y += 30) p.line(0, y, canvasW, y);

          // ----------------------------------------------------------
          // CICLO DE ATUALIZAÇÃO DA SIMULAÇÃO (SUPORTE A CÂMERA LENTA & ACELERAÇÃO)
          // ----------------------------------------------------------
          if (window.SIM_CONFIG.isRunning) {
            let speed = window.SIM_CONFIG.simSpeed;

            if (speed < 1) {
              // Câmera lenta suave (ex: 0.5x) usando delta time fracionário
              let dt = speed;
              dayFrameCount += dt;

              let simFoodChance = (0.005 + (window.SIM_CONFIG.foodCount / 250) * 0.16) * dt;
              let currentActiveFoods = foods.filter(f => !f.eaten).length;
              let maxAllowedFoods = Math.max(1, Math.floor(window.SIM_CONFIG.foodCount * 1.35));

              if (Math.random() < simFoodChance && currentActiveFoods < maxAllowedFoods) {
                spawnFoodItem(true);
              }

              for (let f of foods) f.update(dt);

              for (let i = creatures.length - 1; i >= 0; i--) {
                let cr = creatures[i];
                cr.update(dt);
                if (!cr.alive) {
                  spawnDeathEffect(cr.x, cr.y, cr.radius, cr.speed);
                  soundSynth.playDeath();
                  creatures.splice(i, 1);
                }
              }
            } else {
              // Execução inteira acelerada (1x, 2x, 4x)
              let steps = Math.floor(speed);
              for (let s = 0; s < steps; s++) {
                dayFrameCount += 1;

                let simFoodChance = 0.005 + (window.SIM_CONFIG.foodCount / 250) * 0.16;
                let currentActiveFoods = foods.filter(f => !f.eaten).length;
                let maxAllowedFoods = Math.max(1, Math.floor(window.SIM_CONFIG.foodCount * 1.35));

                if (Math.random() < simFoodChance && currentActiveFoods < maxAllowedFoods) {
                  spawnFoodItem(true);
                }

                for (let f of foods) f.update(1);

                for (let i = creatures.length - 1; i >= 0; i--) {
                  let cr = creatures[i];
                  cr.update(1);
                  if (!cr.alive) {
                    spawnDeathEffect(cr.x, cr.y, cr.radius, cr.speed);
                    soundSynth.playDeath();
                    creatures.splice(i, 1);
                  }
                }
              }
            }

            // Avanço do Relógio do Dia
            if (dayFrameCount >= framesPerDay) {
              dayFrameCount = 0;
              currentDay++;
            }

            // Limpeza periódica de memória
            if (foods.length > 300) {
              foods = foods.filter(f => !f.eaten);
            }

            // Tratamento de extinção por escassez severa
            if (creatures.length === 0) {
              extinctionTimer++;
              if (extinctionTimer > 180) {
                for (let i = 0; i < 6; i++) {
                  creatures.push(new Creature());
                }
                extinctionTimer = 0;
              }
            } else {
              extinctionTimer = 0;
            }
          }

          // ----------------------------------------------------------
          // RENDERIZAÇÃO GRÁFICA
          // ----------------------------------------------------------
          // 1. Desenhar alimentos (com animações de halo e pop)
          for (let f of foods) {
            f.draw(p);
          }

          // 2. Desenhar partículas e ondas de choque de mitose (reprodução)
          for (let i = mitosisEffects.length - 1; i >= 0; i--) {
            let m = mitosisEffects[i];
            m.radius += 1.8;
            m.alpha = Math.max(0, m.alpha - 10);

            p.noFill();
            p.stroke(52, 211, 153, m.alpha);
            p.strokeWeight(2);
            p.circle(m.x, m.y, m.radius * 2);

            for (let pt of m.particles) {
              pt.x += pt.vx;
              pt.y += pt.vy;
              pt.alpha = Math.max(0, pt.alpha - 8);
              p.noStroke();
              p.fill(220, 252, 231, pt.alpha);
              p.circle(pt.x, pt.y, pt.size);
            }

            if (m.alpha <= 0) {
              mitosisEffects.splice(i, 1);
            }
          }

          // 2.5. Desenhar partículas e anel de dissipação de morte celular
          for (let i = deathEffects.length - 1; i >= 0; i--) {
            let d = deathEffects[i];
            d.radius += 1.4;
            d.alpha = Math.max(0, d.alpha - 8);

            // Anel sutil de dissipação da energia vital
            p.noFill();
            p.stroke(d.r, d.g, d.b, d.alpha * 0.85);
            p.strokeWeight(1.5);
            p.circle(d.x, d.y, d.radius * 2);

            // Cruz fúnebre tênue no momento exato da morte
            if (d.alpha > 90) {
              let s = 3.5;
              p.stroke(248, 113, 113, d.alpha * 0.8);
              p.strokeWeight(1.2);
              p.line(d.x - s, d.y - s, d.x + s, d.y + s);
              p.line(d.x - s, d.y + s, d.x + s, d.y - s);
            }

            // Partículas de fumaça/poeira subindo e desvanecendo
            for (let pt of d.particles) {
              pt.x += pt.vx;
              pt.y += pt.vy;
              pt.alpha = Math.max(0, pt.alpha - 7);
              p.noStroke();
              p.fill(pt.r, pt.g, pt.b, pt.alpha);
              p.circle(pt.x, pt.y, pt.size);
            }

            if (d.alpha <= 0) {
              deathEffects.splice(i, 1);
            }
          }

          // 3. Desenhar criaturas com olhos direcionais e blobs acumulados
          for (let cr of creatures) {
            cr.draw(p);
          }

          // 4. RELÓGIO CIRCULAR DO DIA (HUD TIPO "FATIA DE PIZZA")
          p.push();
          let clockX = canvasW - 55;
          let clockY = 50;
          let clockR = 24;

          // Base circular translúcida
          p.fill(15, 23, 42, 220);
          p.stroke(255, 255, 255, 40);
          p.strokeWeight(1.5);
          p.circle(clockX, clockY, clockR * 2);

          // Fatia de pizza decrescente representando o progresso do Dia
          let fractionRemaining = Math.max(0, 1 - (dayFrameCount / framesPerDay));
          if (fractionRemaining > 0.01) {
            p.noStroke();
            p.fill(34, 197, 94, 230); // Verde bio vibrante
            let endAngle = -p.HALF_PI + fractionRemaining * p.TWO_PI;
            p.arc(clockX, clockY, (clockR - 3) * 2, (clockR - 3) * 2, -p.HALF_PI, endAngle, p.PIE);
          }

          // Núcleo donut moderno
          p.fill(10, 15, 26);
          p.noStroke();
          p.circle(clockX, clockY, 13);

          // Ponto de luz central
          p.fill(250, 204, 21);
          p.circle(clockX, clockY, 4.5);

          // Legenda do Dia logo abaixo do relógio
          p.fill(241, 245, 249);
          p.textAlign(p.CENTER, p.TOP);
          p.textSize(10);
          p.textStyle(p.BOLD);
          p.text('DIA ' + currentDay, clockX, clockY + clockR + 4);
          p.pop();

          // 5. Aviso visual em caso de extinção
          if (creatures.length === 0) {
            p.push();
            p.fill(0, 0, 0, 180);
            p.rect(canvasW / 2 - 240, canvasH / 2 - 45, 480, 90, 16);
            p.stroke(239, 68, 68, 180);
            p.strokeWeight(1.5);
            p.noFill();
            p.rect(canvasW / 2 - 240, canvasH / 2 - 45, 480, 90, 16);

            p.noStroke();
            p.fill(248, 113, 113);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(15);
            p.textStyle(p.BOLD);
            p.text('⚠️ Extinção Ecológica!', canvasW / 2, canvasH / 2 - 16);

            p.fill(226, 232, 240);
            p.textSize(12);
            p.textStyle(p.NORMAL);
            p.text('População sucumbiu à escassez. Aguardando novos migrantes...', canvasW / 2, canvasH / 2 + 10);
            p.pop();
          }

          // Atualizar telemetria e histogramas a cada ~10 frames
          if (p.frameCount % 10 === 0) {
            updateHUD();
          }
        };
      };

      // Inicia a instância p5 assim que a página estiver carregada
      window.addEventListener('DOMContentLoaded', () => {
        new p5(sketch);
      });
    })();

    // ==============================================================
    // SIMULADOR 2: HIPÓTESE DE LAMARCK (HERBÍVOROS & WEISMANN)
    // ==============================================================
    (function () {
      let p5Instance = null;
      let canvasW, canvasH;

      // Parâmetros reativos da simulação (controlados via Alpine.js)
      let stretchRate = 20;     // Crescimento por segundo em esforço
      let inheritanceRate = 100; // Herança da prole (100 = Lamarck, 0 = Mendel)
      let atrophyRate = 10;     // Atrofia por desuso

      // Estado ecológico e histórico
      let generation = 1;
      let creatures = [];
      let trees = [];
      let leafParticles = [];
      let weismannAlertTimer = 0;
      let weismannCutEffects = [];
      let historyPoints = [{ gen: 1, avg: 35.0 }];
      const BASE_NECK = 35;
      const MAX_POPULATION = 10;
      const MIN_POPULATION = 6;

      // Funções globais expostas para o Alpine.js
      window.updateLamarckParams = function (s, i, a) {
        stretchRate = Number(s);
        inheritanceRate = Number(i);
        atrophyRate = Number(a);
      };

      window.applyWeismannTest = function () {
        weismannAlertTimer = 180; // 3 segundos a 60fps
        for (let c of creatures) {
          weismannCutEffects.push({
            x: c.x,
            y: c.y - c.neckLength - 20,
            timer: 45
          });
          // Amputação somática: remove o pescoço adquirido nesta geração
          c.neckLength = BASE_NECK;
          c.clipped = true;
        }
        updateTelemetry();
        renderHistoryGraph();
      };

      window.resetLamarckSim = function () {
        generation = 1;
        historyPoints = [{ gen: 1, avg: BASE_NECK }];
        initEcosystem();
        updateTelemetry();
        renderHistoryGraph();
      };

      window.initLamarckSim = function () {
        if (!p5Instance) {
          const container = document.getElementById('p5-lamarck-canvas-container');
          if (container) {
            p5Instance = new p5(lamarckSketch, container);
          }
        } else {
          // Se já existe, garante redimensionamento caso o container tenha mudado
          const container = document.getElementById('p5-lamarck-canvas-container');
          if (container && p5Instance.resizeCanvas) {
            let newW = Math.max(600, Math.min(1000, container.clientWidth || 800));
            p5Instance.resizeCanvas(newW, 420);
          }
        }
      };

      // --------------------------------------------------------------
      // ESTRUTURA DE ÁRVORES E FOLHAS DA SAVANA
      // --------------------------------------------------------------
      class SavannaTree {
        constructor(x, p) {
          this.x = x;
          this.p = p;
          this.groundY = 380;
          this.foliage = [
            // Camada Baixa (rasteira/arbusto)
            { level: 'low', y: this.groundY - 55, leaves: 4, maxLeaves: 4, regenTimer: 0, regenInterval: 480 },
            // Camada Média (galhos intermediários)
            { level: 'mid', y: this.groundY - 110, leaves: 3, maxLeaves: 3, regenTimer: 0, regenInterval: 320 },
            // Camada Alta (copa superior dourada)
            { level: 'high', y: this.groundY - 175, leaves: 5, maxLeaves: 5, regenTimer: 0, regenInterval: 180 }
          ];
        }

        update() {
          // Regeneração periódica das folhas
          for (let f of this.foliage) {
            if (f.leaves < f.maxLeaves) {
              f.regenTimer++;
              if (f.regenTimer >= f.regenInterval) {
                f.leaves++;
                f.regenTimer = 0;
              }
            }
          }
        }

        draw(p) {
          p.push();
          // Tronco tortuoso típico de acácia africana
          p.stroke(120, 53, 15);
          p.strokeWeight(12);
          p.noFill();
          p.bezier(this.x, this.groundY, this.x - 10, this.groundY - 70, this.x + 15, this.groundY - 120, this.x, this.groundY - 170);

          // Galho médio divergente
          p.strokeWeight(7);
          p.line(this.x + 3, this.groundY - 95, this.x - 30, this.groundY - 112);

          // Galho baixo
          p.strokeWeight(5);
          p.line(this.x - 4, this.groundY - 45, this.x + 25, this.groundY - 55);

          p.noStroke();

          // Desenhar aglomerados de folhas por camada
          for (let f of this.foliage) {
            let layerX = (f.level === 'low') ? this.x + 25 : (f.level === 'mid') ? this.x - 30 : this.x;
            let radius = (f.level === 'high') ? 42 : (f.level === 'mid') ? 28 : 22;

            // Halo translúcido da copa
            if (f.level === 'high') {
              p.fill(245, 158, 11, 40); // Aura dourada nutritiva no topo
              p.circle(layerX, f.y, radius * 2.2);
            }

            // Folhagem base
            p.fill(f.level === 'high' ? p.color(34, 197, 94, 210) : p.color(22, 101, 52, 210));
            p.ellipse(layerX, f.y, radius * 2, radius * 1.3);

            // Folhas ativas colhíveis (bolinhas verdes)
            for (let i = 0; i < f.leaves; i++) {
              let angle = (p.TWO_PI / f.maxLeaves) * i;
              let lx = layerX + Math.cos(angle) * (radius * 0.55);
              let ly = f.y + Math.sin(angle) * (radius * 0.35);

              p.fill(f.level === 'high' ? p.color(250, 204, 21) : p.color(74, 222, 128));
              p.circle(lx, ly, 7);
              p.fill(255, 255, 255, 150);
              p.circle(lx - 1.5, ly - 1.5, 2.5);
            }
          }
          p.pop();
        }
      }

      // --------------------------------------------------------------
      // HERBÍVORO TELESCÓPICO (GIRAFÓIDE LAMARCKIANO)
      // --------------------------------------------------------------
      class Giraffoid {
        constructor(x, neckLength, gen) {
          this.x = x;
          this.groundY = 380;
          this.y = this.groundY;
          this.baseNeck = BASE_NECK;
          this.neckLength = Math.max(BASE_NECK, neckLength || BASE_NECK);
          this.generation = gen || 1;
          this.facing = Math.random() > 0.5 ? 1 : -1;
          this.speed = (0.7 + Math.random() * 0.5) * this.facing;
          this.state = 'roam'; // 'roam', 'stretching', 'eating', 'reproducing'
          this.targetTree = null;
          this.targetLayer = null;
          this.stateTimer = 0;
          this.walkCycle = Math.random() * 10;
          this.leavesEaten = 0;
          this.sweatParticles = [];
          this.shake = 0;
          this.clipped = false;
        }

        update(trees, p) {
          this.walkCycle += 0.12;

          // Atualizar partículas de suor causadas pelo esforço contínuo
          for (let i = this.sweatParticles.length - 1; i >= 0; i--) {
            let sp = this.sweatParticles[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vy += 0.15; // gravidade na gota de suor
            sp.alpha -= 5;
            if (sp.alpha <= 0) {
              this.sweatParticles.splice(i, 1);
            }
          }

          if (this.state === 'roam') {
            this.shake = 0;
            this.x += this.speed;

            // Rebater nas bordas
            if (this.x < 50) {
              this.x = 50;
              this.facing = 1;
              this.speed = Math.abs(this.speed);
            } else if (this.x > canvasW - 50) {
              this.x = canvasW - 50;
              this.facing = -1;
              this.speed = -Math.abs(this.speed);
            }

            // Procurar árvore próxima com folhas
            for (let t of trees) {
              if (Math.abs(this.x - t.x) < 45) {
                // Prioriza folhas baixas se houver
                let low = t.foliage.find(f => f.level === 'low');
                let mid = t.foliage.find(f => f.level === 'mid');
                let high = t.foliage.find(f => f.level === 'high');

                if (low && low.leaves > 0) {
                  this.targetTree = t;
                  this.targetLayer = low;
                  this.state = 'eating';
                  this.stateTimer = 60;
                  break;
                } else if (high && high.leaves > 0) {
                  // Precisa esticar para a copa alta!
                  this.targetTree = t;
                  this.targetLayer = high;
                  this.state = 'stretching';
                  this.stateTimer = 0;
                  break;
                } else if (mid && mid.leaves > 0) {
                  this.targetTree = t;
                  this.targetLayer = mid;
                  this.state = (this.neckLength >= 60) ? 'eating' : 'stretching';
                  this.stateTimer = 0;
                  break;
                }
              }
            }

            // ATROFIA POR DESUSO: Se rola muito tempo comendo apenas vegetação rasteira
            if (atrophyRate > 0 && this.neckLength > this.baseNeck) {
              this.neckLength = Math.max(this.baseNeck, this.neckLength - (atrophyRate / 100) * 0.025);
            }

          } else if (this.state === 'stretching') {
            // Em estado de esforço: animal treme e solta suor
            this.shake = Math.sin(p.frameCount * 0.8) * 2;
            let headX = this.x + (14 * this.facing);
            let headY = (this.groundY - 25) - this.neckLength;

            // Emitir gotas de suor
            if (p.frameCount % 5 === 0) {
              this.sweatParticles.push({
                x: headX + (Math.random() * 8 - 4),
                y: headY - 5,
                vx: (Math.random() * 2 - 1) * 1.5,
                vy: -Math.random() * 2 - 1,
                alpha: 220,
                size: 3 + Math.random() * 2
              });
            }

            // LEI DO USO: Pescoço cresce proporcionalmente ao slider de esforço
            if (stretchRate > 0) {
              this.neckLength += (stretchRate / 100) * 0.28;
            }

            // Verifica se o topo da cabeça alcançou a altura da camada alvo
            let targetY = this.targetLayer ? this.targetLayer.y : (this.groundY - 170);
            if (headY <= targetY + 10) {
              // Alcançou a folhagem! Passa a comer
              this.state = 'eating';
              this.stateTimer = 75;
              this.shake = 0;
            }

            this.stateTimer++;
            if (this.stateTimer > 240) {
              // Desiste e volta a pastar
              this.state = 'roam';
            }

          } else if (this.state === 'eating') {
            this.stateTimer--;
            let headX = this.x + (14 * this.facing);
            let headY = (this.groundY - 25) - this.neckLength;

            // Mastigação: partículas de folhas caindo
            if (this.stateTimer % 15 === 0 && this.targetLayer && this.targetLayer.leaves > 0) {
              this.targetLayer.leaves--;
              this.leavesEaten++;

              for (let k = 0; k < 4; k++) {
                leafParticles.push({
                  x: headX + Math.random() * 10 - 5,
                  y: headY + Math.random() * 10 - 5,
                  vx: (Math.random() * 2 - 1),
                  vy: Math.random() * 1.5 + 0.5,
                  alpha: 255,
                  color: (this.targetLayer.level === 'high') ? '#facc15' : '#4ade80'
                });
              }
            }

            if (this.stateTimer <= 0) {
              if (this.leavesEaten >= 3) {
                this.state = 'reproducing';
                this.stateTimer = 60;
              } else {
                this.state = 'roam';
              }
            }

          } else if (this.state === 'reproducing') {
            this.stateTimer--;
            if (this.stateTimer <= 0) {
              this.reproduce();
              this.leavesEaten = 0;
              this.state = 'roam';
            }
          }
        }

        reproduce() {
          // HERANÇA DOS CARACTERES ADQUIRIDOS (LAMARCK VS GENÉTICA REAL)
          let acquired = Math.max(0, this.neckLength - this.baseNeck);
          let inheritedAcquired = acquired * (inheritanceRate / 100);
          let babyNeck = this.baseNeck + inheritedAcquired;

          let babyX = Math.max(70, Math.min(canvasW - 70, this.x + (Math.random() * 60 - 30)));
          let baby = new Giraffoid(babyX, babyNeck, this.generation + 1);

          creatures.push(baby);
          if (baby.generation > generation) {
            generation = baby.generation;
          }

          // Controle de capacidade de suporte da savana
          if (creatures.length > MAX_POPULATION) {
            creatures.shift(); // Animal mais antigo completa seu ciclo
          }

          // Atualizar telemetria e registrar histórico
          let avg = calculateAvgNeck();
          historyPoints.push({ gen: generation, avg: avg });
          if (historyPoints.length > 25) {
            historyPoints.shift();
          }

          updateTelemetry();
          renderHistoryGraph();
        }

        draw(p) {
          p.push();
          let shoulderX = this.x + (10 * this.facing) + this.shake;
          let shoulderY = this.groundY - 26;
          let headX = shoulderX + (8 * this.facing);
          let headY = shoulderY - this.neckLength;

          // 1. Pernas do herbívoro (4 patas animadas com ciclo de caminhada)
          p.stroke(180, 83, 9);
          p.strokeWeight(4);
          let legSwing1 = Math.sin(this.walkCycle) * 7;
          let legSwing2 = -legSwing1;

          // Pernas traseiras
          p.line(this.x - 14, this.groundY - 14, this.x - 14 + legSwing1, this.groundY);
          p.line(this.x - 8, this.groundY - 14, this.x - 8 + legSwing2, this.groundY);
          // Pernas dianteiras
          p.line(this.x + 8, this.groundY - 14, this.x + 8 + legSwing2, this.groundY);
          p.line(this.x + 14, this.groundY - 14, this.x + 14 + legSwing1, this.groundY);

          // Cascos pretos
          p.stroke(30, 41, 59);
          p.strokeWeight(5);
          p.point(this.x - 14 + legSwing1, this.groundY);
          p.point(this.x - 8 + legSwing2, this.groundY);
          p.point(this.x + 8 + legSwing2, this.groundY);
          p.point(this.x + 14 + legSwing1, this.groundY);

          // 2. Cauda com tufo
          p.stroke(217, 119, 6);
          p.strokeWeight(2.5);
          let tailWiggle = Math.sin(this.walkCycle * 1.5) * 6;
          p.line(this.x - 20 * this.facing, this.groundY - 22, this.x - 28 * this.facing, this.groundY - 16 + tailWiggle);
          p.stroke(146, 64, 14);
          p.strokeWeight(4);
          p.point(this.x - 28 * this.facing, this.groundY - 16 + tailWiggle);

          // 3. Tronco / Corpo arredondado
          p.noStroke();
          p.fill(245, 158, 11); // Amarelo girafa
          p.ellipse(this.x, this.groundY - 22, 42, 25);

          // Manchas naturais na pele
          p.fill(180, 83, 9, 200);
          p.ellipse(this.x - 6, this.groundY - 24, 8, 7);
          p.ellipse(this.x + 6, this.groundY - 20, 7, 6);
          p.ellipse(this.x - 12, this.groundY - 20, 6, 5);

          // 4. PESCOÇO TELESCÓPICO SEGMENTADO (ANELADO)
          // Representação visual de vértebras que esticam!
          let segments = Math.max(3, Math.round(this.neckLength / 14));
          p.stroke(180, 83, 9);
          p.strokeWeight(7);
          p.strokeCap(p.ROUND);
          p.line(shoulderX, shoulderY, headX, headY);

          // Anéis vertebrais decorativos
          p.stroke(251, 191, 36);
          p.strokeWeight(5);
          for (let s = 1; s < segments; s++) {
            let t = s / segments;
            let vx = p.lerp(shoulderX, headX, t);
            let vy = p.lerp(shoulderY, headY, t);
            p.point(vx, vy);
          }

          // Crina dorsal ao longo do pescoço
          p.stroke(120, 53, 15);
          p.strokeWeight(2);
          for (let s = 0; s <= segments; s++) {
            let t = s / segments;
            let vx = p.lerp(shoulderX, headX, t) - (4 * this.facing);
            let vy = p.lerp(shoulderY, headY, t);
            p.line(vx, vy, vx - (3 * this.facing), vy - 2);
          }

          // 5. Cabeça estilizada
          p.noStroke();
          p.fill(245, 158, 11);
          p.ellipse(headX, headY, 16, 12);

          // Focinho
          p.fill(217, 119, 6);
          p.ellipse(headX + (7 * this.facing), headY + 2, 8, 7);

          // Olho expressivo
          p.fill(15, 23, 42);
          p.circle(headX + (3 * this.facing), headY - 2, 3);
          p.fill(255);
          p.circle(headX + (3.5 * this.facing), headY - 2.5, 1.2);

          // Ossicones (chifrinhos de girafa)
          p.stroke(120, 53, 15);
          p.strokeWeight(1.8);
          p.line(headX, headY - 5, headX - (2 * this.facing), headY - 11);
          p.fill(69, 26, 3);
          p.noStroke();
          p.circle(headX - (2 * this.facing), headY - 11, 2.5);

          // Efeito de reprodução (estrelinhas douradas)
          if (this.state === 'reproducing') {
            p.fill(250, 204, 21, 230);
            p.textSize(12);
            p.text('✨ Filhote!', headX - 10, headY - 16);
          }

          // 6. Gotas de suor animadas voando da cabeça durante o esforço
          for (let sp of this.sweatParticles) {
            p.fill(56, 189, 248, sp.alpha);
            p.noStroke();
            p.circle(sp.x, sp.y, sp.size);
          }

          p.pop();
        }
      }

      function initEcosystem() {
        creatures = [];
        trees = [];
        leafParticles = [];
        weismannCutEffects = [];

        let currentW = canvasW || 800;

        // Criar 4 árvores de acácia distribuídas na savana
        trees.push(new SavannaTree(currentW * 0.15, null));
        trees.push(new SavannaTree(currentW * 0.38, null));
        trees.push(new SavannaTree(currentW * 0.65, null));
        trees.push(new SavannaTree(currentW * 0.88, null));

        // População inicial de 7 herbívoros com pescoço basal (35px)
        for (let i = 0; i < 7; i++) {
          let startX = 60 + Math.random() * (currentW - 120);
          creatures.push(new Giraffoid(startX, BASE_NECK, 1));
        }
      }

      function calculateAvgNeck() {
        if (creatures.length === 0) return BASE_NECK;
        let sum = creatures.reduce((acc, c) => acc + c.neckLength, 0);
        return parseFloat((sum / creatures.length).toFixed(1));
      }

      function updateTelemetry() {
        const elGen = document.getElementById('lamarck-stat-gen');
        const elPop = document.getElementById('lamarck-stat-pop');
        const elNeck = document.getElementById('lamarck-stat-neck');
        const elStatus = document.getElementById('lamarck-stat-status');

        if (elGen) elGen.textContent = generation;
        if (elPop) elPop.textContent = creatures.length;
        let avg = calculateAvgNeck();
        if (elNeck) elNeck.textContent = avg + ' px';

        if (elStatus) {
          if (weismannAlertTimer > 0) {
            elStatus.textContent = '✂️ Amputação de Weismann!';
            elStatus.className = 'font-mono text-red-600 dark:text-red-400 font-bold animate-pulse';
          } else if (inheritanceRate === 100) {
            elStatus.textContent = 'Lamarckismo Pleno (Herança 100%)';
            elStatus.className = 'font-mono text-amber-600 dark:text-amber-400 font-bold';
          } else if (inheritanceRate === 0) {
            elStatus.textContent = 'Genética Real (Herança 0% - Mendel)';
            elStatus.className = 'font-mono text-emerald-600 dark:text-emerald-400 font-bold';
          } else {
            elStatus.textContent = `Herança Parcial (${inheritanceRate}%)`;
            elStatus.className = 'font-mono text-bio-600 dark:text-bio-400 font-bold';
          }
        }
      }

      function renderHistoryGraph() {
        const canvas = document.getElementById('lamarck-history-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.clientWidth || 300;
        const h = canvas.clientHeight || 80;
        canvas.width = w;
        canvas.height = h;

        ctx.clearRect(0, 0, w, h);

        if (historyPoints.length < 2) {
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px Inter, sans-serif';
          ctx.fillText('Aguardando reprodução para traçar curva histórica...', 15, h / 2);
          return;
        }

        // Encontrar limites para escala
        let minVal = BASE_NECK - 5;
        let maxVal = Math.max(80, ...historyPoints.map(p => p.avg)) + 10;

        // Desenhar linhas de grade
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.25); ctx.lineTo(w, h * 0.25);
        ctx.moveTo(0, h * 0.5); ctx.lineTo(w, h * 0.5);
        ctx.moveTo(0, h * 0.75); ctx.lineTo(w, h * 0.75);
        ctx.stroke();

        // Mapear pontos
        let pts = historyPoints.map((pt, idx) => {
          let px = (idx / (historyPoints.length - 1)) * (w - 20) + 10;
          let py = h - ((pt.avg - minVal) / (maxVal - minVal)) * (h - 16) - 8;
          return { x: px, y: py, avg: pt.avg };
        });

        // Área preenchida com gradiente
        let grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

        ctx.beginPath();
        ctx.moveTo(pts[0].x, h);
        for (let pt of pts) {
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(pts[pts.length - 1].x, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Linha do gráfico
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < pts.length; i++) {
          if (i === 0) ctx.moveTo(pts[i].x, pts[i].y);
          else ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.stroke();

        // Marcador do último ponto
        let lastPt = pts[pts.length - 1];
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Legenda numérica do último ponto
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(lastPt.avg + 'px', Math.min(w - 40, lastPt.x - 15), Math.max(12, lastPt.y - 8));
      }

      // --------------------------------------------------------------
      // SKETCH P5.JS PRINCIPAL DA SAVANA LAMARCKIANA
      // --------------------------------------------------------------
      const lamarckSketch = (p) => {
        p.setup = () => {
          const container = document.getElementById('p5-lamarck-canvas-container');
          canvasW = Math.max(600, Math.min(1000, container ? container.clientWidth : 800));
          canvasH = 420;

          const canvas = p.createCanvas(canvasW, canvasH);
          canvas.parent('p5-lamarck-canvas-container');

          initEcosystem();
          updateTelemetry();
          setTimeout(renderHistoryGraph, 300);
        };

        p.windowResized = () => {
          const container = document.getElementById('p5-lamarck-canvas-container');
          if (container && container.clientWidth > 0) {
            canvasW = Math.max(600, Math.min(1000, container.clientWidth));
            p.resizeCanvas(canvasW, canvasH);
            initEcosystem();
          }
        };

        p.draw = () => {
          // 1. Céu da Savana ao entardecer (gradiente quente e atmosférico)
          p.push();
          for (let y = 0; y < canvasH; y += 4) {
            let inter = p.map(y, 0, canvasH, 0, 1);
            let skyCol = p.lerpColor(p.color(30, 27, 75), p.color(180, 83, 9), inter);
            p.stroke(skyCol);
            p.strokeWeight(4);
            p.line(0, y, canvasW, y);
          }

          // Sol poente na linha do horizonte
          p.noStroke();
          p.fill(251, 191, 36, 120);
          p.circle(canvasW * 0.5, 340, 160);
          p.fill(254, 240, 138, 200);
          p.circle(canvasW * 0.5, 340, 100);

          // Colinas distantes da savana em silhueta
          p.fill(67, 20, 7, 210);
          p.beginShape();
          p.vertex(0, 360);
          p.bezierVertex(canvasW * 0.25, 335, canvasW * 0.4, 350, canvasW * 0.55, 330);
          p.bezierVertex(canvasW * 0.7, 345, canvasW * 0.85, 335, canvasW, 360);
          p.vertex(canvasW, canvasH);
          p.vertex(0, canvasH);
          p.endShape(p.CLOSE);

          // Solo da savana
          p.fill(120, 53, 15);
          p.rect(0, 380, canvasW, canvasH - 380);
          p.fill(69, 26, 3);
          p.rect(0, 400, canvasW, canvasH - 400);

          // Grama dourada na borda do solo
          p.stroke(217, 119, 6);
          p.strokeWeight(1.5);
          for (let gx = 10; gx < canvasW; gx += 16) {
            p.line(gx, 380, gx - 3, 372);
            p.line(gx + 4, 380, gx + 6, 370);
          }
          p.pop();

          // 2. Atualizar e desenhar árvores
          for (let tree of trees) {
            tree.update();
            tree.draw(p);
          }

          // 3. Atualizar e desenhar partículas de folhas mastigadas
          p.push();
          for (let i = leafParticles.length - 1; i >= 0; i--) {
            let lp = leafParticles[i];
            lp.x += lp.vx;
            lp.y += lp.vy;
            lp.alpha -= 6;
            p.noStroke();
            p.fill(lp.color + Math.floor(lp.alpha).toString(16).padStart(2, '0'));
            p.rect(lp.x, lp.y, 4, 4);
            if (lp.alpha <= 0) {
              leafParticles.splice(i, 1);
            }
          }
          p.pop();

          // 4. Atualizar e desenhar herbívoros
          for (let c of creatures) {
            c.update(trees, p);
            c.draw(p);
          }

          // 5. Efeito visual do Desafio de August Weismann (Tesouras cortando)
          if (weismannAlertTimer > 0) {
            weismannAlertTimer--;
            p.push();
            // Banner translúcido de aviso
            p.fill(0, 0, 0, 160);
            p.rect(canvasW / 2 - 210, 20, 420, 46, 12);
            p.stroke(239, 68, 68);
            p.strokeWeight(2);
            p.noFill();
            p.rect(canvasW / 2 - 210, 20, 420, 46, 12);

            p.noStroke();
            p.fill(254, 202, 202);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(13);
            p.textStyle(p.BOLD);
            p.text('✂️ Experimento de Weismann: Amputação Somática!', canvasW / 2, 36);
            p.textSize(10);
            p.textStyle(p.NORMAL);
            p.fill(241, 245, 249);
            p.text('Pescoços cortados. Observe se a próxima geração herdará a mutilação!', canvasW / 2, 52);
            p.pop();
          }

          // Animação de tesouras sobre os indivíduos cortados
          for (let i = weismannCutEffects.length - 1; i >= 0; i--) {
            let cut = weismannCutEffects[i];
            cut.timer--;
            p.push();
            p.fill(239, 68, 68, p.map(cut.timer, 0, 45, 0, 255));
            p.textSize(22);
            p.textAlign(p.CENTER, p.CENTER);
            p.text('✂️', cut.x, cut.y);
            p.pop();
            if (cut.timer <= 0) {
              weismannCutEffects.splice(i, 1);
            }
          }

          // Atualizar periodicamente telemetria
          if (p.frameCount % 20 === 0) {
            updateTelemetry();
          }
        };
      };
    })();

// ==========================================================================
// 4. FALLBACK DE VÍDEOS PARA PROTOCOLO LOCAL (file://)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
      if (window.location.protocol !== 'file:') return;

      document.querySelectorAll('#videos iframe').forEach((frame) => {
        const videoId = frame.src.match(/\/embed\/([^?]+)/)?.[1];
        if (!videoId) return;

        const fallback = document.createElement('div');
        fallback.className = 'relative h-full min-h-48 overflow-hidden bg-slate-950';
        fallback.innerHTML = '<a class="group relative block h-full w-full" href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank" rel="noopener noreferrer" aria-label="Abrir ' + frame.title + ' no YouTube"><img class="h-full w-full object-cover transition duration-300 group-hover:scale-105" src="https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg" alt="Miniatura: ' + frame.title + '"><span class="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/35"><span class="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-2xl text-white shadow-lg transition group-hover:scale-110">▶</span></span></a>';
        frame.replaceWith(fallback);
      });
    });
