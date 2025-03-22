import { quizData } from './data.js';
// I add a new file that we can put the generic functions
export const updateQuestion = (questionIndex, updatedValue) => {
  let { questions } = quizData;
  const newQuestions = questions.map((question, index) => {
    if (index === questionIndex) {
      return { ...question, ...updatedValue };
    } else {
      return question;
    }
  });
  quizData.questions = newQuestions;
  return newQuestions[questionIndex];
};

export const clearHint = () => {
  const helperHint = document.querySelector('.hint');
  helperHint?.remove();
};

export const showHint = (classNameArr, text, url = null) => {
  clearHint();
  const helperText = document.createElement(`${url ? 'a' : 'div'}`);
  if (url) {
    helperText.setAttribute('target', '_blank');
  }
  helperText.classList.add(...classNameArr);
  helperText.textContent = text;
  helperText.href = url;
  return helperText;
};
