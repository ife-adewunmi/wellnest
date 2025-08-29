import { ScreenTimeMonitor } from 'screen-time-monitor';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    ScreenTimeMonitor.echo({ value: inputValue })
}
