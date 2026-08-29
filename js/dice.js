// ---- Core roller ----

function rollDie(n) {
    return Math.floor(Math.random() * n) + 1;
}

function parseMod(str) {
    if (!str) return 0;
    return parseInt(String(str).replace(/\s/g, '')) || 0;
}

// ---- Toast display ----

var _rollHideTimer = null;

function showRollResult(label, die, dieResult, mod, lastRollText) {
    var total    = dieResult + (mod || 0);
    var isCrit   = die === 20 && dieResult === 20;
    var isFumble = die === 20 && dieResult === 1;

    if (!lastRollText) {
        lastRollText = label + ': ' + dieResult +
            (mod ? ' ' + (mod >= 0 ? '+' : '−') + ' ' + Math.abs(mod) + ' = ' + total : '');
    }
    $('#last-roll-display').text(lastRollText);

    var toast  = document.getElementById('roll-toast');
    var elLabel  = toast.querySelector('.roll-toast-label');
    var elResult = toast.querySelector('.roll-toast-result');
    var elCrit   = toast.querySelector('.roll-toast-crit');

    elLabel.textContent = label;

    if (!mod) {
        elResult.innerHTML = '<span class="roll-die-val">' + dieResult + '</span>';
    } else {
        var sign    = mod >= 0 ? '+' : '−';
        var absMod  = Math.abs(mod);
        elResult.innerHTML =
            '<span class="roll-die-val">' + dieResult + '</span>' +
            '<span class="roll-op"> ' + sign + ' ' + absMod + ' </span>' +
            '<span class="roll-eq">= </span>' +
            '<span class="roll-total">' + total + '</span>';
    }

    if (isCrit) {
        elCrit.textContent = '🎯 Natural 20!';
        elCrit.className   = 'roll-toast-crit roll-crit-good';
    } else if (isFumble) {
        elCrit.textContent = '💀 Natural 1';
        elCrit.className   = 'roll-toast-crit roll-crit-bad';
    } else {
        elCrit.textContent = '';
        elCrit.className   = 'roll-toast-crit';
    }

    toast.classList.add('roll-toast-visible');
    clearTimeout(_rollHideTimer);
    _rollHideTimer = setTimeout(function () {
        toast.classList.remove('roll-toast-visible');
    }, 4000);
}

// ---- jQuery event wiring ----

$(document).ready(function () {

    // Sidebar quick-dice buttons
    $(document).on('click', '.quick-dice-btn', function () {
        var die = parseInt($(this).data('die'));

        var countInput = $('#dice-count');
        var count = parseInt(countInput.val()) || 1;
        if (count < 1) count = 1;

        var rolls = [];
        for (var i = 0; i < count; i++) {
            rolls.push(rollDie(die));
        }
        var total = rolls.reduce(function (sum, r) { return sum + r; }, 0);

        var label   = (count > 1 ? count + 'd' + die : 'd' + die) + ' Roll';
        var summary = (count > 1 ? count + 'd' + die : 'd' + die) + ': ' + rolls.join(' + ') +
            (count > 1 ? ' = ' + total : '');
        showRollResult(label, count === 1 ? die : -1, total, 0, summary);

        countInput.val(1);
    });

    // Saving throw labels → d20 + save modifier
    $('#saves').on('click', '.box .sub-label', function () {
        var mod   = parseMod($(this).closest('.box').find('input[type="text"]').val());
        var label = $(this).text() + ' Save';
        showRollResult(label, 20, rollDie(20), mod);
    });

    // Skill labels → d20 + skill modifier
    $('#saves-skills').on('click', '.skills-group .box .sub-label', function () {
        var mod   = parseMod($(this).closest('.box').find('input[type="text"]').val());
        var label = $(this).text() + ' Check';
        showRollResult(label, 20, rollDie(20), mod);
    });

    // Attribute labels → d20 + attribute modifier
    $('#attributes').on('click', '.label', function () {
        var mod   = parseMod($(this).closest('.w3-col').find('.att-mod').val());
        var label = $(this).text() + ' Check';
        showRollResult(label, 20, rollDie(20), mod);
    });

    // Initiative label → d20 + initiative modifier
    $('#top-bar').on('click', '.init-roll-label', function () {
        var mod = parseMod($('input[name="initiative"]').val());
        showRollResult('Initiative', 20, rollDie(20), mod);
    });
});
