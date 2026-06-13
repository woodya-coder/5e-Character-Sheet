$(document).ready(function () {

    // Delegated empty/fill for dynamic charge rows
    $('#charges').on('click', '.charge-empty', function () {
        $(this).closest('.charge-row').find('input[type="checkbox"]').prop('checked', false);
    });

    $('#charges').on('click', '.charge-fill', function () {
        $(this).closest('.charge-row').find('input[type="checkbox"]').prop('checked', true);
    });

});
