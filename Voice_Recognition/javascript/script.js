window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'ja-JP';

let p = document.createElement('p');
const content = document.getElementById('content');
content.appendChild(p);

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    p.textContent = transcript;
    if (e.results[0].isFinal) {
        p = document.createElement('p');
        content.appendChild(p);
    }
});

recognition.addEventListener('start', () => {
    document.getElementById('recognition-status').textContent = 'Recognizing...';
});

recognition.addEventListener('end', () => {
    document.getElementById('recognition-status').textContent = 'Not Recognizing';
    recognition.start();
});

document.getElementById('start').addEventListener('click', () => {
    recognition.start();
});

document.getElementById('stop').addEventListener('click', () => {
    recognition.stop();
});

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;

            const length = array.length;
            for (let i = 0; i < length; i++) {
                values += (array[i]);
            }

            const average = values / length;
            console.log(Math.round(average));
            document.getElementById('volume-indicator').style.height = average + 'px';
        };
    })
    .catch(err => {
        console.log('The following error occurred: ' + err);
    });
