const validateEntry = (entry) => {
    const trimmed = entry.trim();
    if (!trimmed) return { isValid: false, cleaned: trimmed };
    const regex = /^[A-Z]->[A-Z]$/;
    if (!regex.test(trimmed)) return { isValid: false, cleaned: trimmed };
    const [parent, child] = trimmed.split('->');
    if (parent === child) return { isValid: false, cleaned: trimmed };
    return { isValid: true, cleaned: trimmed, parent, child };
};

const processHierarchies = (data) => {
    const invalid_entries = [];
    const duplicate_edges = new Set();
    const seen_edges = new Set();
    const valid_edges = [];
    const nodes = new Set();

    // Step 1 & 2: Validate and Remove Duplicates
    data.forEach(entry => {
        const { isValid, cleaned, parent, child } = validateEntry(entry);
        if (!isValid) {
            invalid_entries.push(cleaned);
        } else {
            if (seen_edges.has(cleaned)) {
                duplicate_edges.add(cleaned);
            } else {
                seen_edges.add(cleaned);
                valid_edges.push({ parent, child, edge: cleaned });
                nodes.add(parent);
                nodes.add(child);
            }
        }
    });

    // Step 3: Build Graph with Multi-parent rule
    const adj = {};
    const childToParent = {};
    const filtered_edges = [];

    valid_edges.forEach(({ parent, child, edge }) => {
        if (childToParent[child] !== undefined) {
            // Silently discard later parent
            return;
        }
        childToParent[child] = parent;
        if (!adj[parent]) adj[parent] = [];
        adj[parent].push(child);
        filtered_edges.push({ parent, child });
    });

    // Step 4: Connected Components
    const parentMap = {};
    const find = (i) => {
        if (parentMap[i] === undefined) return i;
        if (parentMap[i] === i) return i;
        return parentMap[i] = find(parentMap[i]);
    };
    const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) parentMap[rootI] = rootJ;
    };

    const allNodes = Array.from(nodes);
    allNodes.forEach(node => parentMap[node] = node);
    filtered_edges.forEach(({ parent, child }) => union(parent, child));

    const components = {};
    allNodes.forEach(node => {
        const root = find(node);
        if (!components[root]) components[root] = [];
        components[root].push(node);
    });

    // Step 5-9: Process each component
    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let maxDepth = -1;
    let largestTreeRoot = null;

    Object.values(components).forEach(group => {
        const groupSet = new Set(group);
        const groupAdj = {};
        group.forEach(n => groupAdj[n] = adj[n] || []);

        // Cycle Detection
        let hasCycle = false;
        const visited = new Set();
        const recStack = new Set();

        const detectCycle = (u) => {
            visited.add(u);
            recStack.add(u);
            for (const v of (groupAdj[u] || [])) {
                if (!visited.has(v)) {
                    if (detectCycle(v)) return true;
                } else if (recStack.has(v)) {
                    return true;
                }
            }
            recStack.delete(u);
            return false;
        };

        for (const node of group) {
            if (!visited.has(node)) {
                if (detectCycle(node)) {
                    hasCycle = true;
                    break;
                }
            }
        }

        // Find Root
        let root = null;
        if (!hasCycle) {
            const potentialRoots = group.filter(n => childToParent[n] === undefined);
            // In a valid tree component, there should be exactly one root.
            root = potentialRoots.sort()[0]; 
        } else {
            root = group.sort()[0];
        }

        if (hasCycle) {
            total_cycles++;
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
        } else {
            total_trees++;
            const buildTree = (u) => {
                const nodeObj = {};
                (groupAdj[u] || []).sort().forEach(v => {
                    nodeObj[v] = buildTree(v);
                });
                return nodeObj;
            };

            const treeObj = { [root]: buildTree(root) };

            const getDepth = (u) => {
                const children = groupAdj[u] || [];
                if (children.length === 0) return 1;
                return 1 + Math.max(...children.map(getDepth));
            };

            const depth = getDepth(root);
            hierarchies.push({
                root,
                tree: treeObj,
                depth
            });

            if (depth > maxDepth) {
                maxDepth = depth;
                largestTreeRoot = root;
            } else if (depth === maxDepth) {
                if (!largestTreeRoot || root < largestTreeRoot) {
                    largestTreeRoot = root;
                }
            }
        }
    });

    // Sort hierarchies by root lexicographically as a convention (though not strictly required, makes it predictable)
    hierarchies.sort((a, b) => a.root.localeCompare(b.root));

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges: Array.from(duplicate_edges),
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root: largestTreeRoot || ""
        }
    };
};

module.exports = { processHierarchies };
