define(["require", "exports", "N/ui/serverWidget", "./suiteframe.library.module.js"], function (require, exports, serverWidget, suiteframe_library_module_js_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoteView = void 0;
    class NoteView {
        constructor(scriptUrl) {
            this.scriptUrl = scriptUrl;
        }
        generate(context) {
            let html = 'Script Note';
            const { scriptNoteId } = context.request.parameters;
            const note = this.scriptNoteGet(scriptNoteId);
            if (note == null) {
                context.response.write('Error: An error occurred while executing the SuiteQL query.');
                return;
            }
            const css = suiteframe_library_module_js_1.Library.fileLoad('suiteframe.css');
            html = suiteframe_library_module_js_1.Library.fileLoad('script.ui-note-view.template.html');
            let searchRegExp = new RegExp('{{scriptUrl}}', 'g');
            html = html.replace(searchRegExp, this.scriptUrl);
            searchRegExp = new RegExp('{{appName}}', 'g');
            html = html.replace(searchRegExp, suiteframe_library_module_js_1.Library.appName);
            searchRegExp = new RegExp('{{appVersion}}', 'g');
            html = html.replace(searchRegExp, suiteframe_library_module_js_1.Library.appVersion);
            searchRegExp = new RegExp('{{appBuiltWith}}', 'g');
            html = html.replace(searchRegExp, suiteframe_library_module_js_1.Library.appBuiltWith);
            searchRegExp = new RegExp('{{css}}', 'g');
            html = html.replace(searchRegExp, css);
            searchRegExp = new RegExp('{{noteJSON}}', 'g');
            html = html.replace(searchRegExp, JSON.stringify(note, null, 5));
            if (suiteframe_library_module_js_1.Library.hideNavBar) {
                html = `<div style="margin: 16px;">${html}</div>`;
            }
            if (typeof context.request.parameters.json !== 'undefined') {
                html = `<pre>${JSON.stringify(note, null, 5)}</pre>`;
                suiteframe_library_module_js_1.Library.hideNavBar = true;
            }
            if (suiteframe_library_module_js_1.Library.hideNavBar) {
                context.response.write(html);
            }
            else {
                const form = serverWidget.createForm({ title: 'Script Note', hideNavBar: suiteframe_library_module_js_1.Library.hideNavBar });
                const htmlField = form.addField({ id: 'custpage_field_html', type: serverWidget.FieldType.INLINEHTML, label: 'HTML' });
                htmlField.defaultValue = html;
                context.response.writePage(form);
            }
        }
        scriptNoteGet(scriptNoteId) {
            const sql = `
      SELECT					
        ScriptNote.internalid,
        ScriptNote.date,
        ScriptNote.title,
        ScriptNote.type AS Type,
        ScriptNote.scripttype,
        ScriptNote.detail,
      FROM
        ScriptNote
      WHERE
        ScriptNote.internalid = ${scriptNoteId}
    `;
            const records = suiteframe_library_module_js_1.Library.queryExecute(sql);
            if (records !== null) {
                return records[0];
            }
            return null;
        }
    }
    exports.NoteView = NoteView;
});
