/*

🚀 Day 13: The Fetch Search & Cache Component (Real API integration)
You've built simulated asynchronous engines, handled data filters, and managed debounced values. Now, it's time to test your skills against a live, real-world public web API.

We are going to request live data using browser-native fetch calls, handle raw JSON responses, and introduce a fundamental optimization technique: In-Memory Caching.

The Goal:
Create a small dashboard that searches for real GitHub organizations or users as you type and displays their public information.

We will fetch from the public GitHub Users API endpoints:

https://api.github.com/users/{username}

Requirements:

The Live Integration: Create a search text input. When a username is inputted, fetch the data from the live GitHub endpoint. (Feel free to reuse your Day 7 Debouncer here to avoid hitting GitHub's rate limits while typing!).

Display Elements: Parse the incoming payload data and display:

The user's profile avatar icon (avatar_url).

Their display profile name (name).

Total public repositories count (public_repos).

The Cache Matrix (The Twist): Before firing a raw fetch() call, check a local state object cache. If you have searched for "octocat" previously during this session, pull it instantly out of your cache state instead of hitting the internet a second time!

💡 Hints to get you started:
The Cache Storage: An object map dictionary state works beautifully here:

const [cache, setCache] = useState<Record<string, any>>({});

Updating the Cache Matrix: When a network call completes successfully, save the response to the state object before parsing it to the active UI state:

setCache(prev => ({ ...prev, [username]: responseData }));

Handling Errors: Public APIs can fail or return HTTP 404 errors if a user types a profile that doesn't exist. Make sure your code wraps your request in a standard try/catch or check if (!response.ok) to prevent the component from freezing!

Let's see how you map a real live network connection into your dynamic playground. Paste your updated file whenever you're ready!

*/




type GitHubAPIType = {
  fetchUserProfile: (username: string) => Promise<APIResponse>;
  canMakeRequest: () => boolean;
}

class GitHubAPI implements GitHubAPIType {

  static BASE_URL = "https://api.github.com/users/";
  static RESPONSE_TIMEOUT = 5000; // milliseconds
  static RESPONSE_OK_STATUS = 200;
  static RESPONSE_NOT_FOUND_STATUS = 404;
  static RESPONSE_RATE_LIMIT_STATUS = 403;
  static RESPONSE_ERROR_STATUS = 500;
  static RATE_LIMIT_MESSAGE = "API rate limit exceeded";

  protected howManyRequestsMade = 0;
  protected lastRequestTime = 0;


  constructor() {
    // we can initialize any state or configuration here if needed
    this.howManyRequestsMade = 0;
    this.lastRequestTime = 0;
    this.canMakeRequest = this.canMakeRequest.bind(this);
  }

  destroy(): void {
    // any cleanup if needed when the API instance is no longer needed
  }

  protected updateRequestCount(): void {
    const now = Date.now();
    if (now - this.lastRequestTime >= GitHubAPI.RESPONSE_TIMEOUT) {
      // reset the counter after the timeout period has passed
      this.howManyRequestsMade = 0;
    }
    this.howManyRequestsMade++;
    this.lastRequestTime = now;
  }

  public canMakeRequest(): boolean {
    this.updateRequestCount();
    return this.howManyRequestsMade <= 5; // GitHub's unauthenticated rate limit is 60 requests per hour, but we'll use a lower threshold for testing
  }

  async fetchUserProfile(username: string): Promise<APIResponse> {
    try {
      // should we wait before making the next request to avoid hitting rate limits?
      if (!this.canMakeRequest()) {
        return { hadError: true, error: { message: GitHubAPI.RATE_LIMIT_MESSAGE, documentation_url: "" } };
      }

      const response = await fetch(GitHubAPI.BASE_URL + username);
      if (response.status === GitHubAPI.RESPONSE_OK_STATUS) {
        const data:unknown = await response.json();
        let parsedData: UserProfile;
        // we can do some basic validation of the incoming data to make sure it has the properties we expect before we try to use it in our UI
        if (typeof data === "object" && data !== null && "login" in data && "name" in data && "avatar_url" in data && "public_repos" in data) {
          parsedData = {
            login: String((data as UserProfile).login),
            name: String((data as UserProfile).name),
            avatar_url: String((data as UserProfile).avatar_url),
            public_repos: Number((data as UserProfile).public_repos),
          };
        } else {
          return {
            hadError: true, error: { message: "Invalid response format, could not parse", documentation_url: "" } };
        }

        const profile: UserProfile = parsedData;
        return { hadError: false, profile };
      } else if (response.status === GitHubAPI.RESPONSE_NOT_FOUND_STATUS) {
        return { hadError: true, error: { message: "User not found", documentation_url: "" } };
      } else if (response.status === GitHubAPI.RESPONSE_RATE_LIMIT_STATUS) {
        return { hadError: true, error: { message: GitHubAPI.RATE_LIMIT_MESSAGE, documentation_url: "" } };
      } else {
        return { hadError: true, error: { message: "Unknown error occurred", documentation_url: "" } };
      }
    } catch (error) {
      return { hadError: true, error: { message: (error as Error).message, documentation_url: "" } };
    }
  }
}






import React, {useState,useEffect,useMemo} from "react";

export default function GeminiDailyChallenge13(): React.JSX.Element {

  return (
    <div>
      <h2>Gemini Daily Challenge 13 - the fetch search & cache component (real API integration)</h2>
      <p>Type a GitHub username to fetch and display their profile information. Results will be cached for faster subsequent searches.</p>
      {/* Your implementation of the fetch search & cache component goes here */}
      <FetchSearchCacheComponent />
    </div>
  );
}


interface UserProfile {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
}

type ExampleProfile = {
  login: "octocat";
  name: "The Octocat";
  avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4";
  public_repos: 8;
}

interface UserProfileViewProps {
  profile: UserProfile;
}

function UserProfileView({ profile }: UserProfileViewProps): React.JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
      <img src={profile.avatar_url} alt={`${profile.login}'s avatar`} style={{ width: '80px', borderRadius: '40px' }} />
      <div>
        <h3>{profile.name || profile.login}</h3>
        <p>Public Repositories: {profile.public_repos}</p>
      </div>
    </div>
  );
}

type Error={
  message: string;
  documentation_url: string;
}

type Cache = Record<string, UserProfile>;


function FetchSearchCacheComponent(): React.JSX.Element {
  const [username, setUsername] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<Error | null>(null)

  // changes to profile should update the cache as well, so we can use useMemo to create a memoized cache object that updates whenever the profile changes
  const [cache, setCache] = useState<Cache>({});

  type API_BACKEND_TYPE = "MockAPI" | "RealAPI";
  const [API_BACKEND,setAPI_BACKED] = useState<API_BACKEND_TYPE>("MockAPI");

  const apiInstance = new GitHubAPI();

  function handleSearch(username: string): void {
    // some search value changed - waiting for debounce to trigger the actual search
  }
  function handleDebouncedSearch(username: string): void {
    // the debounced value is ready - time to check cache and potentially fetch
    // username undefined
    if(!username) {
      setProfile(null);
      setError(null);
      console.log("Empty username. Ignoring search.");
      return;
    }
    // username empty string after trimming
    if(username.trim() === "") {
      setProfile(null);
      setError(null);
      console.log("Empty username after trimming. Ignoring search.");
      return;
    }


    console.log("Debounced search triggered for:", username);
    setUsername(username);
    setShouldFetch(true);
  }

  //watch for username changes and trigger fetch if needed
  useEffect(() => {
    if (!shouldFetch || !username) return;
    // fetch can do cache lookup
    async function fetchProfile() {
      setError(null); // reset previous errors
      // check cache first
      if (cache[username]) {
        console.log("Cache hit for username:", username);
        setProfile(cache[username]);
        return;
      }
      console.log("Cache miss for username:", username, "Fetching from API...");
       // if not in cache, do the fetch and update cache
      let responseData: APIResponse;
      // implement mock first
      if (API_BACKEND === "MockAPI") {
        responseData = await MockAPI.fetchUserProfile(username);
        if (responseData.hadError) {
          setError(responseData.error ?? { message: "Unknown error", documentation_url: "" });
          setProfile(null);
        } else if (responseData.profile) {
          console.log("Fetched profile from MockAPI:", responseData.profile);
          setProfile(responseData.profile);
          setCache(prev => ({ ...prev, [username]: responseData.profile! }));
        }
      } else {
        // use API instance to fetch from real API
        if(!apiInstance) {
          setError({ message: "API instance not initialized", documentation_url: "" });
          setProfile(null);
          return;
        }
        responseData = await apiInstance.fetchUserProfile(username);
        if (responseData.hadError) {
          setError(responseData.error ?? { message: "Unknown error", documentation_url: "" });
          setProfile(null);
        } else if (responseData.profile) {
          console.log("Fetched profile from Real API:", responseData.profile);
          setProfile(responseData.profile);
          setCache(prev => ({ ...prev, [username]: responseData.profile! }));
        }
      }
    }
    fetchProfile().catch((e:Error) => {
      setError(e);
      setProfile(null);
    }).finally(() => {
      // this should be reached after both errors and success, we can clean up the shouldFetch flag here to allow future searches to trigger new fetches
      setShouldFetch(false);
    });
    return () => {
      // any cleanup if needed when username changes or component unmounts
    };
  }, [username, shouldFetch, cache, API_BACKEND, apiInstance]);

  // watch for errors and log them (or display in UI)
  useEffect(() => {
    if (error) {
      console.error("Error fetching profile:", error);
    }
  }, [error]);

  // watch for profile changes and log them (or display in UI)
  useEffect(() => {
    if (profile) {
      console.log("Fetched profile:", profile);
    }
  }, [profile]);


  return (
      <div>
        <h2>GitHub User Search</h2>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="api-backend-select">Select API Backend: </label>
            <select
              id="api-backend-select"
              value={API_BACKEND}
              onChange={(e) => setAPI_BACKED(e.target.value as API_BACKEND_TYPE)}
              style={{ padding: '8px', fontSize: '16px' }}
            >
              <option value="MockAPI">Mock API</option>
              <option value="RealAPI">Real GitHub API</option>
            </select>
          </div>
        <SearchInput
          onSearch={handleSearch}
          onDebouncedSearch={handleDebouncedSearch}
        />
        {/* Display the user profile here after fetching */}

        {error && <p style={{ color: 'red', marginTop: '16px' }}>Error: {error.message}</p>}
        {profile && <UserProfileView profile={profile} />}
      </div>
  )
}

interface SearchInputProps {
  onSearch: (username: string) => void;
  onDebouncedSearch: (username: string) => void;
}

function SearchInput({ onSearch, onDebouncedSearch }: SearchInputProps): React.JSX.Element {
  const debounceWaitTime = 500; // milliseconds
  const [debouncedValue, setDebouncedValue] = useState("");

  const [inputValue, setInputValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(e.target.value);
    onSearch(e.target.value);
  }

  // Effect on inputValue changes to handle debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
      onDebouncedSearch(inputValue);
    }, debounceWaitTime);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onDebouncedSearch]);

  return (
    <div className="search-input" style={{ marginTop: '16px' }}>
      <input
        type="text"
        placeholder="Search GitHub username..."
        value={inputValue}
        onChange={handleChange}
        style={{ padding: '8px', width: '300px', fontSize: '16px' }}
      />
      {debouncedValue ? <p style={{ marginTop: '8px'}}>Searching for: {debouncedValue}</p> : <p style={{ marginTop: '8px'}}>Type a username to search...</p>}
    </div>
  )
}


type APIResponse ={
  profile?: UserProfile;
  hadError: boolean;
  error?: Error;
}


class MockAPI {
  static async fetchUserProfile(username: string): Promise<APIResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return mock data
    // roll a die to simulate random errors
    const random = Math.random();
    if (random < 0.2) {
      return {
        hadError: true,
        error: { message: "Network error", documentation_url: "" },
      };
    } else if (random < 0.4) {
      return {
        hadError: true,
        error: { message: "User not found", documentation_url: "" },
      };
    } else {

      const mockProfile: UserProfile = {
        login: username,
        name: `Mock Name for ${username}`,
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
        public_repos: Math.floor(Math.random() * 100),
      };
      return {
        hadError: false,
        profile: mockProfile,
      };

    };
  }
}



