const fs = require('fs');
const serializer = require('./serializer');

function Node() {
    this.c = {};
    this.k = {};
}

const MAX_LENGTH = 20;
const CACHE_HEIGHT = 4;
const START_ASCII = 32;
const END_ASCII = 127;
const CHUNK_SIZE = 64 * 1024;

const ROOT_FILE = 'root';
const FILE_PROPERTY = 'file';
const FILE_RESOVLE_FLAG = 'fileResolved';
const ADDED_TO_PERSISTENT_SET = 'addedToPersistentSet';

let inMemoryRoot = new Node();

function setRoot(root) {
    inMemoryRoot = root;
}

exports.refreshCache = function () {
    serializer.getAsync(ROOT_FILE, function (error, rootJson) {
        if (error) {
            console.error('Failed to load cache from file system');
        } else {
            console.log('Index initialized Sucessfully');
            if (rootJson) {
                setRoot(JSON.parse(rootJson));
            } else {
                console.error('Root file is empty');
                setRoot(new Node());
            }
        }
    });
};

// Load on startup
exports.refreshCache();

let inProgress = false;

let deletionInProgress = false;

exports.index = function (textFile, key, metadata, callback) {

    if (inProgress) {
        throw new Error('Indexing in already in progress');
    }

    inProgress = true;
    var readStream = fs.createReadStream(textFile, { highWaterMark: CHUNK_SIZE, encoding: 'utf8' });

    let request = {}
    request.nodes = {};
    request.key = key;
    request.metadata = metadata;
    request.persistableNodes = [];
    request.pos = 0;

    // Read root node from file system and update it.
    // In-momory root node stays in memory unitll new node is updated.
    serializer.getAsync(ROOT_FILE, function (error, rootJson) {

        if (error || !rootJson) {
            console.error(error);
            request.root = new Node();
        } else {
            request.root = JSON.parse(rootJson);
        }

        readStream.on('data', chunk => {
            request.line = chunk;
            indexLocal(request);
        });

        readStream.on('close', () => {
            console.log('Indexing done.... Now persisisting');
            persist(request.persistableNodes);
            serializer.saveAsyncByName(request.root, ROOT_FILE, function () {
                inProgress = false;
                console.log('Persisisting Completed');
                callback(null, request.root);
            });
        });

        readStream.on('error', error => {
            console.error('Error while reading input text file');
            console.error(error);
            inProgress = false;
            callback(error, null);
        });
    });
}

// This function contains core logic for indexing.
function indexLocal(request) {

    let string = request.line, // to index
        key = request.key, // unique identifier, same is returned as search result
        nodes = request.nodes, // roots to which current sub-trees will append
        metadata = request.metadata, // additional information to be stored with key
        root = request.root, // original root 
        persistableNodes = request.persistableNodes, // these are node files which are updated now
        pos = request.pos; // position of current string in entire text

    for (let i = 0; i < string.length; i++ , pos++) {

        let char = string[i].toLowerCase();
        let charCode = char.charCodeAt(0);

        // replace new line with space for search convenience
        if (charCode === 10 || charCode === 13) {
            char = ' ';
            charCode = char.charCodeAt(0);
        }

        // skip out of range characters
        if (charCode < START_ASCII || charCode > END_ASCII) {
            // console.log('skipping ' + char);
            // console.log('skipping ' + charCode);
            nodes = {};
            continue;
        }

        let rootPosition = pos % MAX_LENGTH;
        nodes[rootPosition] = root;

        let persistableNodeIndex = rootPosition - CACHE_HEIGHT;
        if (persistableNodeIndex < 0) {
            persistableNodeIndex = MAX_LENGTH + persistableNodeIndex;
        }
        let nodeToPersist = nodes[persistableNodeIndex];
        if (nodeToPersist && nodeToPersist[ADDED_TO_PERSISTENT_SET] !== true) {
            nodeToPersist[ADDED_TO_PERSISTENT_SET] = true;
            persistableNodes.push(nodeToPersist);
        }

        for (let node in nodes) {
            if (nodes.hasOwnProperty(node)) {
                let parent = nodes[node];
                if (parent) {
                    let child = parent.c[char];

                    if (!child) {
                        child = new Node();
                    } else if (child[FILE_PROPERTY] && child[FILE_RESOVLE_FLAG] !== true) {
                        // lazy loading of child from file 
                        let file = child[FILE_PROPERTY];
                        child.c = serializer.getSync(file);
                        child[FILE_RESOVLE_FLAG] = true;
                    }
                    parent.c[char] = child;
                    child.k[key] = metadata ? metadata : null;
                    nodes[node] = child;
                }
            }
        }
    }

    request.nodes = nodes; // keep track for next iteration
    request.pos = pos;
    request.persistableNodes = persistableNodes;
}

function persist(persistableNodes) {

    console.log('Total index files to update ' + persistableNodes.length);

    for (let i = 0; i < persistableNodes.length; i++) {
        let parent = persistableNodes[i];
        let nodeToPersist = parent.c;
        let oldFile = parent[FILE_PROPERTY];

        if (parent[ADDED_TO_PERSISTENT_SET]) {
            delete parent[ADDED_TO_PERSISTENT_SET];
            delete parent[FILE_RESOVLE_FLAG];
        } else {
            console.error(parent);
            console.error('Node came for persistant without flag. Something wrong in calculaitons ???');
        }

        // if old node updated then update index file else create new
        if (oldFile) {
            update(nodeToPersist, oldFile, parent);
        } else {
            create(nodeToPersist, parent);
        }

        function create(nodeToPersist, parent) {
            serializer.saveSync(nodeToPersist, function (fileName, error) {
                if (error) {
                    console.error(error);
                    console.error('Error while creating file');
                } else {
                    parent[FILE_PROPERTY] = fileName;
                    parent.c = {};
                }
            });
        }

        function update(nodeToPersist, oldFile, parent) {
            serializer.updateSync(nodeToPersist, oldFile, function (fileName, error) {
                if (error) {
                    console.error(error);
                    console.error('Error while updating files... creating new file.');
                    create(nodeToPersist);
                } else {
                    parent[FILE_PROPERTY] = fileName;
                    parent.c = {};
                }
            });
        }
    }
}

exports.search = function (string) {

    let children = inMemoryRoot.c;
    let result = inMemoryRoot.k;
    for (let i = 0; i < string.length; i++) {
        let char = string.charAt(i).toLowerCase();
        children = children[char];
        if (!children) {
            result = null; // no partial matches, only full match
            break;
        }
        // TODO fix issue serilization. object getting larger here
        if (children[FILE_PROPERTY]) {
            result = children.k;
            children = serializer.getSync(children[FILE_PROPERTY]);
        } else {
            result = children.k;
            children = children.c;
        }
    }
    return result
}

exports.delete = function (key, saveAfter = true) {

    serializer.getAsync(ROOT_FILE, function (error, rootJson) {

        try {
            if (deletionInProgress) {
                console.error('One deletion is in progress. Try after some time');
                throw new Error('One deletion is in progress. Try after some time');
            }

            let rootLocal;

            if (error || !rootJson) {
                console.error('No index root file');
                console.error(error);
                deletionInProgress = false;
                throw error || 'No index root file found';
            } else {
                rootLocal = JSON.parse(rootJson);
            }

            let persistables = [];

            let deletedKeys = 0;
            let deletedNodes = 0;

            function deleteLocal(children, key) {
                for (let child in children) {
                    if (children.hasOwnProperty(child)) {
                        let current = children[child];
                        if (current.k) {
                            delete current.k[key];
                            deletedKeys++;
                            if (Object.keys(current.k).length === 0) {
                                delete children[child];
                                deletedNodes++;
                            }
                        }
                        if (current[FILE_PROPERTY]) {
                            current.c = serializer.getSync(current[FILE_PROPERTY]);
                            if (current && current[ADDED_TO_PERSISTENT_SET] !== true) {
                                current[ADDED_TO_PERSISTENT_SET] = true;
                                persistables.push(current);
                            }
                        }
                        deleteLocal(current.c, key);
                    }
                }
            }

            deleteLocal(rootLocal.c, key);

            console.log('deletedKeys: ' + deletedKeys + '  deletedNodes: ' + deletedNodes);
            if (saveAfter) {
                persist(persistables);
                console.log('Persistance of all node is done ' + key);
            }

            serializer.saveAsyncByName(rootLocal, ROOT_FILE, function () {
                console.log('Persisisting of root node is completed after deletion. ' + key);
                deletionInProgress = false;
            });

        } catch (error) {
            deletionInProgress = false;
            throw error;
        }

    });

}

exports.update = function (textFile, key, metadata, callback) {

    // no need to get Local key as delete and index already do it.
    this.delete(key);
    this.index(textFile, key, metadata, callback);
    console.log('Successfully updated index for key ' + key);
}

exports.suggestions = function (string) {

    let result = null;
    let node = inMemoryRoot;

    for (let i = 0; i < string.length; i++) {
        let char = string.charAt(i).toLowerCase();
        node = node.c[char];
        if (!node) {
            console.log('No suggestions');
            return result;
        }
        if (node[FILE_PROPERTY]) {
            node.c = serializer.getSync(node[FILE_PROPERTY]);
        }
    }

    function suggestionsLocal(nodes) {

        let suffixes = [];

        for (let i in nodes) {
            if (nodes.hasOwnProperty(i)) {
                let ascii = i;
                let childrens = nodes[i].c;
                if (!childrens) {
                    let node = serializer.getSync(nodes[FILE_PROPERTY]);
                    childrens = node.c;
                }
                let suffixArr = suggestionsLocal(childrens);
                if (suffixArr.length == 0) {
                    suffixes.push(ascii);
                } else {
                    suffixArr.forEach(function (suffix, index) {
                        suffixArr[index] = ascii.concat(suffix);
                    });
                }
                suffixes = suffixes.concat(suffixArr);
            }
        }

        return suffixes;
    }

    return suggestionsLocal(node.c);
}



