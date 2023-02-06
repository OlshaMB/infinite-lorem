import { Settings, X } from "react-feather";
import * as RDialog from "@radix-ui/react-dialog";
import { proxy, subscribe, useSnapshot } from "valtio";
import { setLorem, typewriterGl } from "./App";
import { LoremIpsum } from "lorem-ipsum";

interface ISettings {
  typingDelay: number | "natural";
  sentencesPerParagraph: {
    max: number;
    min: number;
  };
  wordsPerSentence: {
    max: number;
    min: number;
  };
}

export const $settings = proxy<ISettings>(
  JSON.parse(localStorage.getItem("settings") ?? "false") || {
    typingDelay: "natural",
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  }
);
subscribe($settings, () => {
  localStorage.setItem("settings", JSON.stringify($settings));
});
subscribe($settings, () => {
  setLorem(
    new LoremIpsum({
      sentencesPerParagraph: $settings.sentencesPerParagraph,
      wordsPerSentence: $settings.wordsPerSentence,
    })
  );
});

export function SettingsWidget() {
  let settings = useSnapshot($settings);
  return (
    <RDialog.Root>
      <RDialog.Trigger>
        <Settings size={18} />
      </RDialog.Trigger>
      <RDialog.Portal>
        <RDialog.Overlay className="fixed inset-0 bg-black bg-opacity-80" />
        <RDialog.Content className="fixed top-1/2 left-1/2 flex h-[50vh] w-[70vw] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col rounded bg-white font-sans">
          <div className="flex border-b p-1 text-gray-700">
            <RDialog.Title className="flex flex-grow justify-center">
              Settings
            </RDialog.Title>
            <RDialog.Close>
              <X />
            </RDialog.Close>
          </div>
          <div className="m-1 rounded bg-amber-300 p-1 text-sm text-amber-900">
            Warning: some settings require waiting for typewriter to finish
            pargraph or a restart
          </div>
          <fieldset className="mx-1 flex gap-2 text-sm">
            <label>Typing delay:</label>
            <input
              type={"number"}
              value={
                settings.typingDelay == "natural" ? 120 : settings.typingDelay
              }
              min={20}
              step={10}
              max={2000}
              className={"rounded border border-gray-400"}
              onChange={(ev) => {
                $settings.typingDelay = Number(ev.target.value);
                console.log(typewriterGl);
              }}
            />
          </fieldset>
          <fieldset className="mx-1 rounded border border-gray-400 p-1 text-sm">
            <legend>Words per sentence</legend>
            <label
              className="pr-1"
              htmlFor="wordsMin"
            >
              Min:
            </label>
            <input
              type={"number"}
              id="wordsMin"
              className="mr-1 rounded border border-gray-400"
              min={4}
              max={32}
              value={settings.wordsPerSentence.min}
              onChange={(ev) => {
                $settings.wordsPerSentence.min = Number(ev.target.value);
              }}
            />
            <label
              className="pr-1"
              htmlFor="wordsMax"
            >
              Max:
            </label>
            <input
              type={"number"}
              id="wordsMax"
              className="rounded border border-gray-400"
              min={4}
              max={32}
              value={settings.wordsPerSentence.max}
              onChange={(ev) => {
                $settings.wordsPerSentence.max = Number(ev.target.value);
              }}
            />
          </fieldset>
          <fieldset className="mx-1 rounded border border-gray-400 p-1 text-sm">
            <legend>Sentences per pargraph</legend>
            <label
              className="pr-1"
              htmlFor="pargraphMin"
            >
              Min:
            </label>
            <input
              type={"number"}
              id="pargraphMin"
              className="mr-1 rounded border border-gray-400"
              min={4}
              max={32}
              value={settings.sentencesPerParagraph.min}
              onChange={(ev) => {
                $settings.sentencesPerParagraph.min = Number(ev.target.value);
              }}
            />
            <label
              className="pr-1"
              htmlFor="pargraphMax"
            >
              Max:
            </label>
            <input
              type={"number"}
              id="pargraphMax"
              className="rounded border border-gray-400"
              min={4}
              max={32}
              value={settings.sentencesPerParagraph.max}
              onChange={(ev) => {
                $settings.sentencesPerParagraph.max = Number(ev.target.value);
              }}
            />
          </fieldset>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
