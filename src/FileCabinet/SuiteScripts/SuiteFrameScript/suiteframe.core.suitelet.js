/**
 * SuiteFrame Core Script
 *
 * This is the core SuiteFrame script that "initializes the app, routes requests, delivers views,
 * and processes API requests".
 *
 * @NScriptName SuiteFrame Core Script
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 *
 *------------------------------------------------------------------------------------------
 * MIT License
 *------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2022 Timothy Dietrich.
 * Copyright (c) 2022 Matthew Plant.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *------------------------------------------------------------------------------------------
 * Developer(s)
 *------------------------------------------------------------------------------------------
 *
 * Tim Dietrich
 * • timdietrich@me.com
 * • https://timdietrich.me
 *
 * Matt Plant
 * • i@idev.systems
 * • https://idev.systems/
 *
 *------------------------------------------------------------------------------------------
 * History
 *------------------------------------------------------------------------------------------
 *
 * 20220601 - Tim Dietrich
 * • Initial version.
 *
 * 20220602 - Tim Dietrich
 * • Added support for "&json=T" URL param. Displays list view's recordset as a JSON string, and detail view's employee record. Added support for "enableDatatables" app-level setting.
 *
 * 20220612 - Tim Dietrich
 * • Initial public release.
 *
 * 20220826 - Matt Plant
 * • Initial SuiteFrame TypeScript SDF Project Template version.
 */
define(["require", "exports", "N/error", "N/log", "N/runtime", "N/url", "./script.ui-detail-view.module", "./script.ui-list-view.module", "./script.ui-note-view.module"], function (require, exports, error, log, runtime, url, script_ui_detail_view_module_1, script_ui_list_view_module_1, script_ui_note_view_module_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    let scriptUrl = '';
    function onRequest(context) {
        // make the script URL available to the UI modules
        scriptUrl = url.resolveScript({ scriptId: runtime.getCurrentScript().id, deploymentId: runtime.getCurrentScript().deploymentId, returnExternalUrl: false });
        try {
            // determine the request type
            if (context.request.method === 'GET') {
                // process the GET request
                getRequestHandle(context);
            }
            else {
                // process the POST request
                postRequestHandle(context);
            }
        }
        catch (e) {
            throw error.create({
                name: e.name,
                message: e.message,
                notifyOff: true
            });
        }
    }
    exports.onRequest = onRequest;
    function getRequestHandle(context) {
        // if ( typeof context.request.parameters.scriptId == 'undefined' && typeof context.request.parameters.scriptNoteId == 'undefined' ) {
        // 	const mainView = new MainView(scriptUrl);
        // 	mainView.generate(context);
        // } else {
        if (typeof context.request.parameters.scriptId !== 'undefined') {
            const detailView = new script_ui_detail_view_module_1.DetailView(scriptUrl);
            detailView.generate(context);
        }
        else {
            if (typeof context.request.parameters.scriptNoteId !== 'undefined') {
                const noteView = new script_ui_note_view_module_1.NoteView(scriptUrl);
                noteView.generate(context);
            }
            else {
                const listView = new script_ui_list_view_module_1.ListView(scriptUrl);
                listView.generate(context);
            }
        }
        // }
    }
    function postRequestHandle(context) {
        log.debug({
            title: 'postRequestHandle - context',
            details: context
        });
        const requestPayload = context.request.body;
        context.response.setHeader('Content-Type', 'application/json');
        if ((typeof requestPayload.function === 'undefined') || (requestPayload.function === null)) {
            context.response.write(JSON.stringify({
                error: 'No function was specified.'
            }));
            return;
        }
        switch (requestPayload.function) {
            default:
                context.response.write(JSON.stringify({
                    error: 'An unsupported function was specified.'
                }));
        }
    }
});
