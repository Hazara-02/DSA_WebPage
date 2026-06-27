/* =========================================================
   Data Structures Visualizer — Vanilla JS App
   ========================================================= */
(() => {
  'use strict';

  /* ---------- Utilities ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const el = (tag, props = {}, ...children) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'style') Object.assign(node.style, v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'html') node.innerHTML = v;
      else if (v !== undefined && v !== null) node.setAttribute(k, v);
    });
    children.flat().forEach(c => {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  };
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  /* ---------- Theme ---------- */
  const themeToggle = $('#themeToggle');
  const savedTheme = localStorage.getItem('dsv-theme') || 'dark';
  document.body.dataset.theme = savedTheme;
  themeToggle.addEventListener('click', () => {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = next;
    localStorage.setItem('dsv-theme', next);
  });

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('hidden'), 400);
  });

  /* ---------- Particles ---------- */
  (function particles() {
    const wrap = $('#particles');
    const COUNT = window.innerWidth < 640 ? 14 : 28;
    for (let i = 0; i < COUNT; i++) {
      const p = el('div', { class: 'particle' });
      const size = 3 + Math.random() * 6;
      p.style.width = p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = (100 + Math.random() * 30) + 'vh';
      p.style.animationDuration = (12 + Math.random() * 16) + 's';
      p.style.animationDelay = (-Math.random() * 16) + 's';
      p.style.opacity = 0.15 + Math.random() * 0.35;
      wrap.appendChild(p);
    }
  })();

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  const observeReveal = (node) => { node.classList.add('reveal'); io.observe(node); };

  /* ---------- Year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* =========================================================
     DATA — definitions, complexities, simulator metadata
     ========================================================= */
  const STRUCTURES = [
    {
      id: 'array', name: 'Array', tag: 'Linear', sim: 'array',
      summary: 'Contiguous, index-addressable collection of elements with O(1) random access.',
      definition: 'An array is a contiguous block of memory storing elements of the same type, accessed by zero-based indices.',
      structure: 'index → value mapping in a fixed (static) or resizable (dynamic) block.',
      principle: 'Random access in O(1) via address arithmetic; shifts required for insert/delete in the middle.',
      operations: ['Insert', 'Delete', 'Search', 'Update', 'Traverse'],
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
      pros: ['Constant-time access', 'Cache-friendly memory layout', 'Simple API'],
      cons: ['Costly insert/delete in middle', 'Static arrays have fixed size'],
      applications: ['Lookup tables', 'Matrices', 'Buffers', 'Hash table internals'],
      usecases: ['Image pixels, audio samples, game tile maps, database row pages.']
    },
    {
      id: 'singlyLL', name: 'Singly Linked List', tag: 'Linear', sim: 'linkedList',
      summary: 'Sequence of nodes; each node points to the next. Cheap inserts, no random access.',
      definition: 'A linear structure of nodes where each node stores data and a pointer to the next node.',
      structure: 'head → [data|next] → [data|next] → … → null',
      principle: 'Pointer rewiring inserts/removes a node in O(1) once the position is known.',
      operations: ['Insert (begin/end/pos)', 'Delete', 'Search', 'Traverse'],
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)*', delete: 'O(1)*', space: 'O(n)' },
      pros: ['Dynamic size', 'Cheap insert/delete at known position'],
      cons: ['No random access', 'Extra memory for pointers', 'Poor cache locality'],
      applications: ['Adjacency lists', 'Undo stacks', 'Free lists'],
      usecases: ['Music playlists, browser history stacks, polynomial representations.']
    },
    {
      id: 'doublyLL', name: 'Doubly Linked List', tag: 'Linear', sim: 'linkedList',
      summary: 'Each node has prev and next pointers — bidirectional traversal.',
      definition: 'A linked list where each node stores pointers to both predecessor and successor.',
      structure: 'null ⇄ [prev|data|next] ⇄ … ⇄ null',
      principle: 'Bidirectional links allow O(1) deletion given a node pointer.',
      operations: ['Insert (begin/end/pos)', 'Delete', 'Search', 'Traverse'],
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)*', delete: 'O(1)', space: 'O(n)' },
      pros: ['Reverse traversal', 'Faster deletes given node reference'],
      cons: ['More memory per node', 'More pointer maintenance'],
      applications: ['LRU caches', 'Navigation systems'],
      usecases: ['Browser forward/back, text editor cursors, OS process lists.']
    },
    {
      id: 'circularLL', name: 'Circular Linked List', tag: 'Linear', sim: 'linkedList',
      summary: 'Last node points back to the head — endless traversal.',
      definition: 'A linked list whose tail points back to the head, forming a cycle.',
      structure: '[A] → [B] → [C] → [A] (back to start)',
      principle: 'Useful for round-robin scheduling and circular buffers.',
      operations: ['Insert', 'Delete', 'Traverse'],
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)*', delete: 'O(1)*', space: 'O(n)' },
      pros: ['No null termination', 'Continuous traversal'],
      cons: ['Risk of infinite loops if mishandled'],
      applications: ['Round-robin schedulers', 'Multiplayer turn order'],
      usecases: ['CPU time-sharing, multi-player games, circular media playlists.']
    },
    {
      id: 'stack', name: 'Stack', tag: 'Linear', sim: 'stack',
      summary: 'LIFO collection — push/pop at the top.',
      definition: 'A linear collection that supports last-in-first-out (LIFO) access.',
      structure: 'Push and pop at one end (the “top”).',
      principle: 'Only the most recently pushed element is accessible.',
      operations: ['Push', 'Pop', 'Peek'],
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      pros: ['Simple API', 'Constant-time push/pop'],
      cons: ['No random access'],
      applications: ['Function call stack', 'Expression evaluation', 'Undo/redo'],
      usecases: ['Recursion, backtracking, balanced parentheses checking.']
    },
    {
      id: 'queue', name: 'Simple Queue', tag: 'Linear', sim: 'queue',
      summary: 'FIFO collection — enqueue at rear, dequeue from front.',
      definition: 'A linear collection that supports first-in-first-out (FIFO) access.',
      structure: 'front → […] → rear',
      principle: 'Elements leave in the order they arrived.',
      operations: ['Enqueue', 'Dequeue', 'Front', 'Rear'],
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      pros: ['Order-preserving', 'Simple model'],
      cons: ['Static array implementation wastes space'],
      applications: ['Print queues', 'BFS', 'Task scheduling'],
      usecases: ['Customer service queues, OS task scheduling, message buffers.']
    },
    {
      id: 'circularQueue', name: 'Circular Queue', tag: 'Linear', sim: 'circularQueue',
      summary: 'Fixed-size queue that wraps around — efficient reuse of slots.',
      definition: 'A queue implemented over a fixed buffer where indices wrap around modulo capacity.',
      structure: 'Buffer slots with front and rear pointers using modulo arithmetic.',
      principle: 'Wrap-around avoids shifting and wasted slots.',
      operations: ['Enqueue', 'Dequeue', 'Front', 'Rear'],
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      pros: ['Constant-time ops', 'Bounded memory'],
      cons: ['Fixed capacity'],
      applications: ['Ring buffers', 'Streaming pipelines'],
      usecases: ['Audio streaming, traffic shaping, hardware I/O buffers.']
    },
    {
      id: 'priorityQueue', name: 'Priority Queue', tag: 'Linear', sim: 'priorityQueue',
      summary: 'Each element has a priority; highest priority is dequeued first.',
      definition: 'An abstract queue where dequeue removes the highest (or lowest) priority element.',
      structure: 'Often backed by a binary heap.',
      principle: 'Ordering by priority key rather than insertion order.',
      operations: ['Insert', 'Delete-Max', 'Peek'],
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      pros: ['Efficient priority ordering'],
      cons: ['More complex than a plain queue'],
      applications: ['Dijkstra', 'A*', 'Task schedulers'],
      usecases: ['Hospital triage, OS process priority, network packet scheduling.']
    },
    {
      id: 'deque', name: 'Deque', tag: 'Linear', sim: 'deque',
      summary: 'Double-ended queue — insert/remove from both ends.',
      definition: 'A linear structure supporting insertion and deletion at both front and rear.',
      structure: '↔ front [ … ] rear ↔',
      principle: 'Generalizes stack and queue.',
      operations: ['Push Front', 'Push Rear', 'Pop Front', 'Pop Rear'],
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      pros: ['Flexible', 'O(1) ops at both ends'],
      cons: ['Slightly more bookkeeping'],
      applications: ['Sliding window', 'Palindrome checks'],
      usecases: ['Job stealing in schedulers, undo/redo with bounded history.']
    },
    {
      id: 'binaryTree', name: 'Binary Tree', tag: 'Non-Linear', sim: 'binaryTree',
      summary: 'Hierarchical structure where each node has at most two children.',
      definition: 'A rooted tree in which every node has at most two children, called left and right.',
      structure: 'root → left subtree, right subtree (recursive).',
      principle: 'Enables hierarchical decomposition and traversal orders.',
      operations: ['Insert (level-order)', 'Delete', 'Search', 'Inorder', 'Preorder', 'Postorder'],
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
      pros: ['Natural hierarchy modelling'],
      cons: ['Not self-balancing; can degenerate'],
      applications: ['Expression trees', 'Parse trees'],
      usecases: ['Compilers, decision trees, DOM trees.']
    },
    {
      id: 'bst', name: 'Binary Search Tree', tag: 'Non-Linear', sim: 'bst',
      summary: 'Binary tree with the BST invariant: left < node < right.',
      definition: 'A binary tree where each node\'s left subtree contains smaller keys and right subtree contains larger keys.',
      structure: 'Maintains sorted order; inorder traversal yields sorted keys.',
      principle: 'Search prunes half the tree at each step (when balanced).',
      operations: ['Insert', 'Delete', 'Search', 'Inorder'],
      complexity: { access: 'O(log n)*', search: 'O(log n)*', insert: 'O(log n)*', delete: 'O(log n)*', space: 'O(n)' },
      pros: ['Ordered traversal', 'Fast lookup when balanced'],
      cons: ['Worst case O(n) when unbalanced'],
      applications: ['Symbol tables', 'In-memory indexes'],
      usecases: ['Database indexes, set/map implementations.']
    },
    {
      id: 'avl', name: 'AVL Tree', tag: 'Non-Linear', sim: null,
      summary: 'Self-balancing BST — height difference of children ≤ 1.',
      definition: 'A binary search tree that performs rotations to keep balance factor in {-1, 0, 1}.',
      structure: 'BST + balance factor per node + rotations.',
      principle: 'Rebalances on insert/delete to maintain O(log n) height.',
      operations: ['Insert', 'Delete', 'Search', 'Rotate'],
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      pros: ['Guaranteed O(log n) operations'],
      cons: ['Rotations add overhead'],
      applications: ['Databases', 'Memory allocators'],
      usecases: ['Indexing, geometric search structures.']
    },
    {
      id: 'heap', name: 'Heap', tag: 'Non-Linear', sim: 'heap',
      summary: 'Complete binary tree satisfying the heap property — array-backed.',
      definition: 'A complete binary tree where parents dominate children (max-heap) or are dominated (min-heap).',
      structure: 'Array representation: parent(i)=⌊(i-1)/2⌋, children at 2i+1 and 2i+2.',
      principle: 'Heapify swaps bubble values up/down to restore the property.',
      operations: ['Insert', 'Delete Root', 'Heapify'],
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      pros: ['Efficient priority queues', 'O(1) peek'],
      cons: ['Not ordered like a BST'],
      applications: ['Heapsort', 'Dijkstra', 'Median maintenance'],
      usecases: ['OS schedulers, event loops, top-K queries.']
    },
    {
      id: 'trie', name: 'Trie', tag: 'Non-Linear', sim: 'trie',
      summary: 'Prefix tree — children indexed by characters.',
      definition: 'A tree where each path from root to a marked node spells out a stored string.',
      structure: 'Each node has a map of character → child + a terminal flag.',
      principle: 'Common prefixes share the same branches.',
      operations: ['Insert', 'Search', 'Delete', 'Starts-with'],
      complexity: { access: 'O(L)', search: 'O(L)', insert: 'O(L)', delete: 'O(L)', space: 'O(N·L)' },
      pros: ['Fast prefix queries'],
      cons: ['Memory hungry for sparse keys'],
      applications: ['Autocomplete', 'Spell checkers', 'IP routing'],
      usecases: ['Search engines, predictive text, T9 keyboards.']
    },
    {
      id: 'graph', name: 'Graph', tag: 'Non-Linear', sim: 'graph',
      summary: 'Set of vertices connected by edges — directed/undirected, weighted/unweighted.',
      definition: 'A pair G=(V,E) where V is a set of vertices and E is a set of edges connecting them.',
      structure: 'Adjacency list / adjacency matrix / edge list.',
      principle: 'Models pairwise relationships and supports traversal & shortest-path algorithms.',
      operations: ['Add Vertex', 'Add Edge', 'Remove', 'BFS', 'DFS'],
      complexity: { access: 'O(V)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
      pros: ['Models real-world relationships'],
      cons: ['Complex algorithms', 'Memory intensive for dense graphs'],
      applications: ['Maps', 'Social networks', 'Compilers'],
      usecases: ['Navigation, recommendation systems, dependency resolution.']
    },
  ];

  /* =========================================================
     CLASSIFICATION TREE
     ========================================================= */
  const TREE = [
    { name: 'Linear', groups: [
      { label: 'Array', leaves: ['Static Array', 'Dynamic Array'], sim: 'array' },
      { label: 'Linked List', leaves: ['Singly', 'Doubly', 'Circular'], sim: 'linkedList' },
      { label: 'Stack', leaves: ['Stack'], sim: 'stack' },
      { label: 'Queue', leaves: ['Simple', 'Circular', 'Priority', 'Deque'], sims: ['queue','circularQueue','priorityQueue','deque'] },
    ]},
    { name: 'Non-Linear', groups: [
      { label: 'Tree', leaves: ['Binary', 'BST', 'AVL', 'Heap', 'Trie'], sims: ['binaryTree','bst',null,'heap','trie'] },
      { label: 'Graph', leaves: ['Directed', 'Undirected', 'Weighted', 'Unweighted'], sim: 'graph' },
    ]}
  ];

  function renderTree() {
    const root = $('#treeDiagram');
    const wrap = el('div', { class: 'tree-root' });
    TREE.forEach(branch => {
      const b = el('div', { class: 'tree-branch' });
      b.appendChild(el('div', { class: 'tree-node' }, branch.name));
      const children = el('div', { class: 'tree-children' });
      branch.groups.forEach(group => {
        const g = el('div', { class: 'tree-group' });
        g.appendChild(el('div', { class: 'tree-label' }, group.label));
        const leaves = el('div', { class: 'tree-leaves' });
        group.leaves.forEach((leaf, i) => {
          const sim = group.sims ? group.sims[i] : group.sim;
          const node = el('span', { class: 'tree-leaf' }, leaf);
          if (sim) node.addEventListener('click', () => switchSim(sim));
          leaves.appendChild(node);
        });
        g.appendChild(leaves);
        children.appendChild(g);
      });
      b.appendChild(children);
      wrap.appendChild(b);
    });
    root.appendChild(wrap);
    observeReveal(root);
  }

  /* =========================================================
     INFO CARDS
     ========================================================= */
  function renderCards() {
    const grid = $('#cardsGrid');
    STRUCTURES.forEach(s => {
      const card = el('article', { class: 'info-card glass', 'data-name': s.name.toLowerCase(), 'data-tag': s.tag.toLowerCase() });
      card.appendChild(el('span', { class: 'tag' }, s.tag));
      card.appendChild(el('h3', {}, s.name));
      card.appendChild(el('p', { class: 'summary' }, s.summary));
      const details = el('div', { class: 'details' });
      const inner = el('div', { class: 'details-inner' });
      const c = s.complexity;
      inner.innerHTML = `
        <h4>Definition</h4><p>${s.definition}</p>
        <h4>Structure</h4><p>${s.structure}</p>
        <h4>Working Principle</h4><p>${s.principle}</p>
        <h4>Operations</h4><ul>${s.operations.map(o => `<li>${o}</li>`).join('')}</ul>
        <h4>Complexity</h4>
        <div class="complexity-row">
          <span>Access</span><b>${c.access}</b>
          <span>Search</span><b>${c.search}</b>
          <span>Insert</span><b>${c.insert}</b>
          <span>Delete</span><b>${c.delete}</b>
          <span>Space</span><b>${c.space}</b>
        </div>
        <h4>Advantages</h4><ul>${s.pros.map(o => `<li>${o}</li>`).join('')}</ul>
        <h4>Disadvantages</h4><ul>${s.cons.map(o => `<li>${o}</li>`).join('')}</ul>
        <h4>Applications</h4><ul>${s.applications.map(o => `<li>${o}</li>`).join('')}</ul>
        <h4>Real-World Use Cases</h4><p>${s.usecases}</p>
        ${s.sim ? `<div style="margin-top:14px"><button class="btn btn-primary btn-sm" data-jump="${s.sim}">Try Simulator →</button></div>` : ''}
      `;
      details.appendChild(inner);
      card.appendChild(details);
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-jump]')) {
          const sim = e.target.closest('[data-jump]').dataset.jump;
          switchSim(sim);
          $('#simulators').scrollIntoView({ behavior: 'smooth' });
          return;
        }
        card.classList.toggle('open');
      });
      grid.appendChild(card);
      observeReveal(card);
    });
  }

  /* =========================================================
     SEARCH (cards + tabs highlight)
     ========================================================= */
  function setupSearch() {
    const input = $('#globalSearch');
    const cards = $$('.info-card');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      cards.forEach(c => {
        const match = !q || c.dataset.name.includes(q) || c.dataset.tag.includes(q);
        c.classList.toggle('hidden', !match);
        c.classList.toggle('match', !!q && match);
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== input) {
        e.preventDefault(); input.focus();
      }
    });
  }

  /* =========================================================
     COMPLEXITY TABLE
     ========================================================= */
  function renderComplexity() {
    const tbody = $('#complexityTable tbody');
    let rows = STRUCTURES.map(s => ({ name: s.name, ...s.complexity }));
    let sortKey = 'name', sortDir = 1;

    const draw = (data) => {
      tbody.innerHTML = '';
      data.forEach(r => {
        const tr = el('tr');
        ['name','access','search','insert','delete','space'].forEach(k => {
          tr.appendChild(el('td', {}, r[k]));
        });
        tbody.appendChild(tr);
      });
    };

    $$('#complexityTable th').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        sortDir = sortKey === key ? -sortDir : 1;
        sortKey = key;
        const sorted = [...rows].sort((a,b) => String(a[key]).localeCompare(String(b[key])) * sortDir);
        draw(sorted);
      });
    });

    $('#complexityFilter').addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      draw(rows.filter(r => r.name.toLowerCase().includes(q)));
    });

    draw(rows);
  }

  /* =========================================================
     SIMULATOR FRAMEWORK
     ========================================================= */
  const SIMS = {};
  let currentSim = null;

  function registerSim(id, def) { SIMS[id] = { id, ...def }; }

  function buildSimUI(def) {
    const panel = $('#simPanel');
    panel.innerHTML = '';

    const header = el('div', { class: 'sim-header' },
      el('div', {},
        el('h3', {}, def.title),
        el('p', {}, def.description)
      )
    );
    panel.appendChild(header);

    const controls = el('div', { class: 'sim-controls' });
    def.controls.forEach(c => {
      if (c.type === 'input') {
        controls.appendChild(el('input', { type: 'text', placeholder: c.placeholder, id: `ctrl-${c.id}` }));
      } else if (c.type === 'btn') {
        controls.appendChild(el('button', { class: `btn btn-sm ${c.primary ? 'btn-primary' : 'btn-ghost'}`, onclick: () => runOp(c.op) }, c.label));
      }
    });
    controls.appendChild(el('button', { class: 'btn btn-sm btn-ghost', onclick: () => { def.reset(); ctx.history = []; ctx.step = ''; renderMeta(); def.render(stage); } }, 'Reset'));
    controls.appendChild(el('button', { class: 'btn btn-sm btn-ghost', onclick: () => runOp('example') }, 'Run Example'));
    panel.appendChild(controls);

    const stage = el('div', { class: 'sim-stage' });
    panel.appendChild(stage);

    const meta = el('div', { class: 'sim-meta' });
    const stateBox = el('div', { class: 'panel' }, el('h4', {}, 'Current State'), el('div', { class: 'state', id: 'meta-state' }, '—'));
    const histBox = el('div', { class: 'panel' }, el('h4', {}, 'Operation History'), el('div', { class: 'history', id: 'meta-history' }));
    const stepBox = el('div', { class: 'panel' }, el('h4', {}, 'Step Explanation'), el('div', { class: 'state', id: 'meta-step' }, '—'));
    const compBox = el('div', { class: 'panel' }, el('h4', {}, 'Time Complexity'), el('div', { class: 'state', id: 'meta-comp' }, '—'));
    const codeBox = el('div', { class: 'panel', style: { gridColumn: '1 / -1' } }, el('h4', {}, 'Pseudocode'), el('pre', { id: 'meta-code' }, '—'));
    meta.append(stateBox, histBox, stepBox, compBox, codeBox);
    panel.appendChild(meta);

    const ctx = { stage, history: [], step: '', complexity: '', code: '' };

    const renderMeta = () => {
      $('#meta-state').textContent = def.serialize();
      $('#meta-step').textContent = ctx.step || '—';
      $('#meta-comp').textContent = ctx.complexity || '—';
      $('#meta-code').textContent = ctx.code || '—';
      const h = $('#meta-history');
      h.innerHTML = '';
      ctx.history.slice(-50).reverse().forEach(line => h.appendChild(el('div', {}, line)));
    };

    const getInput = (id) => $(`#ctrl-${id}`)?.value.trim() ?? '';

    const runOp = async (op) => {
      try {
        await def.run(op, { getInput, ctx, stage, renderMeta });
        renderMeta();
      } catch (e) { console.error(e); }
    };

    def.reset();
    def.render(stage);
    renderMeta();

    return { ctx, renderMeta, runOp };
  }

  function switchSim(id) {
    if (!SIMS[id]) return;
    currentSim = id;
    $$('.sim-tab').forEach(t => t.classList.toggle('active', t.dataset.sim === id));
    buildSimUI(SIMS[id]);
  }

  function renderSimTabs() {
    const wrap = $('#simTabs');
    Object.values(SIMS).forEach(def => {
      wrap.appendChild(el('button', { class: 'sim-tab', 'data-sim': def.id, onclick: () => switchSim(def.id) }, def.tabLabel));
    });
  }

  /* =========================================================
     SIMULATOR: ARRAY
     ========================================================= */
  (() => {
    let arr = [];
    const render = (stage) => {
      stage.innerHTML = '';
      if (!arr.length) { stage.appendChild(el('div', { style: { color: 'var(--muted)' } }, 'Empty array — insert a value to begin.')); return; }
      const row = el('div', { class: 'row' });
      arr.forEach((v, i) => {
        const c = el('div', { class: 'cell', 'data-i': i }, String(v));
        c.appendChild(el('span', { class: 'idx' }, String(i)));
        row.appendChild(c);
      });
      stage.appendChild(row);
    };
    const flash = async (stage, i, kls = 'flash') => {
      const c = stage.querySelector(`.cell[data-i="${i}"]`);
      if (!c) return; c.classList.add(kls); await sleep(500); c.classList.remove(kls);
    };
    registerSim('array', {
      title: 'Array Simulator', tabLabel: 'Array',
      description: 'Insert, delete, search, update, and traverse a dynamic array with index visualization.',
      controls: [
        { type: 'input', id: 'val', placeholder: 'value' },
        { type: 'input', id: 'idx', placeholder: 'index (optional)' },
        { type: 'btn', op: 'insert', label: 'Insert', primary: true },
        { type: 'btn', op: 'delete', label: 'Delete' },
        { type: 'btn', op: 'search', label: 'Search' },
        { type: 'btn', op: 'update', label: 'Update' },
        { type: 'btn', op: 'traverse', label: 'Traverse' },
      ],
      reset: () => { arr = []; },
      render,
      serialize: () => `[${arr.join(', ')}]  length=${arr.length}`,
      async run(op, { getInput, ctx, stage }) {
        const v = getInput('val'); const i = parseInt(getInput('idx'), 10);
        if (op === 'example') { arr = [10, 20, 30, 40, 50]; render(stage); ctx.history.push('example: [10,20,30,40,50]'); return; }
        if (op === 'insert') {
          if (!v) return;
          const pos = Number.isFinite(i) ? Math.max(0, Math.min(arr.length, i)) : arr.length;
          arr.splice(pos, 0, isNaN(+v) ? v : +v); render(stage);
          ctx.step = `Insert ${v} at index ${pos}`; ctx.complexity = 'O(n) — shift right'; ctx.code = 'arr.splice(i, 0, v)';
          ctx.history.push(`insert(${v}, ${pos})`);
          await flash(stage, pos);
        } else if (op === 'delete') {
          if (!Number.isFinite(i) || i < 0 || i >= arr.length) return;
          await flash(stage, i, 'search');
          arr.splice(i, 1); render(stage);
          ctx.step = `Delete index ${i}`; ctx.complexity = 'O(n) — shift left'; ctx.code = 'arr.splice(i, 1)';
          ctx.history.push(`delete(${i})`);
        } else if (op === 'search') {
          if (!v) return;
          ctx.step = `Linear search for ${v}`; ctx.complexity = 'O(n)'; ctx.code = 'for i in 0..n: if arr[i]==v return i';
          for (let k = 0; k < arr.length; k++) {
            await flash(stage, k, 'search');
            if (String(arr[k]) === v) { await flash(stage, k, 'found'); ctx.history.push(`search(${v}) → found at ${k}`); return; }
          }
          ctx.history.push(`search(${v}) → not found`);
        } else if (op === 'update') {
          if (!Number.isFinite(i) || i < 0 || i >= arr.length || !v) return;
          arr[i] = isNaN(+v) ? v : +v; render(stage);
          ctx.step = `Update arr[${i}] = ${v}`; ctx.complexity = 'O(1)'; ctx.code = 'arr[i] = v';
          ctx.history.push(`update(${i}, ${v})`);
          await flash(stage, i);
        } else if (op === 'traverse') {
          ctx.step = `Traverse all ${arr.length} elements`; ctx.complexity = 'O(n)'; ctx.code = 'for i in 0..n: visit(arr[i])';
          for (let k = 0; k < arr.length; k++) await flash(stage, k);
          ctx.history.push('traverse()');
        }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: LINKED LIST (singly/doubly/circular)
     ========================================================= */
  (() => {
    let list = [];          // array of values
    let mode = 'singly';
    const render = (stage) => {
      stage.innerHTML = '';
      const row = el('div', { class: 'row', style: { flexWrap: 'wrap' } });
      row.appendChild(el('div', { class: 'pointer' }, 'HEAD'));
      if (!list.length) {
        row.appendChild(el('div', { style: { color: 'var(--muted)' } }, 'null'));
      } else {
        list.forEach((v, i) => {
          if (i > 0) row.appendChild(el('div', { class: 'arrow' }));
          if (mode === 'doubly' && i > 0) row.appendChild(el('div', { class: 'arrow', style: { transform: 'rotate(180deg)', marginLeft: '-20px' } }));
          const c = el('div', { class: 'cell', 'data-i': i }, String(v));
          row.appendChild(c);
        });
        if (mode === 'circular') {
          row.appendChild(el('div', { class: 'arrow' }));
          row.appendChild(el('div', { class: 'pointer' }, '↺ HEAD'));
        } else {
          row.appendChild(el('div', { class: 'arrow' }));
          row.appendChild(el('div', { style: { color: 'var(--muted)', fontFamily: 'var(--font-mono)' } }, 'null'));
        }
      }
      stage.appendChild(row);
    };
    const flash = async (stage, i) => {
      const c = stage.querySelector(`.cell[data-i="${i}"]`);
      if (c) { c.classList.add('flash'); await sleep(450); c.classList.remove('flash'); }
    };
    registerSim('linkedList', {
      title: 'Linked List Simulator', tabLabel: 'Linked List',
      description: 'Insert/delete/search/traverse on singly, doubly, or circular linked lists with arrow visualization.',
      controls: [
        { type: 'input', id: 'val', placeholder: 'value' },
        { type: 'input', id: 'pos', placeholder: 'position' },
        { type: 'btn', op: 'insBeg', label: 'Insert Head', primary: true },
        { type: 'btn', op: 'insEnd', label: 'Insert Tail' },
        { type: 'btn', op: 'insPos', label: 'Insert @ Pos' },
        { type: 'btn', op: 'del', label: 'Delete' },
        { type: 'btn', op: 'search', label: 'Search' },
        { type: 'btn', op: 'traverse', label: 'Traverse' },
        { type: 'btn', op: 'singly', label: 'Singly' },
        { type: 'btn', op: 'doubly', label: 'Doubly' },
        { type: 'btn', op: 'circular', label: 'Circular' },
      ],
      reset: () => { list = []; },
      render,
      serialize: () => `${mode} · [${list.join(' → ')}]  length=${list.length}`,
      async run(op, { getInput, ctx, stage }) {
        const v = getInput('val'); const p = parseInt(getInput('pos'), 10);
        if (['singly','doubly','circular'].includes(op)) { mode = op; render(stage); ctx.history.push(`mode → ${op}`); return; }
        if (op === 'example') { list = [10,20,30,40]; render(stage); ctx.history.push('example list'); return; }
        if (op === 'insBeg') { if (!v) return; list.unshift(isNaN(+v) ? v : +v); render(stage); ctx.step=`Insert ${v} at head`; ctx.complexity='O(1)'; ctx.code='node.next=head; head=node;'; ctx.history.push(`insertHead(${v})`); await flash(stage, 0); }
        else if (op === 'insEnd') { if (!v) return; list.push(isNaN(+v) ? v : +v); render(stage); ctx.step=`Insert ${v} at tail`; ctx.complexity='O(n) traverse + O(1) link'; ctx.code='tail.next=node; tail=node;'; ctx.history.push(`insertTail(${v})`); await flash(stage, list.length-1); }
        else if (op === 'insPos') { if (!v || !Number.isFinite(p)) return; const pos=Math.max(0,Math.min(list.length,p)); list.splice(pos,0,isNaN(+v)?v:+v); render(stage); ctx.step=`Insert ${v} at position ${pos}`; ctx.complexity='O(n)'; ctx.code='walk to pos-1; node.next=cur.next; cur.next=node;'; ctx.history.push(`insertAt(${pos}, ${v})`); await flash(stage, pos); }
        else if (op === 'del') { if (!v) return; const i = list.findIndex(x => String(x) === v); if (i < 0) { ctx.history.push(`delete(${v}) → not found`); return; } await flash(stage, i); list.splice(i,1); render(stage); ctx.step=`Unlink node ${v}`; ctx.complexity='O(n)'; ctx.code='prev.next = cur.next;'; ctx.history.push(`delete(${v})`); }
        else if (op === 'search') { if (!v) return; ctx.step=`Walk list to find ${v}`; ctx.complexity='O(n)'; ctx.code='while cur: if cur.val==v return; cur=cur.next';
          for (let k=0;k<list.length;k++){ await flash(stage,k); if (String(list[k])===v){ ctx.history.push(`search(${v}) → found at ${k}`); return; } }
          ctx.history.push(`search(${v}) → not found`);
        }
        else if (op === 'traverse') { ctx.step='Traverse from head'; ctx.complexity='O(n)'; ctx.code='cur=head; while cur: visit(cur); cur=cur.next'; for (let k=0;k<list.length;k++) await flash(stage,k); ctx.history.push('traverse'); }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: STACK
     ========================================================= */
  (() => {
    let stack = [];
    const render = (stage) => {
      stage.innerHTML = '';
      const wrap = el('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '16px' } });
      const col = el('div', { class: 'col' });
      stack.forEach((v, i) => {
        const c = el('div', { class: 'cell', 'data-i': i }, String(v));
        col.appendChild(c);
      });
      if (!stack.length) col.appendChild(el('div', { style: { color: 'var(--muted)' } }, 'empty stack'));
      const ptr = el('div', { class: 'pointer' }, `TOP = ${stack.length - 1}`);
      wrap.appendChild(col); wrap.appendChild(ptr);
      stage.appendChild(wrap);
    };
    const flashTop = async (stage) => { const cells = stage.querySelectorAll('.cell'); const c = cells[cells.length-1]; if (c) { c.classList.add('flash'); await sleep(450); c.classList.remove('flash'); } };
    registerSim('stack', {
      title: 'Stack Simulator', tabLabel: 'Stack',
      description: 'LIFO push/pop/peek with a top pointer.',
      controls: [
        { type: 'input', id: 'val', placeholder: 'value' },
        { type: 'btn', op: 'push', label: 'Push', primary: true },
        { type: 'btn', op: 'pop', label: 'Pop' },
        { type: 'btn', op: 'peek', label: 'Peek' },
      ],
      reset: () => { stack = []; },
      render,
      serialize: () => `top → [${[...stack].reverse().join(', ')}]  size=${stack.length}`,
      async run(op, { getInput, ctx, stage }) {
        const v = getInput('val');
        if (op === 'example') { stack = [1,2,3,4]; render(stage); ctx.history.push('example stack'); return; }
        if (op === 'push') { if (!v) return; stack.push(isNaN(+v)?v:+v); render(stage); ctx.step=`Push ${v} on top`; ctx.complexity='O(1)'; ctx.code='stack[++top] = v'; ctx.history.push(`push(${v})`); await flashTop(stage); }
        else if (op === 'pop') { if (!stack.length) { ctx.history.push('pop on empty'); return; } await flashTop(stage); const x = stack.pop(); render(stage); ctx.step=`Pop ${x}`; ctx.complexity='O(1)'; ctx.code='return stack[top--]'; ctx.history.push(`pop() → ${x}`); }
        else if (op === 'peek') { if (!stack.length) { ctx.history.push('peek on empty'); return; } await flashTop(stage); ctx.step=`Peek → ${stack[stack.length-1]}`; ctx.complexity='O(1)'; ctx.code='return stack[top]'; ctx.history.push(`peek → ${stack[stack.length-1]}`); }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: QUEUE (simple)
     ========================================================= */
  (() => {
    let q = [];
    const render = (stage) => {
      stage.innerHTML = '';
      const wrap = el('div', {});
      const ptrs = el('div', { style: { display:'flex', justifyContent:'space-between', marginBottom:'10px' } });
      ptrs.appendChild(el('div', { class: 'pointer' }, `FRONT = ${q.length ? q[0] : '∅'}`));
      ptrs.appendChild(el('div', { class: 'pointer' }, `REAR = ${q.length ? q[q.length-1] : '∅'}`));
      wrap.appendChild(ptrs);
      const row = el('div', { class: 'row' });
      if (!q.length) row.appendChild(el('div', { style: { color: 'var(--muted)' } }, 'empty queue'));
      q.forEach((v, i) => row.appendChild(el('div', { class: 'cell', 'data-i': i }, String(v))));
      wrap.appendChild(row);
      stage.appendChild(wrap);
    };
    const flash = async (stage, i) => { const c = stage.querySelector(`.cell[data-i="${i}"]`); if (c) { c.classList.add('flash'); await sleep(450); c.classList.remove('flash'); } };
    registerSim('queue', {
      title: 'Simple Queue Simulator', tabLabel: 'Queue',
      description: 'FIFO enqueue/dequeue with front and rear pointers.',
      controls: [
        { type: 'input', id: 'val', placeholder: 'value' },
        { type: 'btn', op: 'enq', label: 'Enqueue', primary: true },
        { type: 'btn', op: 'deq', label: 'Dequeue' },
        { type: 'btn', op: 'front', label: 'Front' },
        { type: 'btn', op: 'rear', label: 'Rear' },
      ],
      reset: () => { q = []; },
      render,
      serialize: () => `[${q.join(', ')}]  size=${q.length}`,
      async run(op, { getInput, ctx, stage }) {
        const v = getInput('val');
        if (op === 'example') { q = [10,20,30]; render(stage); ctx.history.push('example queue'); return; }
        if (op === 'enq') { if (!v) return; q.push(isNaN(+v)?v:+v); render(stage); ctx.step=`Enqueue ${v} at rear`; ctx.complexity='O(1)'; ctx.code='q[rear++] = v'; ctx.history.push(`enqueue(${v})`); await flash(stage, q.length-1); }
        else if (op === 'deq') { if (!q.length) { ctx.history.push('dequeue on empty'); return; } await flash(stage, 0); const x = q.shift(); render(stage); ctx.step=`Dequeue ${x}`; ctx.complexity='O(1)'; ctx.code='return q[front++]'; ctx.history.push(`dequeue → ${x}`); }
        else if (op === 'front') { if (!q.length) return; await flash(stage, 0); ctx.step=`Front → ${q[0]}`; ctx.complexity='O(1)'; ctx.code='return q[front]'; ctx.history.push(`front → ${q[0]}`); }
        else if (op === 'rear') { if (!q.length) return; await flash(stage, q.length-1); ctx.step=`Rear → ${q[q.length-1]}`; ctx.complexity='O(1)'; ctx.code='return q[rear-1]'; ctx.history.push(`rear → ${q[q.length-1]}`); }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: CIRCULAR QUEUE
     ========================================================= */
  (() => {
    const CAP = 8;
    let buf = new Array(CAP).fill(null);
    let front = -1, rear = -1, size = 0;
    const render = (stage) => {
      stage.innerHTML = '';
      const cx = 180, cy = 170, R = 130;
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 420 340'); svg.setAttribute('class','svg-stage');
      const grad = `<defs><radialGradient id="cqGrad"><stop offset="0%" stop-color="#7c5cff"/><stop offset="100%" stop-color="#22d3ee"/></radialGradient></defs>`;
      svg.innerHTML = grad;
      for (let i = 0; i < CAP; i++) {
        const a = (i / CAP) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        const inUse = size > 0 && ((front <= rear && i >= front && i <= rear) || (front > rear && (i >= front || i <= rear)));
        const isFront = inUse && i === front, isRear = inUse && i === rear;
        svg.insertAdjacentHTML('beforeend', `
          <circle cx="${x}" cy="${y}" r="26" class="node ${inUse ? 'flash':''}" data-i="${i}" />
          <text x="${x}" y="${y+4}" text-anchor="middle" class="node-label">${buf[i] ?? ''}</text>
          <text x="${x}" y="${y - 36}" text-anchor="middle" class="node-label" style="font-size:9px;fill:var(--muted)">${i}</text>
          ${isFront ? `<text x="${x}" y="${y + 48}" text-anchor="middle" class="node-label" style="fill:var(--primary-2);font-size:10px">FRONT</text>`:''}
          ${isRear ? `<text x="${x}" y="${y + 60}" text-anchor="middle" class="node-label" style="fill:var(--accent);font-size:10px">REAR</text>`:''}
        `);
      }
      stage.appendChild(svg);
    };
    registerSim('circularQueue', {
      title: 'Circular Queue Simulator', tabLabel: 'Circular Queue',
      description: `Fixed capacity ${CAP}. Watch indices wrap around using modulo arithmetic.`,
      controls: [
        { type: 'input', id: 'val', placeholder: 'value' },
        { type: 'btn', op: 'enq', label: 'Enqueue', primary: true },
        { type: 'btn', op: 'deq', label: 'Dequeue' },
        { type: 'btn', op: 'front', label: 'Front' },
        { type: 'btn', op: 'rear', label: 'Rear' },
      ],
      reset: () => { buf = new Array(CAP).fill(null); front = rear = -1; size = 0; },
      render,
      serialize: () => `front=${front} rear=${rear} size=${size}/${CAP}`,
      async run(op, { getInput, ctx, stage }) {
        const v = getInput('val');
        if (op === 'example') { this.reset(); ['A','B','C','D','E'].forEach(x => { rear = (rear + 1) % CAP; if (front === -1) front = 0; buf[rear] = x; size++; }); render(stage); ctx.history.push('example circular queue'); return; }
        if (op === 'enq') {
          if (!v) return;
          if (size === CAP) { ctx.history.push('overflow'); ctx.step='Queue full'; return; }
          rear = (rear + 1) % CAP; if (front === -1) front = 0;
          buf[rear] = isNaN(+v)?v:+v; size++;
          ctx.step=`Enqueue ${v} at index ${rear}`; ctx.complexity='O(1)'; ctx.code='rear=(rear+1)%CAP; buf[rear]=v;'; ctx.history.push(`enqueue(${v}) @ ${rear}`);
          render(stage);
        } else if (op === 'deq') {
          if (size === 0) { ctx.history.push('underflow'); ctx.step='Queue empty'; return; }
          const x = buf[front]; buf[front] = null;
          ctx.step=`Dequeue ${x} from index ${front}`; ctx.complexity='O(1)'; ctx.code='x=buf[front]; front=(front+1)%CAP;';
          if (size === 1) { front = rear = -1; } else { front = (front + 1) % CAP; }
          size--; render(stage); ctx.history.push(`dequeue → ${x}`);
        } else if (op === 'front') { if (size>0) { ctx.step=`Front → ${buf[front]}`; ctx.complexity='O(1)'; ctx.code='return buf[front]'; ctx.history.push(`front → ${buf[front]}`); } }
        else if (op === 'rear') { if (size>0) { ctx.step=`Rear → ${buf[rear]}`; ctx.complexity='O(1)'; ctx.code='return buf[rear]'; ctx.history.push(`rear → ${buf[rear]}`); } }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: PRIORITY QUEUE
     ========================================================= */
  (() => {
    let pq = []; // { val, pri }
    const render = (stage) => {
      stage.innerHTML = '';
      const row = el('div', { class: 'row', style: { flexDirection: 'column', alignItems: 'flex-start' } });
      if (!pq.length) { row.appendChild(el('div', { style: { color: 'var(--muted)' } }, 'empty priority queue')); }
      pq.forEach((n, i) => {
        const item = el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } });
        item.appendChild(el('div', { class: 'cell', 'data-i': i }, String(n.val)));
        item.appendChild(el('div', { style: { fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--primary-2)' } }, `priority=${n.pri}`));
        if (i === 0) item.appendChild(el('div', { class: 'pointer' }, 'NEXT'));
        row.appendChild(item);
      });
      stage.appendChild(row);
    };
    registerSim('priorityQueue', {
      title: 'Priority Queue Simulator', tabLabel: 'Priority Queue',
      description: 'Insert with a priority; the highest-priority element is always dequeued first.',
      controls: [
        { type: 'input', id: 'val', placeholder: 'value' },
        { type: 'input', id: 'pri', placeholder: 'priority (number)' },
        { type: 'btn', op: 'ins', label: 'Insert', primary: true },
        { type: 'btn', op: 'del', label: 'Delete Max' },
        { type: 'btn', op: 'peek', label: 'Peek' },
      ],
      reset: () => { pq = []; },
      render,
      serialize: () => pq.map(n => `${n.val}(${n.pri})`).join(', ') || 'empty',
      async run(op, { getInput, ctx, stage }) {
        const v = getInput('val'); const p = parseInt(getInput('pri'), 10);
        if (op === 'example') { pq = [{val:'task-A',pri:5},{val:'task-B',pri:9},{val:'task-C',pri:2},{val:'task-D',pri:7}]; pq.sort((a,b)=>b.pri-a.pri); render(stage); ctx.history.push('example pq'); return; }
        if (op === 'ins') { if (!v || !Number.isFinite(p)) return; pq.push({ val: isNaN(+v)?v:+v, pri: p }); pq.sort((a,b)=>b.pri-a.pri); render(stage); ctx.step=`Insert ${v} with priority ${p}`; ctx.complexity='O(log n) heap / O(n log n) sort'; ctx.code='heap.push({v,p}); sift_up();'; ctx.history.push(`insert(${v}, p=${p})`); }
        else if (op === 'del') { if (!pq.length) return; const x = pq.shift(); render(stage); ctx.step=`Delete max → ${x.val}`; ctx.complexity='O(log n)'; ctx.code='swap(0, n-1); pop; sift_down();'; ctx.history.push(`deleteMax → ${x.val}`); }
        else if (op === 'peek') { if (!pq.length) return; ctx.step=`Peek → ${pq[0].val} (p=${pq[0].pri})`; ctx.complexity='O(1)'; ctx.code='return heap[0]'; ctx.history.push(`peek → ${pq[0].val}`); }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: DEQUE
     ========================================================= */
  (() => {
    let dq = [];
    const render = (stage) => {
      stage.innerHTML = '';
      const wrap = el('div', {});
      const ptrs = el('div', { style: { display:'flex', justifyContent:'space-between', marginBottom:'10px' } });
      ptrs.appendChild(el('div', { class: 'pointer' }, `FRONT`));
      ptrs.appendChild(el('div', { class: 'pointer' }, `REAR`));
      wrap.appendChild(ptrs);
      const row = el('div', { class: 'row' });
      if (!dq.length) row.appendChild(el('div', { style: { color: 'var(--muted)' } }, 'empty deque'));
      dq.forEach((v, i) => row.appendChild(el('div', { class: 'cell', 'data-i': i }, String(v))));
      wrap.appendChild(row); stage.appendChild(wrap);
    };
    const flash = async (stage, i) => { const c = stage.querySelector(`.cell[data-i="${i}"]`); if (c) { c.classList.add('flash'); await sleep(450); c.classList.remove('flash'); } };
    registerSim('deque', {
      title: 'Deque Simulator', tabLabel: 'Deque',
      description: 'Insert and remove from both ends in O(1).',
      controls: [
        { type: 'input', id: 'val', placeholder: 'value' },
        { type: 'btn', op: 'pf', label: 'Push Front', primary: true },
        { type: 'btn', op: 'pr', label: 'Push Rear' },
        { type: 'btn', op: 'df', label: 'Pop Front' },
        { type: 'btn', op: 'dr', label: 'Pop Rear' },
        { type: 'btn', op: 'gf', label: 'Get Front' },
        { type: 'btn', op: 'gr', label: 'Get Rear' },
      ],
      reset: () => { dq = []; },
      render,
      serialize: () => `[${dq.join(', ')}]  size=${dq.length}`,
      async run(op, { getInput, ctx, stage }) {
        const v = getInput('val');
        if (op === 'example') { dq = [20,30,40]; render(stage); ctx.history.push('example deque'); return; }
        if (op === 'pf') { if (!v) return; dq.unshift(isNaN(+v)?v:+v); render(stage); ctx.step=`pushFront ${v}`; ctx.complexity='O(1)'; ctx.code='dq.unshift(v)'; ctx.history.push(`pushFront(${v})`); await flash(stage, 0); }
        else if (op === 'pr') { if (!v) return; dq.push(isNaN(+v)?v:+v); render(stage); ctx.step=`pushRear ${v}`; ctx.complexity='O(1)'; ctx.code='dq.push(v)'; ctx.history.push(`pushRear(${v})`); await flash(stage, dq.length-1); }
        else if (op === 'df') { if (!dq.length) return; await flash(stage, 0); const x = dq.shift(); render(stage); ctx.step=`popFront → ${x}`; ctx.complexity='O(1)'; ctx.code='dq.shift()'; ctx.history.push(`popFront → ${x}`); }
        else if (op === 'dr') { if (!dq.length) return; await flash(stage, dq.length-1); const x = dq.pop(); render(stage); ctx.step=`popRear → ${x}`; ctx.complexity='O(1)'; ctx.code='dq.pop()'; ctx.history.push(`popRear → ${x}`); }
        else if (op === 'gf') { if (!dq.length) return; await flash(stage, 0); ctx.step=`getFront → ${dq[0]}`; ctx.complexity='O(1)'; ctx.code='return dq[0]'; ctx.history.push(`getFront → ${dq[0]}`); }
        else if (op === 'gr') { if (!dq.length) return; await flash(stage, dq.length-1); ctx.step=`getRear → ${dq[dq.length-1]}`; ctx.complexity='O(1)'; ctx.code='return dq[n-1]'; ctx.history.push(`getRear → ${dq[dq.length-1]}`); }
      }
    });
  })();

  /* =========================================================
     TREE HELPERS (shared)
     ========================================================= */
  class TreeNode {
    constructor(val) { this.val = val; this.left = null; this.right = null; }
  }
  function layoutTree(root) {
    // Assign x via inorder index, y via depth
    const positions = new Map();
    let idx = 0; let maxDepth = 0;
    (function walk(n, d) {
      if (!n) return;
      walk(n.left, d+1);
      positions.set(n, { x: idx++, y: d });
      maxDepth = Math.max(maxDepth, d);
      walk(n.right, d+1);
    })(root, 0);
    return { positions, count: idx, depth: maxDepth };
  }
  function renderTreeSVG(root, stage, highlight = new Set(), visited = new Set()) {
    stage.innerHTML = '';
    if (!root) { stage.appendChild(el('div', { style: { color: 'var(--muted)' } }, 'empty tree')); return; }
    const { positions, count, depth } = layoutTree(root);
    const W = Math.max(420, count * 60), H = Math.max(240, (depth + 1) * 80);
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class','svg-stage');
    svg.innerHTML = `<defs><radialGradient id="nodeGrad"><stop offset="0%" stop-color="#7c5cff"/><stop offset="100%" stop-color="#22d3ee"/></radialGradient></defs>`;
    const xs = (n) => 30 + positions.get(n).x * ((W - 60) / Math.max(1, count - 1));
    const ys = (n) => 40 + positions.get(n).y * ((H - 80) / Math.max(1, depth));
    (function drawEdges(n) {
      if (!n) return;
      [n.left, n.right].forEach(c => {
        if (c) svg.insertAdjacentHTML('beforeend', `<line class="edge" x1="${xs(n)}" y1="${ys(n)}" x2="${xs(c)}" y2="${ys(c)}" />`);
      });
      drawEdges(n.left); drawEdges(n.right);
    })(root);
    (function drawNodes(n) {
      if (!n) return;
      const x = xs(n), y = ys(n);
      const cls = visited.has(n) ? 'node visited' : highlight.has(n) ? 'node flash' : 'node';
      svg.insertAdjacentHTML('beforeend', `<circle cx="${x}" cy="${y}" r="20" class="${cls}" /><text x="${x}" y="${y+4}" text-anchor="middle" class="node-label">${n.val}</text>`);
      drawNodes(n.left); drawNodes(n.right);
    })(root);
    stage.appendChild(svg);
  }

  /* =========================================================
     SIMULATOR: BINARY TREE (level-order insert)
     ========================================================= */
  (() => {
    let root = null;
    const insertLevel = (v) => {
      const node = new TreeNode(v);
      if (!root) { root = node; return; }
      const q = [root];
      while (q.length) {
        const n = q.shift();
        if (!n.left) { n.left = node; return; }
        else q.push(n.left);
        if (!n.right) { n.right = node; return; }
        else q.push(n.right);
      }
    };
    const deleteNode = (v) => {
      if (!root) return;
      // find deepest rightmost; replace target
      const q = [root]; let target = null, last = null, parentLast = null;
      while (q.length) { const n = q.shift(); if (String(n.val) === v) target = n; if (n.left) { parentLast = n; q.push(n.left); } if (n.right) { parentLast = n; q.push(n.right); } last = n; }
      if (!target) return;
      target.val = last.val;
      // remove last
      (function rm(n){ if (!n) return; if (n.left===last) n.left=null; else rm(n.left); if (n.right===last) n.right=null; else rm(n.right); })(root);
      if (root === last) root = null;
    };
    registerSim('binaryTree', {
      title: 'Binary Tree Simulator', tabLabel: 'Binary Tree',
      description: 'Level-order insert, deletion, and DFS traversals (inorder/preorder/postorder).',
      controls: [
        { type: 'input', id: 'val', placeholder: 'value' },
        { type: 'btn', op: 'ins', label: 'Insert', primary: true },
        { type: 'btn', op: 'del', label: 'Delete' },
        { type: 'btn', op: 'search', label: 'Search' },
        { type: 'btn', op: 'in', label: 'Inorder' },
        { type: 'btn', op: 'pre', label: 'Preorder' },
        { type: 'btn', op: 'post', label: 'Postorder' },
      ],
      reset: () => { root = null; },
      render: (stage) => renderTreeSVG(root, stage),
      serialize: () => root ? `root=${root.val}` : 'empty',
      async run(op, { getInput, ctx, stage }) {
        const v = getInput('val');
        if (op === 'example') { this.reset(); [50,30,70,20,40,60,80].forEach(insertLevel); renderTreeSVG(root, stage); ctx.history.push('example bt'); return; }
        if (op === 'ins') { if (!v) return; insertLevel(isNaN(+v)?v:+v); renderTreeSVG(root, stage); ctx.step=`Insert ${v} at first empty position (level-order)`; ctx.complexity='O(n)'; ctx.code='BFS; place at first null child'; ctx.history.push(`insert(${v})`); }
        else if (op === 'del') { if (!v) return; deleteNode(v); renderTreeSVG(root, stage); ctx.step=`Delete ${v} (replace with deepest)`; ctx.complexity='O(n)'; ctx.code='find target; swap with deepest; remove deepest'; ctx.history.push(`delete(${v})`); }
        else if (op === 'search') { if (!v) return; const visited = new Set(); let found = null;
          (function dfs(n){ if (!n||found) return; visited.add(n); if (String(n.val)===v) { found = n; return; } dfs(n.left); dfs(n.right); })(root);
          renderTreeSVG(root, stage, new Set(found?[found]:[]), visited);
          ctx.step = found ? `Found ${v}` : `Not found`; ctx.complexity='O(n)'; ctx.code='DFS until match'; ctx.history.push(`search(${v}) → ${found?'found':'miss'}`);
        }
        else if (['in','pre','post'].includes(op)) {
          const order = []; const seq = [];
          (function walk(n) {
            if (!n) return;
            if (op==='pre') seq.push(n);
            walk(n.left);
            if (op==='in') seq.push(n);
            walk(n.right);
            if (op==='post') seq.push(n);
          })(root);
          const visited = new Set();
          for (const n of seq) { visited.add(n); order.push(n.val); renderTreeSVG(root, stage, new Set([n]), visited); await sleep(450); }
          renderTreeSVG(root, stage, new Set(), visited);
          ctx.step = `${op}order → [${order.join(', ')}]`; ctx.complexity='O(n)'; ctx.code=op==='in'?'walk L, visit, walk R':op==='pre'?'visit, walk L, walk R':'walk L, walk R, visit';
          ctx.history.push(`${op}order → ${order.join(',')}`);
        }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: BST
     ========================================================= */
  (() => {
    let root = null;
    const insert = (n, v) => { if (!n) return new TreeNode(v); if (v < n.val) n.left = insert(n.left, v); else if (v > n.val) n.right = insert(n.right, v); return n; };
    const min = (n) => { while (n.left) n = n.left; return n; };
    const del = (n, v) => {
      if (!n) return null;
      if (v < n.val) n.left = del(n.left, v);
      else if (v > n.val) n.right = del(n.right, v);
      else { if (!n.left) return n.right; if (!n.right) return n.left; const m = min(n.right); n.val = m.val; n.right = del(n.right, m.val); }
      return n;
    };
    registerSim('bst', {
      title: 'Binary Search Tree Simulator', tabLabel: 'BST',
      description: 'Auto-maintains BST invariant on insert/delete; animated inorder traversal yields sorted order.',
      controls: [
        { type: 'input', id: 'val', placeholder: 'numeric value' },
        { type: 'btn', op: 'ins', label: 'Insert', primary: true },
        { type: 'btn', op: 'del', label: 'Delete' },
        { type: 'btn', op: 'search', label: 'Search' },
        { type: 'btn', op: 'in', label: 'Inorder' },
      ],
      reset: () => { root = null; },
      render: (stage) => renderTreeSVG(root, stage),
      serialize: () => root ? `root=${root.val}` : 'empty',
      async run(op, { getInput, ctx, stage }) {
        const v = +getInput('val');
        if (op === 'example') { this.reset(); [50,30,70,20,40,60,80,10,35].forEach(x => { root = insert(root, x); }); renderTreeSVG(root, stage); ctx.history.push('example bst'); return; }
        if (op === 'ins') { if (!Number.isFinite(v)) return; root = insert(root, v); renderTreeSVG(root, stage); ctx.step=`Insert ${v} maintaining BST property`; ctx.complexity='O(log n) avg / O(n) worst'; ctx.code='if v<n.val: left=insert(left,v) else: right=insert(right,v)'; ctx.history.push(`insert(${v})`); }
        else if (op === 'del') { if (!Number.isFinite(v)) return; root = del(root, v); renderTreeSVG(root, stage); ctx.step=`Delete ${v} (replace with inorder successor if 2 kids)`; ctx.complexity='O(log n) avg'; ctx.code='find; if 2 kids → swap with min(right); recurse'; ctx.history.push(`delete(${v})`); }
        else if (op === 'search') {
          if (!Number.isFinite(v)) return; const visited = new Set(); let n = root, found = null;
          while (n) { visited.add(n); renderTreeSVG(root, stage, new Set([n]), visited); await sleep(380); if (n.val === v) { found = n; break; } n = v < n.val ? n.left : n.right; }
          renderTreeSVG(root, stage, new Set(found?[found]:[]), visited);
          ctx.step = found ? `Found ${v}` : `${v} not in tree`; ctx.complexity='O(log n) avg'; ctx.code='walk left if v<n else right'; ctx.history.push(`search(${v}) → ${found?'found':'miss'}`);
        }
        else if (op === 'in') {
          const seq = []; (function w(n){ if(!n) return; w(n.left); seq.push(n); w(n.right); })(root);
          const visited = new Set();
          for (const n of seq) { visited.add(n); renderTreeSVG(root, stage, new Set([n]), visited); await sleep(380); }
          renderTreeSVG(root, stage, new Set(), visited);
          ctx.step = `Inorder → [${seq.map(n=>n.val).join(', ')}] (sorted)`; ctx.complexity='O(n)'; ctx.code='walk left; visit; walk right'; ctx.history.push('inorder');
        }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: HEAP (max-heap)
     ========================================================= */
  (() => {
    let h = [];
    const swap = (i,j) => { [h[i],h[j]] = [h[j],h[i]]; };
    const up = (i) => { while (i>0) { const p=(i-1)>>1; if (h[p]<h[i]) { swap(p,i); i=p; } else break; } };
    const down = (i) => {
      const n = h.length;
      while (true) {
        const l=2*i+1, r=2*i+2; let b=i;
        if (l<n && h[l]>h[b]) b=l;
        if (r<n && h[r]>h[b]) b=r;
        if (b===i) break; swap(b,i); i=b;
      }
    };
    const buildTree = () => {
      if (!h.length) return null;
      const nodes = h.map(v => new TreeNode(v));
      for (let i=0;i<nodes.length;i++) {
        if (2*i+1 < nodes.length) nodes[i].left = nodes[2*i+1];
        if (2*i+2 < nodes.length) nodes[i].right = nodes[2*i+2];
      }
      return nodes[0];
    };
    const render = (stage) => {
      stage.innerHTML = '';
      const wrap = el('div', { style: { display:'grid', gridTemplateColumns:'1fr', gap:'16px', width:'100%' } });
      const treeBox = el('div');
      renderTreeSVG(buildTree(), treeBox);
      wrap.appendChild(treeBox);
      const arrRow = el('div', { class: 'row', style: { justifyContent:'center' } });
      arrRow.appendChild(el('div', { class: 'pointer' }, 'ARRAY'));
      h.forEach((v,i) => {
        const c = el('div', { class: 'cell' }, String(v));
        c.appendChild(el('span', { class: 'idx' }, String(i)));
        arrRow.appendChild(c);
      });
      if (!h.length) arrRow.appendChild(el('div', { style: { color: 'var(--muted)' } }, 'empty heap'));
      wrap.appendChild(arrRow);
      stage.appendChild(wrap);
    };
    registerSim('heap', {
      title: 'Heap Simulator (Max-Heap)', tabLabel: 'Heap',
      description: 'Tree + array views side by side. Insert sifts up, delete-root sifts down.',
      controls: [
        { type: 'input', id: 'val', placeholder: 'numeric value' },
        { type: 'btn', op: 'ins', label: 'Insert', primary: true },
        { type: 'btn', op: 'del', label: 'Delete Root' },
        { type: 'btn', op: 'heapify', label: 'Heapify' },
      ],
      reset: () => { h = []; },
      render,
      serialize: () => `[${h.join(', ')}]  size=${h.length}`,
      async run(op, { getInput, ctx, stage }) {
        const v = +getInput('val');
        if (op === 'example') { h = [40, 10, 30, 5, 7, 20, 25, 3]; render(stage); ctx.history.push('example array (pre-heapify)'); return; }
        if (op === 'ins') { if (!Number.isFinite(v)) return; h.push(v); up(h.length-1); render(stage); ctx.step=`Insert ${v}; sift up to restore heap`; ctx.complexity='O(log n)'; ctx.code='h.push(v); siftUp(n-1);'; ctx.history.push(`insert(${v})`); }
        else if (op === 'del') { if (!h.length) return; const x = h[0]; h[0] = h[h.length-1]; h.pop(); down(0); render(stage); ctx.step=`Delete root ${x}; move last to root and sift down`; ctx.complexity='O(log n)'; ctx.code='h[0]=h.pop(); siftDown(0);'; ctx.history.push(`delete → ${x}`); }
        else if (op === 'heapify') { for (let i=(h.length>>1)-1;i>=0;i--) down(i); render(stage); ctx.step='Heapify entire array bottom-up'; ctx.complexity='O(n)'; ctx.code='for i = n/2-1..0: siftDown(i)'; ctx.history.push('heapify'); }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: TRIE
     ========================================================= */
  (() => {
    class TrieNode { constructor() { this.ch = {}; this.end = false; } }
    let root = new TrieNode();
    const insert = (w) => { let n = root; for (const c of w) { if (!n.ch[c]) n.ch[c] = new TrieNode(); n = n.ch[c]; } n.end = true; };
    const search = (w) => { let n = root; for (const c of w) { if (!n.ch[c]) return false; n = n.ch[c]; } return n.end; };
    const remove = (n, w, d=0) => { if (!n) return null; if (d===w.length) { n.end=false; } else { n.ch[w[d]] = remove(n.ch[w[d]], w, d+1); } if (!n.end && Object.keys(n.ch).length===0 && d>0) return null; return n; };
    const layoutTrie = () => {
      // Compute positions via DFS, x by leaf-index, y by depth
      const nodes = []; let idx = 0; let maxD = 0;
      (function walk(n, depth, parent, label) {
        const id = nodes.length; nodes.push({ n, depth, parent, label, x: 0 });
        maxD = Math.max(maxD, depth);
        const keys = Object.keys(n.ch);
        if (!keys.length) { nodes[id].x = idx++; return; }
        keys.sort().forEach(k => walk(n.ch[k], depth+1, id, k));
        // x = average of children
        const childIds = nodes.map((x,i) => x.parent===id ? i : -1).filter(i => i>=0);
        nodes[id].x = childIds.reduce((s,i) => s + nodes[i].x, 0) / childIds.length;
      })(root, 0, -1, '·');
      return { nodes, count: Math.max(1, idx), depth: maxD };
    };
    const render = (stage) => {
      stage.innerHTML = '';
      const { nodes, count, depth } = layoutTrie();
      const W = Math.max(420, count * 70), H = Math.max(220, (depth+1) * 80);
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class','svg-stage');
      const xs = (i) => 30 + nodes[i].x * ((W - 60) / Math.max(1, count - 1 || 1));
      const ys = (i) => 40 + nodes[i].depth * ((H - 80) / Math.max(1, depth || 1));
      nodes.forEach((nd, i) => {
        if (nd.parent >= 0) svg.insertAdjacentHTML('beforeend', `<line class="edge" x1="${xs(nd.parent)}" y1="${ys(nd.parent)}" x2="${xs(i)}" y2="${ys(i)}" /><text x="${(xs(nd.parent)+xs(i))/2}" y="${(ys(nd.parent)+ys(i))/2 - 4}" text-anchor="middle" class="node-label" style="font-size:10px;fill:var(--primary-2)">${nd.label}</text>`);
      });
      nodes.forEach((nd, i) => {
        const fill = nd.n.end ? 'var(--success)' : 'var(--surface-strong)';
        svg.insertAdjacentHTML('beforeend', `<circle cx="${xs(i)}" cy="${ys(i)}" r="16" class="node" style="fill:${fill}"/><text x="${xs(i)}" y="${ys(i)+4}" text-anchor="middle" class="node-label">${i===0?'·':nd.label}</text>`);
      });
      stage.appendChild(svg);
    };
    registerSim('trie', {
      title: 'Trie Simulator', tabLabel: 'Trie',
      description: 'Insert/search/delete words. Terminal nodes glow green.',
      controls: [
        { type: 'input', id: 'val', placeholder: 'word' },
        { type: 'btn', op: 'ins', label: 'Insert', primary: true },
        { type: 'btn', op: 'search', label: 'Search' },
        { type: 'btn', op: 'del', label: 'Delete' },
      ],
      reset: () => { root = new TrieNode(); },
      render,
      serialize: () => 'trie (terminal nodes in green)',
      async run(op, { getInput, ctx, stage }) {
        const w = getInput('val').toLowerCase();
        if (op === 'example') { this.reset(); ['cat','car','card','care','dog','dot','do'].forEach(insert); render(stage); ctx.history.push('example trie'); return; }
        if (op === 'ins') { if (!w) return; insert(w); render(stage); ctx.step=`Insert "${w}" — descend char-by-char, creating nodes`; ctx.complexity='O(L)'; ctx.code='for c in w: n = n.ch.setdefault(c, new Node); n.end=true'; ctx.history.push(`insert(${w})`); }
        else if (op === 'search') { if (!w) return; const ok = search(w); ctx.step=`Search "${w}" → ${ok ? 'found' : 'not found'}`; ctx.complexity='O(L)'; ctx.code='walk children; return n.end'; ctx.history.push(`search(${w}) → ${ok}`); }
        else if (op === 'del') { if (!w) return; root = remove(root, w) || new TrieNode(); render(stage); ctx.step=`Delete "${w}" — unmark terminal and prune empty branches`; ctx.complexity='O(L)'; ctx.code='recurse; on return prune nodes with no children & not terminal'; ctx.history.push(`delete(${w})`); }
      }
    });
  })();

  /* =========================================================
     SIMULATOR: GRAPH
     ========================================================= */
  (() => {
    let vertices = []; // { id, x, y }
    let edges = [];    // { a, b }
    let directed = false;
    const layout = () => {
      const cx = 230, cy = 180, R = 130;
      vertices.forEach((v, i) => {
        const a = (i / Math.max(1, vertices.length)) * Math.PI * 2 - Math.PI / 2;
        v.x = cx + Math.cos(a) * R;
        v.y = cy + Math.sin(a) * R;
      });
    };
    const render = (stage, highlight = new Set(), visited = new Set(), activeEdge = null) => {
      stage.innerHTML = '';
      if (!vertices.length) { stage.appendChild(el('div', { style: { color: 'var(--muted)' } }, 'empty graph — add a vertex')); return; }
      layout();
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 460 360'); svg.setAttribute('class','svg-stage');
      svg.innerHTML = `<defs><marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-dim)"/></marker></defs>`;
      edges.forEach((e, i) => {
        const a = vertices.find(v => v.id === e.a), b = vertices.find(v => v.id === e.b);
        if (!a || !b) return;
        const active = activeEdge && ((activeEdge.a===e.a && activeEdge.b===e.b)||(!directed && activeEdge.a===e.b && activeEdge.b===e.a));
        svg.insertAdjacentHTML('beforeend', `<line class="edge ${active?'active':''}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" ${directed?'marker-end="url(#arr)"':''} />`);
      });
      vertices.forEach(v => {
        const cls = visited.has(v.id) ? 'node visited' : highlight.has(v.id) ? 'node flash' : 'node';
        svg.insertAdjacentHTML('beforeend', `<circle cx="${v.x}" cy="${v.y}" r="22" class="${cls}"/><text x="${v.x}" y="${v.y+4}" text-anchor="middle" class="node-label">${v.id}</text>`);
      });
      stage.appendChild(svg);
    };
    const adj = (id) => {
      const out = [];
      edges.forEach(e => {
        if (e.a === id) out.push(e.b);
        else if (!directed && e.b === id) out.push(e.a);
      });
      return out;
    };
    registerSim('graph', {
      title: 'Graph Simulator', tabLabel: 'Graph',
      description: 'Add/remove vertices and edges; run animated BFS/DFS traversals. Toggle directed mode.',
      controls: [
        { type: 'input', id: 'v', placeholder: 'vertex' },
        { type: 'input', id: 'e', placeholder: 'edge "A,B"' },
        { type: 'btn', op: 'addV', label: 'Add Vertex', primary: true },
        { type: 'btn', op: 'addE', label: 'Add Edge' },
        { type: 'btn', op: 'rmV', label: 'Remove Vertex' },
        { type: 'btn', op: 'rmE', label: 'Remove Edge' },
        { type: 'btn', op: 'bfs', label: 'BFS' },
        { type: 'btn', op: 'dfs', label: 'DFS' },
        { type: 'btn', op: 'dir', label: 'Toggle Directed' },
      ],
      reset: () => { vertices = []; edges = []; directed = false; },
      render: (stage) => render(stage),
      serialize: () => `${directed?'directed':'undirected'} · V=${vertices.length} E=${edges.length}`,
      async run(op, { getInput, ctx, stage }) {
        const v = getInput('v').toUpperCase(); const e = getInput('e').toUpperCase();
        if (op === 'example') { this.reset(); ['A','B','C','D','E','F'].forEach(id => vertices.push({id,x:0,y:0})); [['A','B'],['A','C'],['B','D'],['C','D'],['D','E'],['E','F'],['C','F']].forEach(([a,b])=>edges.push({a,b})); render(stage); ctx.history.push('example graph'); return; }
        if (op === 'addV') { if (!v || vertices.find(x=>x.id===v)) return; vertices.push({id:v,x:0,y:0}); render(stage); ctx.step=`Add vertex ${v}`; ctx.complexity='O(1)'; ctx.code='V.add(v)'; ctx.history.push(`addV(${v})`); }
        else if (op === 'addE') { const [a,b] = e.split(',').map(s=>s.trim()); if (!a||!b||!vertices.find(x=>x.id===a)||!vertices.find(x=>x.id===b)) return; edges.push({a,b}); render(stage); ctx.step=`Add edge ${a}-${b}`; ctx.complexity='O(1)'; ctx.code='E.add({a,b})'; ctx.history.push(`addE(${a},${b})`); }
        else if (op === 'rmV') { if (!v) return; vertices = vertices.filter(x=>x.id!==v); edges = edges.filter(x=>x.a!==v && x.b!==v); render(stage); ctx.step=`Remove vertex ${v} and incident edges`; ctx.complexity='O(V+E)'; ctx.code='V.remove(v); E.filter(...)'; ctx.history.push(`rmV(${v})`); }
        else if (op === 'rmE') { const [a,b] = e.split(',').map(s=>s.trim()); edges = edges.filter(x => !(x.a===a&&x.b===b) && (directed || !(x.a===b&&x.b===a))); render(stage); ctx.step=`Remove edge ${a}-${b}`; ctx.complexity='O(E)'; ctx.code='E.remove({a,b})'; ctx.history.push(`rmE(${a},${b})`); }
        else if (op === 'dir') { directed = !directed; render(stage); ctx.step=`Directed = ${directed}`; ctx.history.push(`directed → ${directed}`); }
        else if (op === 'bfs' || op === 'dfs') {
          if (!vertices.length) return;
          const start = (v && vertices.find(x=>x.id===v)) ? v : vertices[0].id;
          const visited = new Set(); const order = [];
          if (op === 'bfs') {
            const q = [start]; visited.add(start);
            while (q.length) {
              const cur = q.shift(); order.push(cur);
              render(stage, new Set([cur]), visited);
              await sleep(450);
              for (const nb of adj(cur)) if (!visited.has(nb)) { visited.add(nb); q.push(nb); render(stage, new Set([cur,nb]), visited, {a:cur,b:nb}); await sleep(300); }
            }
            ctx.code = 'q=[s]; while q: c=q.popleft(); for nb in adj(c): if !v: q.push(nb)';
          } else {
            (async function dfs(c) {
              if (visited.has(c)) return; visited.add(c); order.push(c);
              render(stage, new Set([c]), visited);
              await sleep(450);
              for (const nb of adj(c)) { if (!visited.has(nb)) { render(stage, new Set([c,nb]), visited, {a:c,b:nb}); await sleep(300); await dfs(nb); } }
            })(start);
            await sleep(50);
            ctx.code = 'dfs(c): visit(c); for nb in adj(c): if !v: dfs(nb)';
          }
          render(stage, new Set(), visited);
          ctx.step = `${op.toUpperCase()} from ${start} → [${order.join(', ')}]`;
          ctx.complexity = 'O(V+E)'; ctx.history.push(`${op}(${start}) → ${order.join(',')}`);
        }
      }
    });
  })();

  /* =========================================================
     BOOT
     ========================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    renderTree();
    renderCards();
    setupSearch();
    renderComplexity();
    renderSimTabs();
    switchSim('array');
    $$('.section').forEach(observeReveal);
  });
})();