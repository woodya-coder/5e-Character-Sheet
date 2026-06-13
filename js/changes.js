var LOCKED = false;
var dirty  = false;   // true whenever unsaved edits exist

function markClean() { dirty = false; }

// Maps every skill to its governing ability score and JSON save key
const SKILL_CONFIG = [
    { id: 'athletics-skill',       stat: 'str', saveKey: 'athletics'       },
    { id: 'acrobatics-skill',      stat: 'dex', saveKey: 'acrobatics'      },
    { id: 'sleight-hand-skill',    stat: 'dex', saveKey: 'sleight_hand'    },
    { id: 'stealth-skill',         stat: 'dex', saveKey: 'stealth'         },
    { id: 'arcana-skill',          stat: 'int', saveKey: 'arcana'          },
    { id: 'history-skill',         stat: 'int', saveKey: 'history'         },
    { id: 'investigation-skill',   stat: 'int', saveKey: 'investigation'   },
    { id: 'nature-skill',          stat: 'int', saveKey: 'nature'          },
    { id: 'religion-skill',        stat: 'int', saveKey: 'religion'        },
    { id: 'animal-handling-skill', stat: 'wis', saveKey: 'animal_handling' },
    { id: 'insight-skill',         stat: 'wis', saveKey: 'insight'         },
    { id: 'medicine-skill',        stat: 'wis', saveKey: 'medicine'        },
    { id: 'perception-skill',      stat: 'wis', saveKey: 'perception'      },
    { id: 'survival-skill',        stat: 'wis', saveKey: 'survival'        },
    { id: 'deception-skill',       stat: 'cha', saveKey: 'deception'       },
    { id: 'intimidation-skill',    stat: 'cha', saveKey: 'intimidation'    },
    { id: 'performance-skill',     stat: 'cha', saveKey: 'performance'     },
    { id: 'persuasion-skill',      stat: 'cha', saveKey: 'persuasion'      },
];

function lock() {
    LOCKED = !LOCKED;
}

// Replace the old 65-line switch — floor((score-10)/2) is the 5e formula
function updateMod(att, score) {
    const mod = Math.floor((parseInt(score) - 10) / 2);
    $('#attributes input[name="' + att + '-mod"]').val((mod >= 0 ? '+' : '') + mod);
}

function updateSaves() {
    const prof = parseInt($('#top-bar input[name="proficiency"]').val()) || 0;
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(function (stat) {
        const hasProficiency = $('#saves #' + stat + '-save input[name="prof"]').prop('checked');
        const base  = parseInt($('#attributes input[name="' + stat + '-mod"]').val()) || 0;
        const total = base + (hasProficiency ? prof : 0);
        $('#saves input[name="' + stat + '-save"]').val((total >= 0 ? '+' : '') + total);
    });
}

// Single function replaces updateStrSkills / updateDexSkills / updateIntSkills /
// updateWisSkills / updateChaSkills — driven by SKILL_CONFIG above
function updateAllSkills() {
    const prof = parseInt($('#top-bar input[name="proficiency"]').val()) || 0;
    SKILL_CONFIG.forEach(function (skill) {
        const base           = parseInt($('#attributes input[name="' + skill.stat + '-mod"]').val()) || 0;
        const hasProficiency = $('#' + skill.id + ' input[name="prof"]').prop('checked');
        const hasExpertise   = $('#' + skill.id + ' input[name="expr"]').prop('checked');
        const profBonus      = hasExpertise ? prof * 2 : (hasProficiency ? prof : 0);
        const total          = base + profBonus;
        $('#' + skill.id + ' input[type="text"]').val((total >= 0 ? '+' : '') + total);
    });
}

function updateStrMisc() {
    const score = parseInt($('#attributes input[name="str"]').val()) || 0;
    $('#encumberance input[name="base-encumberance"]').val(score * 5);
    $('#encumberance input[name="encumbered-encumberance"]').val(score * 10);
    $('#encumberance input[name="h-encumbered-encumberance"]').val(score * 15);
    $('#encumberance input[name="push-encumberance"]').val(score * 30);
}

function updateWisMisc() {
    const prof = parseInt($('#top-bar input[name="proficiency"]').val()) || 0;
    const base           = parseInt($('#attributes input[name="wis-mod"]').val()) || 0;
    const hasProficiency = $('#perception-skill input[name="prof"]').prop('checked');
    const hasExpertise   = $('#perception-skill input[name="expr"]').prop('checked');
    const profBonus      = hasExpertise ? prof * 2 : (hasProficiency ? prof : 0);
    $('#top-bar input[name="passive-perception"]').val(10 + base + profBonus);
}

function updateSpells() {
    const att = $('#saves-skills select[name="spell-att"]').val();

    if (att === 'none') {
        $('#top-bar input[name="spell-dc"]').val('Na');
        $('#spell-info input[name="dc"]').val('Na');
        return;
    }

    const base = parseInt($('#attributes input[name="' + att + '-mod"]').val()) || 0;
    const prof = parseInt($('#top-bar input[name="proficiency"]').val()) || 0;

    const dc    = 8 + base + prof;
    const bonus = base + prof;
    $('#top-bar input[name="spell-dc"]').val(dc);
    $('#spell-info input[name="dc"]').val(dc);
    $('#spell-info input[name="bonus"]').val('+' + bonus);
    $('#spell-info input[name="att"]').val(att);
}

function calculateTotalWeight() {
    let total = 0;
    $('#equipment input[name="weight"]').each(function () {
        total += parseFloat($(this).val()) || 0;
    });
    $('#equipment input[name="total-weight"]').val(total.toFixed(2));
}

function calculateTotalCurrency() {
    let total = 0;
    const base = $('#equipment #currancy select[name="base"]').val();

    $('#equipment #currancy input:not([name="total"])').each(function () {
        const amount   = parseInt($(this).val()) || 0;
        const modifier = cacluateCurrencyMod($(this).attr('name'), base);
        total += amount * modifier;
    });

    total = total.toFixed(2);
    $('#equipment #currancy input[name="total"]').val(
        total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    );
}

// Conversion table replaces the nested switch
function cacluateCurrencyMod(coin, base) {
    const rates = {
        copper:   { c: 1,    s: 1/10,  g: 1/100, e: 1/50,  p: 1/1000 },
        silver:   { c: 10,   s: 1,     g: 1/10,  e: 1/5,   p: 1/100  },
        gold:     { c: 100,  s: 10,    g: 1,     e: 2,     p: 1/10   },
        electrum: { c: 50,   s: 5,     g: 1/2,   e: 1,     p: 1/20   },
        platinum: { c: 1000, s: 100,   g: 10,    e: 20,    p: 1      },
    };
    return (rates[coin] && rates[coin][base]) ? rates[coin][base] : 0;
}

function updateSpellSlots(input) {
    const total     = parseInt(input.val()) || 0;
    const container = input.closest('td').find('.slots');
    container.empty();
    for (let i = 0; i < total; i++) {
        container.append('<input type="checkbox" class="slot-box" />');
    }
}

// ---------- Dynamic spell / feature rows ----------

function createSpellRow(data) {
    data = data || {};
    // Escape values so existing data containing quotes doesn't break attributes
    function esc(v) { return $('<div>').text(v || '').html(); }

    const tr = $('<tr draggable="true">');
    tr.html(
        '<td class="drag-handle" title="Drag to reorder">⠿</td>' +
        '<td><input type="text" name="spell-type"  value="' + esc(data.spell_type)  + '"/></td>' +
        '<td><input type="text" name="spell-name"  value="' + esc(data.spell_name)  + '"/></td>' +
        '<td><input type="text" name="cast-time"   value="' + esc(data.cast_time)   + '"/></td>' +
        '<td><input type="text" name="range"       value="' + esc(data.range)       + '"/></td>' +
        '<td><input type="text" name="duration"    value="' + esc(data.duration)    + '"/></td>' +
        '<td><input type="text" name="description" value="' + esc(data.description) + '"/></td>' +
        '<td><button type="button" class="spell-delete w3-button w3-red w3-small w3-round">✕</button></td>'
    );
    return tr;
}

// ---------- Dynamic equipment rows ----------

function createEquipmentRow(data) {
    data = data || {};
    function esc(v) { return $('<div>').text(v || '').html(); }
    const tr = $('<tr draggable="true">');
    tr.html(
        '<td class="drag-handle" title="Drag to reorder">⠿</td>' +
        '<td><input type="text" name="name" value="' + esc(data.name) + '"/></td>' +
        '<td><input type="text" name="weight" value="' + esc(data.weight) + '"/></td>' +
        '<td><button type="button" class="equip-delete w3-button w3-red w3-small w3-round">✕</button></td>'
    );
    return tr;
}

// ---------- Dynamic charge rows ----------

function createChargeRow(data) {
    data = data || {};
    function esc(v) { return $('<div>').text(v || '').html(); }
    let boxes = '';
    for (let i = 0; i < 10; i++) {
        const chk = data.checked && data.checked[i] ? ' checked' : '';
        boxes += '<input type="checkbox" class="charge-box"' + chk + ' />';
    }
    const row = $('<div class="charge-row w3-col">');
    row.html(
        '<div class="w3-col l3 w3-padding-small">' +
            '<input type="text" name="charge-name" placeholder="Resource name" value="' + esc(data.name) + '" />' +
        '</div>' +
        '<div class="w3-col l6 w3-padding-small charge-boxes">' + boxes + '</div>' +
        '<div class="w3-col l3 w3-padding-small">' +
            '<button type="button" class="charge-fill w3-button w3-blue-gray w3-small w3-round">Fill</button> ' +
            '<button type="button" class="charge-empty w3-button w3-blue-gray w3-small w3-round">Empty</button> ' +
            '<button type="button" class="charge-delete w3-button w3-red w3-small w3-round">✕</button>' +
        '</div>'
    );
    return row;
}

// ---------- Event wiring ----------

$(document).ready(function () {

    // Expando sections
    $('.expando').click(function () {
        $(this).next().slideToggle();
    });

    // Scroll to top
    $('#scroll-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1000);
        return false;
    });

    // --- Attributes ---
    $('#attributes input[name="str"]').on('input', function () {
        if (LOCKED) return;
        updateMod('str', $(this).val());
        updateAllSkills();
        updateStrMisc();
        updateSaves();
        updateSpells();
    });

    $('#attributes input[name="dex"]').on('input', function () {
        if (LOCKED) return;
        updateMod('dex', $(this).val());
        updateAllSkills();
        updateSaves();
        updateSpells();
    });

    $('#attributes input[name="con"]').on('input', function () {
        if (LOCKED) return;
        updateMod('con', $(this).val());
        updateSaves();
        updateSpells();
    });

    $('#attributes input[name="int"]').on('input', function () {
        if (LOCKED) return;
        updateMod('int', $(this).val());
        updateAllSkills();
        updateSaves();
        updateSpells();
    });

    $('#attributes input[name="wis"]').on('input', function () {
        if (LOCKED) return;
        updateMod('wis', $(this).val());
        updateAllSkills();
        updateWisMisc();
        updateSaves();
        updateSpells();
    });

    $('#attributes input[name="cha"]').on('input', function () {
        if (LOCKED) return;
        updateMod('cha', $(this).val());
        updateAllSkills();
        updateSaves();
        updateSpells();
    });

    // --- Proficiency bonus ---
    $('#top-bar input[name="proficiency"]').on('input', function () {
        if (LOCKED) return;
        updateAllSkills();
        updateStrMisc();
        updateWisMisc();
        updateSaves();
        updateSpells();
    });

    // --- Saving throw proficiency checkboxes ---
    $('#saves input[name="prof"]').change(function () {
        if (LOCKED) return;
        updateSaves();
    });

    // --- Skill prof/expertise — use delegation so all 5 groups are covered ---
    $('#saves-skills').on('change', 'input[name="prof"], input[name="expr"]', function () {
        if (LOCKED) return;
        updateAllSkills();
        updateWisMisc();
    });

    // --- Spell casting attribute ---
    $('#saves-skills select[name="spell-att"]').change(function () {
        if (LOCKED) return;
        updateSpells();
    });

    // --- Equipment weight (delegation — works with dynamic rows too) ---
    $('#equipment').on('keyup', 'input[name="weight"]', function () {
        if (LOCKED) return;
        calculateTotalWeight();
    });

    // --- Currency ---
    $('#equipment #currancy').on('keyup', 'input:not([name="total"])', function () {
        if (LOCKED) return;
        calculateTotalCurrency();
    });
    $('#equipment #currancy select[name="base"]').change(function () {
        if (LOCKED) return;
        calculateTotalCurrency();
    });

    // --- Spell slots (delegation, class selector fixes the duplicate-id bug) ---
    $('#spells').on('keyup', '.total-slots input', function () {
        if (LOCKED) return;
        updateSpellSlots($(this));
    });

    // --- Spell / feature row buttons ---
    $('#add-spell-row').click(function () {
        $('#spell-list').append(createSpellRow());
    });

    $('#spell-list').on('click', '.spell-delete', function () {
        $(this).closest('tr').remove();
    });

    // --- Charge row buttons ---
    $('#add-charge-row').click(function () {
        $('#charge-list').append(createChargeRow());
    });

    $('#charge-list').on('click', '.charge-delete', function () {
        $(this).closest('.charge-row').remove();
    });

    // --- Unsaved-changes guard ---
    // Mark dirty on any user edit anywhere on the page.
    // Programmatic .val() calls (auto-calc, load) do NOT trigger 'input',
    // so they won't accidentally set the flag.
    $(document).on('input change', 'input, textarea, select', function () {
        dirty = true;
    });

    window.addEventListener('beforeunload', function (e) {
        if (dirty) {
            // Modern browsers ignore custom messages and show their own text,
            // but preventDefault() + returnValue is the cross-browser trigger.
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Seed blank rows on a fresh (no saved sheet) load
    if (!window.loadJson) {
        for (let i = 0; i < 8; i++) {
            $('#spell-list').append(createSpellRow());
        }
        for (let i = 0; i < 2; i++) {
            $('#charge-list').append(createChargeRow());
        }
        for (let i = 0; i < 10; i++) {
            $('#equipment-list').append(createEquipmentRow());
        }
    }

    // --- Equipment row add/delete ---
    $('#add-equipment-row').click(function () {
        $('#equipment-list').append(createEquipmentRow());
    });

    $('#equipment-list').on('click', '.equip-delete', function () {
        $(this).closest('tr').remove();
        calculateTotalWeight();
    });

    // ---------- Drag-and-drop row reordering ----------

    let dragSrcRow = null;

    // Kick off the drag; store which row we're moving
    $('#spell-list').on('dragstart', 'tr[draggable]', function (e) {
        dragSrcRow = this;
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        // Small delay so the browser snapshot doesn't capture the dimmed state
        setTimeout(() => $(this).addClass('dragging'), 0);
    });

    // Allow drop by cancelling the default "not allowed" behaviour
    $('#spell-list').on('dragover', 'tr', function (e) {
        if (!dragSrcRow || this === dragSrcRow) return;
        if ($(this).find('th').length) return; // skip header
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'move';

        // Show an insertion line above or below based on where the cursor is
        const rect = this.getBoundingClientRect();
        const isAboveMiddle = e.originalEvent.clientY < rect.top + rect.height / 2;
        $(this).toggleClass('drag-over-top',    isAboveMiddle);
        $(this).toggleClass('drag-over-bottom', !isAboveMiddle);
    });

    $('#spell-list').on('dragleave', 'tr', function () {
        $(this).removeClass('drag-over-top drag-over-bottom');
    });

    $('#spell-list').on('drop', 'tr', function (e) {
        e.stopPropagation();
        if (!dragSrcRow || this === dragSrcRow) return false;
        if ($(this).find('th').length) return false; // skip header

        const rect = this.getBoundingClientRect();
        const isAboveMiddle = e.originalEvent.clientY < rect.top + rect.height / 2;
        if (isAboveMiddle) {
            $(this).before($(dragSrcRow));
        } else {
            $(this).after($(dragSrcRow));
        }
        return false;
    });

    $('#spell-list').on('dragend', 'tr', function () {
        $('#spell-list tr').removeClass('dragging drag-over-top drag-over-bottom');
        dragSrcRow = null;
    });

    // ---------- Attack row drag-and-drop ----------

    let dragSrcAttackRow = null;

    $('#attacks').on('dragstart', 'tr[draggable]', function (e) {
        dragSrcAttackRow = this;
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        setTimeout(() => $(this).addClass('dragging'), 0);
    });

    $('#attacks').on('dragover', 'tr', function (e) {
        if (!dragSrcAttackRow || this === dragSrcAttackRow) return;
        if ($(this).find('th').length) return;
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'move';
        const rect = this.getBoundingClientRect();
        const isAboveMiddle = e.originalEvent.clientY < rect.top + rect.height / 2;
        $(this).toggleClass('drag-over-top',    isAboveMiddle);
        $(this).toggleClass('drag-over-bottom', !isAboveMiddle);
    });

    $('#attacks').on('dragleave', 'tr', function () {
        $(this).removeClass('drag-over-top drag-over-bottom');
    });

    $('#attacks').on('drop', 'tr', function (e) {
        e.stopPropagation();
        if (!dragSrcAttackRow || this === dragSrcAttackRow) return false;
        if ($(this).find('th').length) return false;
        const rect = this.getBoundingClientRect();
        const isAboveMiddle = e.originalEvent.clientY < rect.top + rect.height / 2;
        if (isAboveMiddle) $(this).before($(dragSrcAttackRow));
        else               $(this).after($(dragSrcAttackRow));
        return false;
    });

    $('#attacks').on('dragend', 'tr', function () {
        $('#attacks tr').removeClass('dragging drag-over-top drag-over-bottom');
        dragSrcAttackRow = null;
    });

    // ---------- Equipment row drag-and-drop ----------

    let dragSrcEquipRow = null;

    $('#equipment-list').on('dragstart', 'tr[draggable]', function (e) {
        dragSrcEquipRow = this;
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        setTimeout(() => $(this).addClass('dragging'), 0);
    });

    $('#equipment-list').on('dragover', 'tr', function (e) {
        if (!dragSrcEquipRow || this === dragSrcEquipRow) return;
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'move';
        const rect = this.getBoundingClientRect();
        const isAboveMiddle = e.originalEvent.clientY < rect.top + rect.height / 2;
        $(this).toggleClass('drag-over-top',    isAboveMiddle);
        $(this).toggleClass('drag-over-bottom', !isAboveMiddle);
    });

    $('#equipment-list').on('dragleave', 'tr', function () {
        $(this).removeClass('drag-over-top drag-over-bottom');
    });

    $('#equipment-list').on('drop', 'tr', function (e) {
        e.stopPropagation();
        if (!dragSrcEquipRow || this === dragSrcEquipRow) return false;
        const rect = this.getBoundingClientRect();
        const isAboveMiddle = e.originalEvent.clientY < rect.top + rect.height / 2;
        if (isAboveMiddle) $(this).before($(dragSrcEquipRow));
        else               $(this).after($(dragSrcEquipRow));
        return false;
    });

    $('#equipment-list').on('dragend', 'tr', function () {
        $('#equipment-list tr').removeClass('dragging drag-over-top drag-over-bottom');
        dragSrcEquipRow = null;
    });
});
