// Open file dialog using File System Access API — re-opens in last-used folder
async function loadSheet() {
    try {
        const [handle] = await window.showOpenFilePicker({
            startIn: _lastFileHandle || 'documents',
            types: [{
                description: 'Character Sheet',
                accept: { 'application/json': ['.json'] }
            }]
        });
        saveLastHandle(handle); // remember folder for next time
        const file = await handle.getFile();
        const text = await file.text();
        const jsonText = text.trim().replace(/^var\s+loadJson\s*=\s*/, '');
        window.loadJson = JSON.parse(jsonText);
        populateSheetFromJson();
    } catch (e) {
        if (e.name !== 'AbortError') {
            console.error('Load failed:', e);
            alert('Could not load file: ' + e.message);
        }
    }
}


function loadNewSheet(argument) {
    location.reload();
}

function populateSheetFromJson() {


    //Change the title to the character name
    if (loadJson.page1.basic_info.char_name)
        document.title = loadJson.page1.basic_info.char_name;

    //Load Basic Info
    $('#character-basic-info #basic-info input[name="char-name"]').val(loadJson.page1.basic_info.char_name);
    $('#character-basic-info #basic-info input[name="level"]').val(loadJson.page1.basic_info.level);
    $('#character-basic-info #basic-info input[name="level-two"]').val(loadJson.page1.basic_info.level_two);

    //Load Character Info
    $('input[name="race-class"]').val(loadJson.page1.character_info.race_class);
    $('input[name="background"]').val(loadJson.page1.character_info.background);
    $('input[name="exp"]').val(loadJson.page1.character_info.exp);
    $('input[name="alignment"]').val(loadJson.page1.character_info.alignment);
    $('input[name="deity"]').val(loadJson.page1.character_info.deity);

    //Load Info Bar
    $('#page-1 #top-bar input[name="proficiency"]').val(loadJson.page1.top_bar.proficiency);
    $('#page-1 #top-bar input[name="initiative"]').val(loadJson.page1.top_bar.initiative);
    $('#page-1 #top-bar input[name="passive-perception"]').val(loadJson.page1.top_bar.passive_perception);
    $('#page-1 #top-bar input[name="ac"]').val(loadJson.page1.top_bar.ac);
    $('#page-1 #top-bar input[name="speed"]').val(loadJson.page1.top_bar.speed);
    $('#page-1 #top-bar input[name="spell-dc"]').val(loadJson.page1.top_bar.spell_dc);
    $('#page-1 #top-bar input[name="insperation"]').val(loadJson.page1.top_bar.insperation);

    //Load Attributes
    $('#page-1 #attributes input[name="str"]').val(loadJson.page1.attributes.str);
    $('#page-1 #attributes input[name="str-mod"]').val(loadJson.page1.attributes.str_mod);
    $('#page-1 #attributes input[name="dex"]').val(loadJson.page1.attributes.dex);
    $('#page-1 #attributes input[name="dex-mod"]').val(loadJson.page1.attributes.dex_mod);
    $('#page-1 #attributes input[name="con"]').val(loadJson.page1.attributes.con);
    $('#page-1 #attributes input[name="con-mod"]').val(loadJson.page1.attributes.con_mod);
    $('#page-1 #attributes input[name="int"]').val(loadJson.page1.attributes.int);
    $('#page-1 #attributes input[name="int-mod"]').val(loadJson.page1.attributes.int_mod);
    $('#page-1 #attributes input[name="wis"]').val(loadJson.page1.attributes.wis);
    $('#page-1 #attributes input[name="wis-mod"]').val(loadJson.page1.attributes.wis_mod);
    $('#page-1 #attributes input[name="cha"]').val(loadJson.page1.attributes.cha);
    $('#page-1 #attributes input[name="cha-mod"]').val(loadJson.page1.attributes.cha_mod);

    //Load Skills and Saves	
    $('#page-1 #saves-skills select[name="spell-att"]').val(loadJson.page1.saves_skills.spell_casting);
    if (!$('#saves-skills select[name="spell-att"]').val()) {
        $('#saves-skills select[name="spell-att"]').val('none').change();
    }

    $('#page-1 #saves-skills #saves input[name="str-save"]').val(loadJson.page1.saves_skills.saves.str_save.val);
    $('#page-1 #saves-skills #saves #str-save input[name="prof"]').prop("checked", loadJson.page1.saves_skills.saves.str_save.prof);
    $('#page-1 #saves-skills #saves input[name="dex-save"]').val(loadJson.page1.saves_skills.saves.dex_save.val);
    $('#page-1 #saves-skills #saves #dex-save input[name="prof"]').prop("checked", loadJson.page1.saves_skills.saves.dex_save.prof);
    $('#page-1 #saves-skills #saves input[name="con-save"]').val(loadJson.page1.saves_skills.saves.con_save.val);
    $('#page-1 #saves-skills #saves #con-save input[name="prof"]').prop("checked", loadJson.page1.saves_skills.saves.con_save.prof);
    $('#page-1 #saves-skills #saves input[name="int-save"]').val(loadJson.page1.saves_skills.saves.int_save.val);
    $('#page-1 #saves-skills #saves #int-save input[name="prof"]').prop("checked", loadJson.page1.saves_skills.saves.int_save.prof);
    $('#page-1 #saves-skills #saves input[name="wis-save"]').val(loadJson.page1.saves_skills.saves.wis_save.val);
    $('#page-1 #saves-skills #saves #wis-save input[name="prof"]').prop("checked", loadJson.page1.saves_skills.saves.wis_save.prof);
    $('#page-1 #saves-skills #saves input[name="cha-save"]').val(loadJson.page1.saves_skills.saves.cha_save.val);
    $('#page-1 #saves-skills #saves #cha-save input[name="prof"]').prop("checked", loadJson.page1.saves_skills.saves.cha_save.prof);

    // Load skills — driven by SKILL_CONFIG (defined in changes.js)
    const savedSkills = loadJson.page1.saves_skills.skills;
    SKILL_CONFIG.forEach(function (skill) {
        const data = savedSkills[skill.saveKey];
        if (!data) return;
        $('input[name="' + skill.id + '"]').val(data.val);
        $('#' + skill.id + ' input[name="prof"]').prop('checked', data.prof);
        $('#' + skill.id + ' input[name="expr"]').prop('checked', data.expr);
    });

    //Load Status
    $('textarea[name="conditions"]').val(loadJson.page1.status.conditions);
    $('textarea[name="boons"]').val(loadJson.page1.status.boons);
    $('input[name="success-1"]').prop("checked", loadJson.page1.status.death_saves.success.one);
    $('input[name="success-2"]').prop("checked", loadJson.page1.status.death_saves.success.two);
    $('input[name="success-3"]').prop("checked", loadJson.page1.status.death_saves.success.three);
    $('input[name="failure-1"]').prop("checked", loadJson.page1.status.death_saves.failure.one);
    $('input[name="failure-2"]').prop("checked", loadJson.page1.status.death_saves.failure.two);
    $('input[name="failure-3"]').prop("checked", loadJson.page1.status.death_saves.failure.three);
    $('input[name="hit-dice"]').val(loadJson.page1.status.hit_dice.type);
    $('input[name="current-hd"]').val(loadJson.page1.status.hit_dice.current_hd);
    $('input[name="temp-health"]').val(loadJson.page1.status.temp_health);
    $('input[name="current-health"]').val(loadJson.page1.status.current_health);
    $('input[name="max-health"]').val(loadJson.page1.status.max_health);

    //Load Proficiencies
    $('#weapons-armor textarea[name="weapons-armor"]').val(loadJson.page1.proficiencies.weapon_armor);
    $('#tools textarea[name="tools"]').val(loadJson.page1.proficiencies.tools);
    $('#languages textarea[name="languages"]').val(loadJson.page1.proficiencies.languages);

    //Load Attacks
    $.each(loadJson.page1.attacks_spells, function(index, value) {
        $('#attacks-spells #attacks tbody').append(
            '<tr draggable="true">' +
            '<td class="drag-handle" title="Drag to reorder">⠿</td>' +
            '<td><input type="text" name="name" value="'        + value.name        + '"/></td>' +
            '<td><input type="text" name="stat" value="'        + value.stat        + '"/></td>' +
            '<td><input type="text" name="toHit" value="'       + value.toHit       + '"/></td>' +
            '<td><input type="text" name="damage" value="'      + value.damage      + '"/></td>' +
            '<td><input type="text" name="damage_type" value="' + value.damage_type + '"/></td>' +
            '<td><button type="button" class="atk-delete w3-button w3-red w3-small w3-round">✕</button></td>' +
            '</tr>'
        );
    });

    //Load Charges
    $('#charge-list .charge-row').remove();
    if (Array.isArray(loadJson.page1.charges)) {
        // New dynamic format
        loadJson.page1.charges.forEach(function (row) {
            $('#charge-list').append(createChargeRow(row));
        });
    } else {
        // Legacy format: {charge_1: {name, total}, ...}
        ['charge_1','charge_2','charge_3','charge_4','charge_5','charge_6'].forEach(function (key) {
            var ch = loadJson.page1.charges[key];
            if (!ch || (!ch.name && !(ch.total && ch.total.length))) return;
            var checked = [];
            for (var i = 0; i < 10; i++) {
                checked.push(ch.total && ch.total.indexOf(String(i + 1)) !== -1);
            }
            $('#charge-list').append(createChargeRow({ name: ch.name || '', checked: checked }));
        });
    }

    //Load Feats and Traits
    $('#page-1 #features textarea[name="features"]').val(loadJson.page1.features);

    //Load Equipment — merge legacy col_1 + col_2 into single dynamic list
    $('#equipment-list tr').remove();
    const equItems = (loadJson.page2.equipment.val.col_1 || []).concat(loadJson.page2.equipment.val.col_2 || []);
    equItems.forEach(function(item) {
        if (item.name || item.weight) {
            $('#equipment-list').append(createEquipmentRow(item));
        }
    });

    $('#page-2 #equipment tr#total input[name="total-weight"').val(loadJson.page2.equipment.total_weight);

    $('#page-2 #currancy input[name="copper"]').val(loadJson.page2.equipment.currency.copper);
    $('#page-2 #currancy input[name="silver"]').val(loadJson.page2.equipment.currency.silver);
    $('#page-2 #currancy input[name="gold"]').val(loadJson.page2.equipment.currency.gold);
    $('#page-2 #currancy input[name="electrum"]').val(loadJson.page2.equipment.currency.electrum);
    $('#page-2 #currancy input[name="platinum"]').val(loadJson.page2.equipment.currency.platinum);
    $('#page-2 #currancy input[name="total"]').val(loadJson.page2.equipment.currency.total);
    $('#page-2 #currancy select[name="base"]').val(loadJson.page2.equipment.currency.base);

    $('#page-2 #encumberance input[name="base-encumberance"]').val(loadJson.page2.equipment.encumberance.base);
    $('#page-2 #encumberance input[name="encumbered-encumberance"]').val(loadJson.page2.equipment.encumberance.encumbered);
    $('#page-2 #encumberance input[name="h-encumbered-encumberance"]').val(loadJson.page2.equipment.encumberance.h_encumbered);
    $('#page-2 #encumberance input[name="push-encumberance"]').val(loadJson.page2.equipment.encumberance.push);

    //Load Mount
    $('#page-2 #mount-pet input[name="mount-name"]').val(loadJson.page2.mount_pet.name);
    $('#page-2 #mount-pet input[name="mount-type"]').val(loadJson.page2.mount_pet.type);
    $('#page-2 #mount-pet input[name="mount-health"]').val(loadJson.page2.mount_pet.health);
    $('#page-2 #mount-pet input[name="mount-ac"]').val(loadJson.page2.mount_pet.ac);
    $('#page-2 #mount-pet input[name="mount-speed"]').val(loadJson.page2.mount_pet.speed);
    $('#page-2 #mount-pet textarea[name="mount-notes"]').val(loadJson.page2.mount_pet.notes);

    //Load Mount 2
    $('#page-2 #mount-pet input[name="mount-name-2"]').val(loadJson.page2.mount_pet2.name2);
    $('#page-2 #mount-pet input[name="mount-type-2"]').val(loadJson.page2.mount_pet2.type2);
    $('#page-2 #mount-pet input[name="mount-health-2"]').val(loadJson.page2.mount_pet2.health2);
    $('#page-2 #mount-pet input[name="mount-ac-2"]').val(loadJson.page2.mount_pet2.ac2);
    $('#page-2 #mount-pet input[name="mount-speed-2"]').val(loadJson.page2.mount_pet2.speed2);
    $('#page-2 #mount-pet textarea[name="mount-notes-2"]').val(loadJson.page2.mount_pet2.notes2);

    //Load Backstory
    $('#page-4 #backstory textarea[name="backstory"]').val(loadJson.page4.backstory);

    //Load allies/organizations
    $('#page-4 #allies-organizations input[name="name"]').val(loadJson.page4.allies_organizations.name);
    $('#page-4 #allies-organizations textarea[name="allies-organizations"]').val(loadJson.page4.allies_organizations.val);

    //Load Personality
    $('#personality #personality-traits textarea[name="personality-traits"]').val(loadJson.page4.personality.personality_traits);
    $('#personality #ideals textarea[name="ideals"]').val(loadJson.page4.personality.ideals);
    $('#personality #bonds textarea[name="bonds"]').val(loadJson.page4.personality.bonds);
    $('#personality #flaws textarea[name="flaws"]').val(loadJson.page4.personality.flaws);

    //Load Notes
    $('#page-5 #notes-1 textarea[name="notes-1"]').val(loadJson.page5.notes_1);
    $('#page-5 #notes-2 textarea[name="notes-2"]').val(loadJson.page5.notes_2);

//Load Spell Info
    $('#page-3 #spell-info input[name="class"]').val(loadJson.page3.spell_info.class);
    $('#page-3 #spell-info input[name="att"]').val(loadJson.page3.spell_info.att);
    $('#page-3 #spell-info input[name="dc"]').val(loadJson.page3.spell_info.dc);
    $('#page-3 #spell-info input[name="bonus"]').val(loadJson.page3.spell_info.bonus);

    //Load Spell Slots
    if (loadJson.page3.spell_slots) {
        [1, 2, 3, 4, 5].forEach(function (n) {
            const input = $('#page-3 #spells input[name="total-' + n + '"]');
            input.val(loadJson.page3.spell_slots['total_' + n]);
            updateSpellSlots(input);
        });
    }

    //Load Spells — clear existing rows, create one row per saved entry
    $('#spell-list tr:not(:first-child)').remove();
    if (Array.isArray(loadJson.page3.spells)) {
        loadJson.page3.spells.forEach(function (spell) {
            $('#spell-list').append(createSpellRow(spell));
        });
    }
    // Always leave at least a few blank rows below the saved ones
    const savedCount = Array.isArray(loadJson.page3.spells) ? loadJson.page3.spells.length : 0;
    for (let i = savedCount; i < savedCount + 5; i++) {
        $('#spell-list').append(createSpellRow());
    }

    markClean(); // freshly loaded sheet has no unsaved changes
}

$(document).ready(function () {
    if (window.loadJson) {
        populateSheetFromJson();
    }
});