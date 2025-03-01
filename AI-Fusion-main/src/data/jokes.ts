import { ProgrammerJoke } from '../types';

export const programmerJokes: ProgrammerJoke[] = [
  {
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs!"
  },
  {
    setup: "Why do programmers always mix up Christmas and Halloween?",
    punchline: "Because Oct 31 == Dec 25!"
  },
  {
    setup: "How many programmers does it take to change a light bulb?",
    punchline: "None, that's a hardware problem!"
  },
  {
    setup: "Why was the JavaScript developer sad?",
    punchline: "Because he didn't know how to 'null' his feelings!"
  },
  {
    setup: "What's a programmer's favorite place to hang out?",
    punchline: "Foo Bar!"
  },
  {
    setup: "Why do Java developers wear glasses?",
    punchline: "Because they don't C#!"
  },
  {
    setup: "What's the object-oriented way to become wealthy?",
    punchline: "Inheritance!"
  },
  {
    setup: "Why did the developer go broke?",
    punchline: "Because he used up all his cache!"
  },
  {
    setup: "What do you call a programmer from Finland?",
    punchline: "Nerdic!"
  },
  {
    setup: "Why don't programmers like nature?",
    punchline: "It has too many bugs and no debugging tool!"
  }
];

export const getRandomJoke = (): ProgrammerJoke => {
  const randomIndex = Math.floor(Math.random() * programmerJokes.length);
  return programmerJokes[randomIndex];
};