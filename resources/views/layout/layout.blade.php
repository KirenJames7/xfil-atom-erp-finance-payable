<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no" />
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#603cba">
        <meta name="theme-color" content="#ffffff">
        <title>{{ config('app.name') }}</title>
        @include('objects.css.css')         <!-- load the content from css.blade.php -->
    </head>
    <body>
        <div class="page-loader">
            <div id="particles-background" class="vertical-centered-box"></div>
            <div id="particles-foreground" class="vertical-centered-box"></div>
            <div class="lds-css ng-scope">
                <div class="lds-eclipse">
                    <div></div>
                </div>
            </div>
            <div class="atom-spinner">
                <div class="spinner-inner">
                    <div class="spinner-line"></div>
                    <div class="spinner-line"></div>
                    <div class="spinner-line"></div>
                </div>
            </div>
        </div>
        <div class="bmd-layout-container bmd-drawer-f-l" id="app">
                     
        </div>
        <script src="{{ asset('/plugins/page-loader/js/page-loader.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/waves/js/waves.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jquery/jquery-3.3.1.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/propper/popper.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/bootstrap-material-design/js/bootstrap-material-design.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jquery-data-table/datatables.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jquery-data-table/select-1.3.0/js/dataTables.select.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jquery-data-table/scroller-2.0.0/js/dataTables.scroller.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/sweetalerts/sweetalerts.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jquery/jquery.blockUI.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jquery/ui/jquery-ui.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jquery/ui/vertical-tabs.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/moo-tools/moo-tools.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/sumo-select/js/jquery.sumoselect.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/input-picker/jquery.inputpicker.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jsPDF/libs/png_support/zlib.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jsPDF/libs/png_support/png.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jsPDF/dist/jspdf.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jsPDF/plugins/png_support.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jsPDF/plugins/addimage.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jsPDF/plugins/total_pages.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jsPDF/rightalign.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/jsPDF-autotable/dist/jspdf.plugin.autotable.min.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/plugins/number-to-words/number-to-words.js') }}" type="text/javascript" ></script>
        <script src="{{ asset('/js/app.js') }}" type="module" ></script>
    </body>
</html>