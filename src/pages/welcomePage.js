import { USER_INTERFACE_ID, START_QUIZ_BUTTON_ID } from '../constants.js';
import { createWelcomeElement } from '../views/welcomeView.js';
import { initQuestionPage } from './questionPage.js';
import { quizData } from '../data.js';
import { getQuizDataLS, showHint } from '../helper.js';

export let userName = '';
const userInterface = document.getElementById(USER_INTERFACE_ID);

export const initWelcomePage = (playSoundAgain) => {
  document.body.classList.add('welcome-background');
  if (playSoundAgain) {
    const soundWelcomeButton = document.querySelector('.sound__button');
    const audioWelcome = document.querySelector('.music');
    if (soundWelcomeButton && audioWelcome) {audioWelcome.remove();
      soundWelcomeButton.remove();}
  }
  const savedUserName = localStorage.getItem('userName');
  const quizDataLs = getQuizDataLS();

  if (savedUserName && quizDataLs !== '{}') {
    initQuestionPage();
    return;
  }

  userInterface.classList.add('background__welcome');

  userInterface.innerHTML = '';

  let isPlaying = true;
  const soundButton = document.createElement('button');
  soundButton.classList.add('sound__button');
  const audio = document.createElement('audio');
  audio.classList.add('music');
  audio.id = 'audio__id';
  audio.src = './audio/main theme.mp3';
  // audio.autoplay = true;
  audio.loop = true;
  const soundButtonImg = document.createElement('img');
  soundButtonImg.classList.add('sound__button__img');
  soundButtonImg.src = './images/volume.png';
  soundButton.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      soundButtonImg.src = './images/no-sound.png';
    } else {
      audio.play();
      isPlaying = true;
      soundButtonImg.src = './images/volume.png';
    }
  });

  soundButton.appendChild(soundButtonImg);
  document.body.appendChild(soundButton);
  document.body.appendChild(audio);
  // play music after first click
  document.addEventListener(
    'click',
    () => {
      if (isPlaying && audio.paused) {
        audio.play().catch((err) => {
          console.warn('Audio play blocked:', err);
        });
      }
    },
    { once: true }
  );

  const welcomeElement = createWelcomeElement();
  userInterface.appendChild(welcomeElement);

  document
    .getElementById(START_QUIZ_BUTTON_ID)
    .addEventListener('click', startQuiz);

  document.querySelector('.input__name').addEventListener('change', (e) => {
    userName = e.target.value;
    localStorage.setItem('userName', userName);
  });

  // Background moving feature
  document.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const staticArea = document.querySelector('#user-interface');
    const rect = staticArea.getBoundingClientRect();
    const isInsideStaticArea =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    if (!isInsideStaticArea) {
      const xOffset = (clientX / innerWidth) * 100;
      const yOffset = (clientY / innerHeight) * 100;
      document.body.style.backgroundPosition = `${xOffset}% ${yOffset}%`;
    } else {
      document.body.style.backgroundPosition = 'center center';
    }
  });
};

const startQuiz = () => {
  localStorage.setItem('quizDataLS', JSON.stringify(quizData));
  if (userName.trim().length < 1) {
    document.querySelector('.input__name').classList.add('need__name');
    const helperText = showHint(
      ['hint', 'helperText'],
      `To continue, enter your name.`
    );
    document.querySelector('body').appendChild(helperText);
    return;
  } else {
    userInterface.classList.remove('background__welcome');
    initQuestionPage();
  }
};
