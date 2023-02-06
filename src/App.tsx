import { atom, useAtom } from "jotai";
import { LoremIpsum } from "lorem-ipsum";
import { useRef } from "react";
import { Pause, Play } from "react-feather";
import Typewriter, { TypewriterClass } from "typewriter-effect";
import { sleep } from "./sleep";
import { $settings, SettingsWidget } from "./SettingsWidget";

export let lorem = new LoremIpsum(
  {
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  },
  "plain"
);
export const setLorem = (newLorem: LoremIpsum) => (lorem = newLorem);
let restartAtom = atom(true);
export async function type(typewriter: TypewriterClass) {
  typewriter
    .changeDelay($settings.typingDelay)
    .typeString(
      '<span class="w-2 h-1 inline-block"></span>' +
        lorem.generateParagraphs(1) +
        "<br>"
    )
    .callFunction(async () => {
      await sleep(100);
      await type(typewriter);
    })
    .start();
}
export let typewriterGl: TypewriterClass | null = null;
function App() {
  let typewriterRef = useRef<TypewriterClass>(null);
  let [restart, setRestart] = useAtom(restartAtom);
  return (
    <>
      <header className="fixed right-0 flex flex-col gap-2 bg-white p-2 shadow">
        <button
          onClick={() => {
            setRestart((restart) => !restart);
          }}
        >
          {!restart ? <Play size={18} /> : <Pause size={18} />}
        </button>
        <SettingsWidget />
      </header>
      <div className="text-gray-700">
        <p>
          {restart ? (
            <Typewriter
              onInit={async (typewriter) => {
                //@ts-ignore
                typewriterRef.current = typewriter;
                // while (true) {
                //   await type(typewriter)
                // }
                typewriterGl = typewriter;
                type(typewriter);
              }}
            />
          ) : (
            "Paused"
          )}
        </p>
      </div>
    </>
  );
}

export default App;
