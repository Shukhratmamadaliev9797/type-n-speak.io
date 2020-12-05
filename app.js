// Init SpeechSynth API
const synth = window.speechSynthesis;
// elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-selection');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');


//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';

    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

//Line 35, 36 causes voice list duplication
getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//Fix for duplication, run code depending on the browser
if (isFirefox) {
    getVoices();
}
if (isChrome) {
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = getVoices;
    }
}

// speak 
function speak(){
   
    // check if speaking
    if(synth.speaking){
        console.error('Already speaking...');
        return;
    }
    if(textInput.value !== ''){
         // background animation
        body.style.background = 'url(wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%'; 
        // speak text   
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        // speak
        speakText.onend = function(e){
            console.log('Done Speaking...');
            body.style.background = '#141414';
        }

        // speak error
        speakText.onerror = function(e){
            console.log('Something went wrong');
        }
        
        // selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        voices.forEach(function(voice){
            if(voice.name === selectedVoice){
                speakText.voice = voice;
            }
        });

        // set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        synth.speak(speakText);
    }
    
}

// text form submit
textForm.addEventListener('submit', function(e){
    e.preventDefault();
    speak();
    textInput.blur();
});


// rate value change
rate.addEventListener('change', function(e){
    rateValue.textContent = rate.value;
});

// pitch value change
pitch.addEventListener('change', function(e){
    pitchValue.textContent = pitch.value;
});

// voice select change

voiceSelect.addEventListener('change', function(e){
    speak();
});