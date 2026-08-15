$(document).ready(function () {

    // Delegated empty/fill for dynamic charge rows
    $('#charges').on('click', '.charge-empty', function () {
        $(this).closest('.charge-row').find('input[type="checkbox"]').prop('checked', false);
    });

    $('#charges').on('click', '.charge-fill', function () {
        $(this).closest('.charge-row').find('input[type="checkbox"]').prop('checked', true);
    });

    // Damage field: on Enter, subtract the entered amount from Current HP
    $('#dmg-input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            var dmg = parseInt($(this).val(), 10);
            if (!isNaN(dmg)) {
                var currentHealthInput = $('input[name="current-health"]');
                var currentHp = parseInt(currentHealthInput.val(), 10) || 0;
                currentHealthInput.val(currentHp - dmg);
            }
            $(this).val('');
        }
    });

});
