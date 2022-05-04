const style = {
  text: "#3F3A36",
  border: "#DBDAD9",
  accent: "#7B61BF",
  typeface: `system-ui, sans-serif`,
};

const textbase = `font-family: ${style.typeface}; color:${style.text};`;

const renderer = {
  heading(text, level) {
    let markup;
    switch (level) {
      case 1:
        markup = `<h1 style="font-family: ${style.typeface}; color:${style.accent}; font-size: 32px; margin: 60px 0px 10px 0px; padding: 0px;">${text}</h1>`;
        break;
      case 2:
        markup = `<h2 style="border-bottom: 1px solid ${style.text}; font-family: ${style.typeface}; color:${style.text}; font-size: 24px; margin: 60px 0px 20px 0px; padding: 0px 0px 10px 0px;">${text}</h2>`;
        break;
      case 3:
        markup = `<h3 style="font-family: ${style.typeface}; color:${style.text}; font-size: 20px; margin: 40px 0px 10px 0px; padding: 0px;">${text}</h3>`;
        break;
      case 4:
        markup = `<h4 style="font-family: ${style.typeface}; color:${style.text}; font-size: 18px; margin: 40px 0px 10px 0px; padding: 0px;">${text}</h4>`;
        break;
      case 5:
        markup = `<h5 style="font-family: ${style.typeface}; color:${style.text}; font-size: 14px; margin: 10px 0px 5px 0px; padding: 0px;">${text}</h5>`;
        break;
      default:
        markup = `<h5 style="font-family: ${style.typeface}; color:${style.text}; font-size: 14px; margin: 0px 0px 10px 0px; padding: 0px;">${text}</h5>`;
    }
    return markup;
  },
  paragraph(text) {
    return `<p style="${textbase} font-size: 16px; line-height: 24px; margin: 0px 0px 10px 0px; padding: 0px;">${text}</p>`;
  },
  table(header, body) {
    return `
        <table border="0" cellspacing="0" width="100%" style="width: 100%; padding: 0px; margin: 20px 0px;  border-collapse: collapse;">
            <thead style="${textbase} font-size: 14px; font-weight: bold; line-height: 24px; margin: 0px; padding: 0px;">${header}</thead>
            <tbody style="${textbase} font-size: 16px; line-height: 24px; margin: 0px; padding: 0px;">${body}</tbody>
        </table>
    `;
  },
  tablerow(content) {
    return `
        <tr>${content}</tr>
    `;
  },
  tablecell(content) {
    return `
        <td style="border: 1px solid ${style.border}; padding: 10px 10px;">${content}</td>
    `;
  },
  blockquote(quote) {
    return `<blockquote style="background: white; margin: 20px 0px 20px 0px; padding: 10px 15px; border: 1px solid ${style.border};">${quote}</blockquote>`;
  },
  image(href, title, text) {
    return `<img style="margin: 20px 0px 10px 0px; border: 1px solid ${style.border};" width="100%" src="${href}" alt="${text}" title="${title}" />`;
  },
  link(href, title, text) {
    return `<a target="_blank" style="color: ${style.accent}; font-weight: bold;" href="${href}" title="${title}">${text}</a>`;
  },
  list(body, ordered, start) {
    return `<ul style="${textbase} font-size: 16px; line-height: 24px; margin: 20px 0px 20px 20px; padding: 0px;">${body}</ul>`;
  },
  listitem(text, task, checked) {
    let markup;
    if(task) {
      if(checked) {
        markup = `<li>Task checked ${text}</li>`;
      } else {
        markup = `<li>Task uncheckedchecked ${text}</li>`;
      }
    } else {
      markup = `<li>${text}</li>`;
    }
    return markup;
  }
};

marked.use({renderer});

const render = () => {
  // Grab the current markdown
  let markdown = window.editor.getValue();

  // Generate the data object
  let bodyHtml = marked.parse(markdown);

  document.getElementById("render").innerHTML = `
    <div style="max-width: 640px; margin: 0px auto; padding: 10px">
      ${bodyHtml}
    </div>`;

  window.htmlCode.setValue(format(bodyHtml));
};

window.onload = () => {
  let markdown = localStorage.getItem("markdown")
        ? localStorage.getItem("markdown")
        : `# PopNews №8
Welcome to PopNews №8 for May 2022 🎉
        
If you are on this list, it's because you help us in one way or another, so thank you again! 👋
        
## 🌟 Product Updates
        
Maxime itaque ab eveniet, veniam nam optio illum fugiat assumenda tempore recusandae itaque rem, voluptatibus quis natus saepe ad.
        
> Nemo harum soluta a voluptate deserunt nihil voluptatum doloribus amet, omnis odio impedit sequi explicabo suscipit esse doloribus consequatur iste ducimus, obcaecati vel distinctio magnam ratione perferendis accusamus, perspiciatis dolore velit vitae veritatis eaque deleniti alias autem dicta nemo?

## 🤔 How to help?

Aliquid nam quaerat, ratione fugiat repellat odit ipsum, eaque nisi itaque perspiciatis, magnam quos nobis accusantium possimus illo.

Thanks, until next time!`;

  window.editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "markdown",
    theme: "nord",
    lineNumbers: true,
    lineWrapping: true
  });
  window.editor.on('change', function (i, op) {
    localStorage.setItem("markdown", window.editor.getValue());
    render();
  });

  window.htmlCode = CodeMirror.fromTextArea(document.getElementById("htmlCode"), {
    mode : "xml",
    htmlMode: true,
    theme: "nord",
    lineNumbers: true,
    lineWrapping: true
  });

  window.editor.setValue(markdown);
  render();
};

function format(html) {
  var tab = '\t';
  var result = '';
  var indent= '';

  html.split(/>\s*</).forEach(function(element) {
      if (element.match( /^\/\w/ )) {
          indent = indent.substring(tab.length);
      }

      result += indent + '<' + element + '>\r\n';

      if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input")  ) { 
          indent += tab;              
      }
  });

  return result.substring(1, result.length-3);
}
