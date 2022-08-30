import record = require('N/record');
import serverWidget = require('N/ui/serverWidget')
import { Library } from './suiteframe.library.module.js';

export class DetailView {
  constructor(
			private scriptUrl: string
  ) {
  }

  public generate(context) {
    let html = 'Detail View';
    const { scriptId } = context.request.parameters;

    const script = this.scriptGet(scriptId);
    if (script == null) {
      context.response.write('Error: An error occurred while executing the SuiteQL query.');
      return;
    }

    const css = Library.fileLoad('suiteframe.css');
    html = Library.fileLoad('script.ui-detail-view.template.html');

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

    searchRegExp = new RegExp('{{scriptJSON}}', 'g');
    html = html.replace(searchRegExp, JSON.stringify(script, null, 5));

    if (Library.hideNavBar) {
      html = `<div style="margin: 16px;">${html}</div>`;
    }

    if (typeof context.request.parameters.json !== 'undefined') {
      html = `<pre>${JSON.stringify(script, null, 5)}</pre>`;
      Library.hideNavBar = true;
    }

    if (Library.hideNavBar) {
      context.response.write(html);
    } else {
      const form = serverWidget.createForm({ title: 'Script Details', hideNavBar: Library.hideNavBar });
      const htmlField = form.addField({ id: 'custpage_field_html', type: serverWidget.FieldType.INLINEHTML, label: 'HTML' });
      htmlField.defaultValue = html;
      context.response.writePage(form);
    }
  }

  private scriptGet(scriptId) {
    const sql = `
      SELECT					
        script.id,
        script.isinactive,
        script.scripttype,
        script.name,
      FROM
        script
      WHERE
        script.id = ${scriptId}
    `;

    const records = Library.queryExecute(sql);

    if (records !== null) {
      return records[0];
    }
    return null;
  }
}
