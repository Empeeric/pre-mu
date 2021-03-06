﻿/*
 Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    config.language = 'en';
    config.forcePasteAsPlainText = true;
    // config.uiColor = '#AADC6E';
    config.toolbar = [
        ['Source'],
        ['Bold', 'Italic', 'Underline', 'StrikeThrough', '-', 'Outdent', 'Indent', '-', 'Blockquote'],
        ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Link'], ['Styles', 'Format', 'Font', 'FontSize']
    ];
};
