// Persist the last-used FileSystemFileHandle in IndexedDB so save/load
// dialogs re-open in the same folder across page refreshes.

const _PREFS_DB   = 'sheet-prefs';
const _PREFS_STORE = 'handles';

function _openPrefsDB() {
    return new Promise(function (resolve, reject) {
        const req = indexedDB.open(_PREFS_DB, 1);
        req.onupgradeneeded = function (e) {
            e.target.result.createObjectStore(_PREFS_STORE);
        };
        req.onsuccess  = function (e) { resolve(e.target.result); };
        req.onerror    = function (e) { reject(e.target.error);   };
    });
}

var _lastFileHandle = null;

// Load the stored handle on startup (best-effort — silently ignored if unavailable)
_openPrefsDB().then(function (db) {
    var tx  = db.transaction(_PREFS_STORE, 'readonly');
    var req = tx.objectStore(_PREFS_STORE).get('last');
    req.onsuccess = function (e) { _lastFileHandle = e.target.result || null; };
}).catch(function () {});

function saveLastHandle(handle) {
    _lastFileHandle = handle;
    _openPrefsDB().then(function (db) {
        db.transaction(_PREFS_STORE, 'readwrite')
          .objectStore(_PREFS_STORE)
          .put(handle, 'last');
    }).catch(function () {});
}
