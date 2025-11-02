import React from 'react';



function ContentArea(props?: React.HTMLProps<HTMLDivElement>) {

  return (
    <div {...props}>
      <main>
        <h1>Content Area</h1>
        <table>
          <tr>
            <td><p>This is the main content area.</p></td>
            <td><p>It can contain various elements.</p></td>
          </tr>
          <tr>
            <td><p>Additional content can go here.</p></td>
          </tr>
          <tr>
            <td><p>More content can be added here.</p></td>
          </tr>
        </table>
      </main>
    </div>
  );
}

export default ContentArea;
