/*

🚀 Day 15: The LocalStorage State Sync (Persistent Application Memory)
Let's look at how to give your web applications permanent memory. Currently, whenever you refresh your Vite sandbox browser page, all of your progress (like your custom themes, completed todo items, or selected choices) vanishes. Real production apps preserve settings using browser storage APIs.

The Goal:
Create a compact profile settings panel where changes are saved to the browser's localStorage engine so that the values survive page refreshes.

Requirements:

The Form State: Create a simple profile form tracking three values:

username (string input)

theme (a toggle between "light" and "dark")

notificationsEnabled (a boolean checkbox)

Initial Hydration: When the component first mounts, it should check localStorage. If saved settings exist, load them directly into your state. If nothing is found, fall back to default values.

Automatic Synchronization: Whenever the user types into the username input, flips the theme toggle, or clicks the checkbox, update the state and save the updated settings string to localStorage.

💡 Hints to get you started:
JSON Serialization: localStorage can only read and write strings. To save a complex object state, use JSON.stringify(settingsObject). To read it back, use JSON.parse(savedString).

The Hydration Check: You can pass a function directly into your useState hook initialization to read from localStorage once during creation. This is called lazy state initialization:

TypeScript
const [settings, setSettings] = useState(() => {
  const saved = localStorage.getItem("user_settings");
  return saved ? JSON.parse(saved) : { username: "", theme: "light" };
});
Tracking Changes: A useEffect hook listening to your settings state is the perfect place to execute localStorage.setItem() automatically on every modification.

Wire up your inputs, reload your browser page mid-type, and check if your profile data holds steady. Paste your component when you're ready!

*/


import React, { useState, useEffect } from "react";

export default function GeminiDailyChallenge15() {

  return (
    <div>
      {/* Your profile settings form goes here */}
      <ProfileSettingsComponent />
    </div>
  );
}





function ProfileSettingsComponent() {
  // Define the shape of your settings state
  interface UserSettings {
    username: string;
    theme: "light" | "dark";
    notificationsEnabled: boolean;
  }

  const [usedDefaults, setUsedDefaults] = useState(false);

  function lazyInitializeSettings(): UserSettings {
    const saved = localStorage.getItem("user_settings");
    if (saved) {
      try {
        return JSON.parse(saved) as UserSettings;
      } catch (e) {
        console.error("Failed to parse saved settings, using defaults.", e);
      }
    }
    // Default settings if nothing is saved or parsing fails
    setUsedDefaults(true);
    return {
      username: "",
      theme: "light",
      notificationsEnabled: false,
    };
  }

  // Initialize state with lazy function to read from localStorage
  const [settings, setSettings] = useState<UserSettings>(() => {
    return lazyInitializeSettings();
  });

  // watch if we used defaults and log
  useEffect(()=> {
    if(usedDefaults) {
      console.log("No saved settings found, using defaults.");
    } else {
      console.log("Loaded settings from localStorage:", settings);
    }
    return () => {
      // Cleanup if needed when component unmounts
    };
  },[usedDefaults, settings]);

  function SettingsToMapper(settings: UserSettings): Map<string, string | boolean> {
    const map = new Map<string, string | boolean>();
    map.set("username", settings.username);
    map.set("theme", settings.theme);
    map.set("notificationsEnabled", settings.notificationsEnabled);
    return map;
  }

  function handleSettingChange<T extends string | boolean>(key: string, newValue: T) {
    const updatedSettings = { ...settings, [key]: newValue };
    setSettings(updatedSettings);
    localStorage.setItem("user_settings", JSON.stringify(updatedSettings));
    console.log(`Updated settings saved to localStorage:`, updatedSettings);
  }

  const [pickerLabelToOpen, setPickerLabelToOpen] = useState<string | null>(null);

  function openPickerOnClick(key: string) {
    setPickerLabelToOpen(key);
    // we have a conditional render that reads
    // this state it just needs to know which label or key to open for, the values can be read from the settings state directly in the render
  }

  function handleOnChangeAndResetPickerToOpenToNull<T extends string | boolean>(label: string, newValue: T) {
    handleSettingChange(label, newValue);
    setPickerLabelToOpen(null);
  }

  return (
    <div>
      <h2>Profile Settings</h2>
      {/* Your profile settings form goes here */}
      {/*current profile settings state: {JSON.stringify(settings)}*/}

      {/* Render buttons to open pickers for each setting */}
      {Array.from(SettingsToMapper(settings)).map(([key, value]) => (
        <div key={key}>
          <button onClick={() => openPickerOnClick(key)}>
            click to edit {key}: {String(value)}
          </button>
        </div>
      ))}
      {/* Conditionally render SettingsPicker based on pickerLabelToOpen */}
      {pickerLabelToOpen && (
        <SettingsPicker
          label={pickerLabelToOpen}
          values={settings[pickerLabelToOpen as keyof UserSettings]}
          constrainedV={pickerLabelToOpen === "theme" ? ["light", "dark"] : undefined}
          onChange={handleOnChangeAndResetPickerToOpenToNull}
        />
      )}
    </div>
  );
}



interface SettingsPickerProps<T extends string, V extends string | boolean> {
  label: T;
  values: V
  constrainedV?: V[]; // optional array of allowed values for validation
  onChange: (label:T,newValue: V) => void;
}

function SettingsPicker<T extends string, V extends string | boolean>({ label, values, constrainedV, onChange }: SettingsPickerProps<T, V>) {
  // Implementation of the SettingsPicker component
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
    //check if values are boolean or string and handle accordingly
    if (typeof values === "boolean") {
      onChange(label, e.target.value === "true" ? true as V : false as V);
      return;
    } else if (typeof values === "string") {
      onChange(label, e.target.value as V);
      return;
    }
    // if we are neither something went wrong
    throw new Error("Unsupported value type for SettingsPicker");
  };

  function MapConstrainedVToOptions(constrainedV: V[]): { label: string; value: V }[] {
    return constrainedV.map((v) => ({
      label: String(v),
      value: v,
    }));
  }

  function handleSaveClick() {
    // for freeform text input we need to read the value from the input field and pass it to onChange
    const inputElement = document.getElementById("freeform-text-input") as HTMLInputElement;
    if (inputElement) {
      onChange(label, inputElement.value as V);
    }
  }

  return (
    <div>
      {/* Condtional rendering based on wether we have constraints
      if we have constraints we render a select with only those options,
      otherwise we render a select with the current value as the only option */}
      {constrainedV ?
        <select value={String(values)} onChange={handleChange}>
          {MapConstrainedVToOptions(constrainedV).map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
        :
        typeof values === "boolean" ? (
          <select value={String(values)} onChange={handleChange}>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        ) : (<>
          <input id="freeform-text-input" type="text" placeholder="type your new text" />
          <button onClick={handleSaveClick}>Save</button>
        </>
        )
      }
    </div>
  );

}
