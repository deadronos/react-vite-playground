/*

🚀 Day 5: The Object Transformer & Key Mapper
Since you are comfortably handling arrays of objects and working with state, let's look at an essential skill for front-end engineers: data normalization and formatting.

Often, APIs return keys or formats that are raw, hard to read, or mismatched with what your UI actually needs. Your task today is to take a raw dataset and transform its structure before displaying it.

The Goal:
Imagine an API hands you an array of user data profiles. The keys are poorly formatted, timestamps are raw numbers, and names are separated into first and last strings.

Write a component that maps over this raw array and transforms each record into a clean UI-ready format:

TypeScript
// The raw data from the server
const rawUsers = [
  { user_id: 101, first_name: "alex", last_name: "mercer", registered_epoch: 1716501600000, is_active: true },
  { user_id: 102, first_name: "sarah", last_name: "connor", registered_epoch: 1716588000000, is_active: false },
  { user_id: 103, first_name: "bruce", last_name: "wayne", registered_epoch: 1716674400000, is_active: true },
];
Your component needs to process this list so that the rendered table displays:

Full Name: Combines first_name and last_name into a single, clean title-cased string (e.g., "Alex Mercer"). Feel free to reuse your Day 3 capitalization logic here!

Readable Date: Converts the registered_epoch timestamp into a readable date string (like MM/DD/YYYY or using JavaScript's .toLocaleDateString()).

Status Badge: Displays a clean string or badge for is_active (e.g., "Active" or "Inactive") instead of a raw boolean.

The Advanced Edge (Optional):
Try to separate the data transformation logic into its own pure function transformUserData(data) outside of the React component, so the component only has to handle rendering the clean data.

💡 Hints to get you started:
The Array Method: The native .map() method is perfect for transforming one array of objects into a brand new array of objects with a different shape.

Dates: You can feed a Unix epoch timestamp in milliseconds directly into the JavaScript Date constructor: new Date(timestamp).

Populate the raw data, run it through your transformer function, and let's see how your clean table turns out!

*/

type rawUser = {
  user_id: number;
  first_name: string;
  last_name: string;
  registered_epoch: number;
  is_active: boolean;
};
type rawUsers = rawUser[];

type cleanUser = {
  fullName: string;
  registeredDate: string;
  status: "Active" | "Inactive";
};
type cleanUsers = cleanUser[];

async function MockApi(): Promise<{ rawUsers: rawUsers}>  {
  const rawUsers = [
      { user_id: 101, first_name: "alex", last_name: "mercer", registered_epoch: 1716501600000, is_active: true },
      { user_id: 102, first_name: "sarah", last_name: "connor", registered_epoch: 1716588000000, is_active: false },
      { user_id: 103, first_name: "bruce", last_name: "wayne", registered_epoch: 1716674400000, is_active: true },
    ];

  return { rawUsers };
}


function transformUserData(data: rawUsers): cleanUsers {
  function capitalizeName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  function formatName(firstName: string, lastName: string): string {
    return `${capitalizeName(firstName)} ${capitalizeName(lastName)}`;
  }

  function formatDate(epoch: number): string {
    const date = new Date(epoch);
    return date.toLocaleDateString();
  }
  let cleanedData: cleanUsers =[];
  data.forEach((value:rawUser)=>{
    const cleanUser: cleanUser = {
      fullName: formatName(value.first_name, value.last_name),
      registeredDate: formatDate(value.registered_epoch),
      status: value.is_active ? "Active" : "Inactive",
    }
    cleanedData.push(cleanUser);
  });
  return cleanedData;
}

type Error = {
  message: string;
}


import React, {useState, useEffect} from "react";

export default function GeminiDailyChallenge5(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [cleanUsers, setCleanUsers] = useState<cleanUsers>([]);
  const [rawUsers, setRawUsers] = useState<rawUsers>([]);

  const [error, setError] = useState<string | null>(null);

  async function getRawData() {
    return await MockApi().then((response)=>{
      setRawUsers(response.rawUsers);
      const cleanedData = transformUserData(response.rawUsers);
      setCleanUsers(cleanedData);
      setIsLoading(false);
    }).catch((err:Error)=>{
      setError("Failed to fetch data from MockAPI "+err.message);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    getRawData().catch((err:Error)=>{
      setError("An unexpected error occurred while fetching data. "+err.message);
      setIsLoading(false);
    })
    if(!rawUsers) {
      console.log("No raw users data found.");
    } else {
      console.log("Raw users data fetched successfully.");
    }
    if(!cleanUsers) {
      console.log("No clean users data found.");
    } else {
      console.log("Clean users data transformed successfully.");
    }
    return () => {
      // Cleanup if necessary
    }
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Object Transformer & Key Mapper</h1>
      <p>Implement the object transformer and key mapper here!</p>
      {isLoading ? (
        <p>Loading...</p>
      ) : !error ? (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2">Full Name</th>
              <th className="py-2">Registered Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Map over the transformed data and render rows here */
              !cleanUsers.length ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">No users found.</td>
                </tr>
              ) : (
                cleanUsers.map((user, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2">{user.fullName}</td>
                    <td className="py-2">{user.registeredDate}</td>
                    <td className={`py-2 ${user.status === "Active" ? "text-green-500" : "text-red-500"}`}>
                      {user.status}
                    </td>
                  </tr>
                ))
              )
            }
          </tbody>
        </table>
      ) : (
        <p className="text-red-500">{error}</p>
      )}
    </div>
  );
}
