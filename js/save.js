// Build saves object from DOM — SKILL_CONFIG is defined in changes.js
function buildSavesSaveData() {
    const saves = {};
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(function (stat) {
        saves[stat + '_save'] = {
            val:  $('#saves input[name="' + stat + '-save"]').val(),
            prof: $('#saves #' + stat + '-save input[name="prof"]').prop('checked')
        };
    });
    return saves;
}

// Build skills object from DOM — keyed by SKILL_CONFIG.saveKey
function buildSkillsSaveData() {
    const skills = {};
    SKILL_CONFIG.forEach(function (skill) {
        skills[skill.saveKey] = {
            val:  $('input[name="' + skill.id + '"]').val(),
            prof: $('#' + skill.id + ' input[name="prof"]').prop('checked'),
            expr: $('#' + skill.id + ' input[name="expr"]').prop('checked')
        };
    });
    return skills;
}

function getAttacks() {
    var attacks = [];
    $('#attacks-spells #attacks tr').each(function(argument) {
        if ($(this).find('th').length == 0) {
            var temp = {}
            temp.name = $(this).find('input[name="name"]').val();
            temp.stat = $(this).find('input[name="stat"]').val();
            temp.toHit = $(this).find('input[name="toHit"]').val();
            temp.damage = $(this).find('input[name="damage"]').val();
            temp.damage_type = $(this).find('input[name="damage_type"]').val();
            attacks.push(temp);
        }
    });

    return attacks;
}

function getChargeRows() {
    const rows = [];
    $('#charge-list .charge-row').each(function () {
        const checked = [];
        $(this).find('input[type="checkbox"]').each(function () {
            checked.push($(this).prop('checked'));
        });
        rows.push({
            name:    $(this).find('input[name="charge-name"]').val(),
            notes:   $(this).find('input[name="charge-notes"]').val(),
            checked: checked
        });
    });
    return rows;
}

function getEquipment() {
    const items = [];
    $('#equipment-list tr').each(function () {
        items.push({
            name:   $(this).find('input[name="name"]').val(),
            weight: $(this).find('input[name="weight"]').val()
        });
    });
    // Keep col_1/col_2 structure so old sheets can still be read back
    return { col_1: items, col_2: [] };
}


function getSpells() {
    var spells = [];
    $('#spell-list tr').each(function() {
        if ($(this).find('th').length == 0) {
            var temp = {
                spell_type: $(this).find('input[name="spell-type"]').val(),
                spell_name: $(this).find('input[name="spell-name"]').val(),
                cast_time: $(this).find('input[name="cast-time"]').val(),
                range: $(this).find('input[name="range"]').val(),
                duration: $(this).find('input[name="duration"]').val(),
                description: $(this).find('input[name="description"]').val()
            };
            spells.push(temp);
        }
    });
    return spells;
}


async function saveSheet(argument) {

    var sheet = {
        page1: {
            basic_info: {
                char_name: $('#character-basic-info #basic-info input[name="char-name"]').val(),
                level: $('#character-basic-info #basic-info input[name="level"]').val(),
                level_two: $('#character-basic-info #basic-info input[name="level-two"]').val(),
            },
            character_info: {
                race_class: $('input[name="race-class"]').val(),
                background: $('input[name="background"]').val(),
                player_name: '',
                exp: $('input[name="exp"]').val(),
                alignment: $('input[name="alignment"]').val(),
                deity: $('input[name="deity"]').val()
            },
            top_bar: {
                proficiency: $('#page-1 #top-bar input[name="proficiency"]').val(),
                initiative: $('#page-1 #top-bar input[name="initiative"]').val(),
                passive_perception: $('#page-1 #top-bar input[name="passive-perception"]').val(),
                ac: $('#page-1 #top-bar input[name="ac"]').val(),
                speed: $('#page-1 #top-bar input[name="speed"]').val(),
                spell_dc: $('#page-1 #top-bar input[name="spell-dc"]').val(),
                insperation: $('#page-1 #top-bar input[name="insperation"]').val()
            },
            attributes: {
                str: $('#page-1 #attributes input[name="str"]').val(),
                str_mod: $('#page-1 #attributes input[name="str-mod"]').val(),
                dex: $('#page-1 #attributes input[name="dex"]').val(),
                dex_mod: $('#page-1 #attributes input[name="dex-mod"]').val(),
                con: $('#page-1 #attributes input[name="con"]').val(),
                con_mod: $('#page-1 #attributes input[name="con-mod"]').val(),
                int: $('#page-1 #attributes input[name="int"]').val(),
                int_mod: $('#page-1 #attributes input[name="int-mod"]').val(),
                wis: $('#page-1 #attributes input[name="wis"]').val(),
                wis_mod: $('#page-1 #attributes input[name="wis-mod"]').val(),
                cha: $('#page-1 #attributes input[name="cha"]').val(),
                cha_mod: $('#page-1 #attributes input[name="cha-mod"]').val()
            },
            saves_skills: {
                spell_casting: $('#page-1 #saves-skills select[name="spell-att"]').val(),
                saves:  buildSavesSaveData(),
                skills: buildSkillsSaveData()
            },
            status: {
                conditions: $('textarea[name="conditions"]').val(),
                boons: $('textarea[name="boons"]').val(),
                death_saves: {
                    success: {
                        one:   $('input[name="success-1"]').prop("checked"),
                        two:   $('input[name="success-2"]').prop("checked"),
                        three: $('input[name="success-3"]').prop("checked")
                    },
                    failure: {
                        one:   $('input[name="failure-1"]').prop("checked"),
                        two:   $('input[name="failure-2"]').prop("checked"),
                        three: $('input[name="failure-3"]').prop("checked")
                    }
                },
                hit_dice: {
                    type: $('input[name="hit-dice"]').val(),
                    current_hd: $('input[name="current-hd"]').val()
                },
                temp_health: $('input[name="temp-health"]').val(),
                current_health: $('input[name="current-health"]').val(),
                max_health: $('input[name="max-health"]').val()
            },
            proficiencies: {
                weapon_armor: $('#weapons-armor textarea[name="weapons-armor"]').val(),
                tools: $('#tools textarea[name="tools"]').val(),
                languages: $('#languages textarea[name="languages"]').val()
            },
            attacks_spells: getAttacks(),
            charges: getChargeRows(),
            features: $('#page-1 #features textarea[name="features"]').val()
        },
        page2: {
            equipment: {
                val: getEquipment(),
                total_weight: $('#page-2 #equipment tr#total input[name="total-weight"').val(),
                currency: {
                    copper: $('#page-2 #currancy input[name="copper"]').val(),
                    silver: $('#page-2 #currancy input[name="silver"]').val(),
                    gold: $('#page-2 #currancy input[name="gold"]').val(),
                    electrum: $('#page-2 #currancy input[name="electrum"]').val(),
                    platinum: $('#page-2 #currancy input[name="platinum"]').val(),
                    total: $('#page-2 #currancy input[name="total"]').val(),
                    base: $('#page-2 #currancy select[name="base"]').val()
                },
                encumberance: {
                    base: $('#page-2 #encumberance input[name="base-encumberance"]').val(),
                    encumbered: $('#page-2 #encumberance input[name="encumbered-encumberance"]').val(),
                    h_encumbered: $('#page-2 #encumberance input[name="h-encumbered-encumberance"]').val(),
                    push: $('#encumberance input[name="push-encumberance"]').val()
                }
            },
            attacks_spells: getAttacks(),
            mount_pet: {
                name: $('#page-2 #mount-pet input[name="mount-name"]').val(),
                type: $('#page-2 #mount-pet input[name="mount-type"]').val(),
                health: $('#page-2 #mount-pet input[name="mount-health"]').val(),
                ac: $('#page-2 #mount-pet input[name="mount-ac"]').val(),
                speed: $('#page-2 #mount-pet input[name="mount-speed"]').val(),
                notes: $('#page-2 #mount-pet textarea[name="mount-notes"]').val()
            },
            mount_pet2: {
                name2: $('#page-2 #mount-pet input[name="mount-name-2"]').val(),
                type2: $('#page-2 #mount-pet input[name="mount-type-2"]').val(),
                health2: $('#page-2 #mount-pet input[name="mount-health-2"]').val(),
                ac2: $('#page-2 #mount-pet input[name="mount-ac-2"]').val(),
                speed2: $('#page-2 #mount-pet input[name="mount-speed-2"]').val(),
                notes2: $('#page-2 #mount-pet textarea[name="mount-notes-2"]').val()
            }

        },
        page4: {
            backstory: $('#page-4 #backstory textarea[name="backstory"]').val(),
            allies_organizations: {
                name: $('#page-4 #allies-organizations input[name="name"]').val(),
                val: $('#page-4 #allies-organizations textarea[name="allies-organizations"]').val()
            },
            personality: {
                personality_traits: $('#personality #personality-traits textarea[name="personality-traits"]').val(),
                ideals: $('#personality #ideals textarea[name="ideals"]').val(),
                bonds: $('#personality #bonds textarea[name="bonds"]').val(),
                flaws: $('#personality #flaws textarea[name="flaws"]').val()
            },
        },
page3: {
            spell_info: {
                class: $('#page-3 #spell-info input[name="class"]').val(),
                att: $('#page-3 #spell-info input[name="att"]').val(),
                dc: $('#page-3 #spell-info input[name="dc"]').val(),
                bonus: $('#page-3 #spell-info input[name="bonus"]').val()
            },
            spell_slots: {
                total_1: $('#page-3 #spells input[name="total-1"]').val(),
                total_2: $('#page-3 #spells input[name="total-2"]').val(),
                total_3: $('#page-3 #spells input[name="total-3"]').val(),
                total_4: $('#page-3 #spells input[name="total-4"]').val(),
                total_5: $('#page-3 #spells input[name="total-5"]').val()
            },
            spells: getSpells()
        },
        page5: {
            notes_1: $('#page-5 #notes-1 textarea[name="notes-1"]').val(),
            notes_2: $('#page-5 #notes-2 textarea[name="notes-2"]').val()
        }
    }

    // Convert to the same format your loader expects
    const saveString = "var loadJson = " + JSON.stringify(sheet);

    // Suggested filename based on character name
    const charName = sheet.page1.basic_info.char_name || "character";
    const suggested = `${charName.replace(/\s+/g, "_")}.json`;

    // Open a real Save dialog — re-opens in the last-used folder after first use
    const handle = await window.showSaveFilePicker({
        suggestedName: suggested,
        startIn: _lastFileHandle || 'documents',
        types: [{
            description: "Character Sheet",
            accept: { "application/json": [".json"] }
        }]
    });

    saveLastHandle(handle); // remember folder for next time

    // Write the file
    const writable = await handle.createWritable();
    await writable.write(saveString);
    await writable.close();

    markClean(); // sheet is now saved — clear the unsaved-changes flag
}