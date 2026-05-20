/*
Mini Factory Queue Simulator

Very Factorio-lite.

Ore -> Furnace -> Plate -> Storage

Every second:

Ore node generates ore
Furnace processes ore after delay
Storage counts items

Display nodes as cards connected by arrows.

Goal: avoid prop drilling by introducing context.

type Resource = "ore" | "plate";

type Machine = {
  id: string;
  input?: Resource;
  output: Resource;
  progress: number;
};

Stretch:

Drag machines
Save state
Offline progression
*/


export default function ChatGPTChallenge1() {
  return (
    <div>
      <h1>Mini Factory Queue Simulator</h1>
      <p>Very Factorio-lite.</p>
      <p>Ore -&gt; Furnace -&gt; Plate -&gt; Storage</p>
      <p>Every second:</p>
      <ul>
        <li>Ore node generates ore</li>
        <li>Furnace processes ore after delay</li>
        <li>Storage counts items</li>
      </ul>
      <p>Display nodes as cards connected by arrows.</p>
      <p>Goal: avoid prop drilling by introducing context.</p>
    </div>
  )
}
