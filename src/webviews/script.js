const vscode = acquireVsCodeApi();

document.getElementById('RPLC_List').addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    vscode.postMessage({
        command: 'rplcListChanged',
        value: selectedValue
    });
});

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'RPLC_Presets':
            document.getElementById('output').textContent = JSON.stringify(message.presets, null, 2);
            break;
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('RPLC_List');
    vscode.postMessage({
        command: 'rplcListChanged',
        value: select.value
    });
});