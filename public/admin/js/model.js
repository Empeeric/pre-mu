$(function() {
    var url = root + '/json/model/' + model;

    $('.free_search').click(function() {
        var value = $(this).siblings('input').val();
        var href = $(this).data('href').replace('__replace__', encodeURIComponent(value));
        location.href = href;
    });


    // highlight rows
    $('tbody tr').each(function() {
        var tr = $(this);
        $('.select-row', tr).change(function() {
            tr.toggleClass('warning', $(this).prop('checked'));
        });
    });

    $('.select-all-rows').click(function() {
        $(this).closest('table').find('.select-row')
            .prop('checked', $(this).prop('checked'))
            .trigger('change');
    });

    var $actions = $('#actions');
    $('.select-row').on('change', function() {
        if ($('.select-row:checked').length)
            $actions.fadeIn('fast');
        else
            $actions.fadeOut('fast');
    });

    $actions.find('button').click(function(e) {
        e.preventDefault();

        var action_id = $(this).val();
        if (!action_id) return;

        var ids = [];
        $('.select-row:checked').each(function(){
            ids.push($(this).closest('tr').attr('id'));
        });
        if (!ids.length) return;

        var msg = 'Are you sure you want to ' + $(this).text().toLowerCase()
            + ' ' + ids.length + ' documents?';

        bootbox.confirm(msg, function(result) {
            if (!result)
                return;

            console.log(action_id, ids);

            $.post(
                url + '/action/' + action_id,
                { ids: ids },
                function() {
                    location.reload();
                }
            );
        });
    });

    var btn = $('button#reorder');
    $('tbody.sortable').sortable({
        items: 'tr',
        handle: '.list-drag',
        placeholder: 'sortable-placeholder',
        axis: 'y',
        create: function(e) {
            btn.click(function(){
                btn.button('loading');

                var data = {};
                $('tr', e.target).each(function(index, ui){
                    var id = $(this).attr('id');
                    data[id] = index + startIndex;
                });

                $.post(
                    url + '/order',
                    data,
                    function() {
                        btn.button('saved')
                            .delay(1000)
                            .fadeOut('slow')
                            .queue(function(next) {
                                btn.button('reset');
                                next();
                            });
                    }
                );
            })
        },
        change: function() {
            btn.fadeIn('fast');
        }
    });
});