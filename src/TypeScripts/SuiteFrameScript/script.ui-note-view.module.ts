import serverWidget = require('N/ui/serverWidget')
import { Library } from './suiteframe.library.module.js';

export class NoteView {
  constructor(
			private scriptUrl: string
  ) {
  }

  public generate(context) {
    let html = 'Script Note';
    const { scriptNoteId } = context.request.parameters;

    const note = this.scriptNoteGet(scriptNoteId);
    if (note == null) {
      context.response.write('Error: An error occurred while executing the SuiteQL query.');
      return;
    }

    const css = Library.fileLoad('suiteframe.css');
    html = Library.fileLoad('script.ui-note-view.template.html');

    let searchRegExp = new RegExp('{{scriptUrl}}', 'g');
    html = html.replace(searchRegExp, this.scriptUrl);

    searchRegExp = new RegExp('{{appName}}', 'g');
    html = html.replace(searchRegExp, Library.appName);

    searchRegExp = new RegExp('{{appVersion}}', 'g');
    html = html.replace(searchRegExp, Library.appVersion);

    searchRegExp = new RegExp('{{appBuiltWith}}', 'g');
    html = html.replace(searchRegExp, Library.appBuiltWith);

    searchRegExp = new RegExp('{{css}}', 'g');
    html = html.replace(searchRegExp, css);

    searchRegExp = new RegExp('{{noteJSON}}', 'g');
    html = html.replace(searchRegExp, JSON.stringify(note, null, 5));

    if (Library.hideNavBar) {
      html = `<div style="margin: 16px;">${html}</div>`;
    }

    if (typeof context.request.parameters.json !== 'undefined') {
      html = `<pre>${JSON.stringify(note, null, 5)}</pre>`;
      Library.hideNavBar = true;
    }

    if (Library.hideNavBar) {
      context.response.write(html);
    } else {
      const form = serverWidget.createForm({ title: 'Script Note', hideNavBar: Library.hideNavBar });
      const htmlField = form.addField({ id: 'custpage_field_html', type: serverWidget.FieldType.INLINEHTML, label: 'HTML' });
      htmlField.defaultValue = html;
      context.response.writePage(form);
    }
  }

  private scriptNoteGet(scriptNoteId) {
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
    const records = Library.queryExecute(sql);
    if (records !== null) {
      return records[0];
    }
    return null;
  }
}
