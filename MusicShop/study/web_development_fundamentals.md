# Web Development Fundamentals - MusicShop Learning Notes

This document summarizes the key technical concepts and architectural decisions discussed during the development of the MusicShop project.

---

## 1. React Hooks & State Management

### `useState` Deep Dive
- **Lazy Initialization**: Pass a function to `useState` to perform expensive work (like reading `localStorage`) only once during the initial mount.
  - `const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));`
- **Functional Updates**: Use the `prev => ...` pattern when the new state depends on the previous one. This avoids "stale state" issues in asynchronous updates.
  - `setCount(prev => prev + 1);`

### `useEffect` Dependencies
- **`[]` (Empty Array)**: Runs only once after the initial mount. Ideal for initialization or one-time API calls.
- **`[dep]`**: Runs on mount and whenever `dep` changes.
- **No Array**: Runs after every single render. **Warning:** High-performance cost and potential infinite loops.

---

## 2. Authentication & Security

### Token Storage Strategies
| Strategy | Storage | Security | Pros/Cons |
| :--- | :--- | :--- | :--- |
| **LocalStorage** | Disk | ⚠️ Low | Easy to use but vulnerable to **XSS** scripts. |
| **HttpOnly Cookie** | Secure Browser Storage | ✅ High | Invisible to JavaScript. Protects against XSS stealing tokens. |
| **Memory (RAM)** | Context/State | ✅ High | Lost on page refresh. Usually combined with cookies for persistence. |

### Refresh Token Rotation
A security pattern where every time a `RefreshToken` is used to get a new `AccessToken`, the server also issues a **new** `RefreshToken` and invalidates the old one.

---

## 3. Web API & Network (CORS)

### HTTP Headers
- **`Set-Cookie`**: Sent by the Server (`HttpResponse`) to tell the browser to store a cookie.
- **`Cookie`**: Automatically sent by the Browser (`HttpRequest`) to the Server for matching domains.

### CORS & Credentials
- **`AllowCredentials()` (Backend)**: Tells the browser it's okay to accept sensitive headers like Cookies. **Must** be used with specific origins (no `*`).
- **`credentials: 'include'` (Frontend)**: A flag in `fetch` that tells the browser to actually send/receive cookies for cross-origin requests.

---

## 4. ASP.NET Core Architecture

### Dependency Injection (DI) Lifetimes
- **Transient**: New instance every time it's requested.
- **Scoped**: One instance per HTTP Request. Ideal for `DbContext` and `Repositories` to ensure thread safety and data isolation.
- **Singleton**: One instance for the lifetime of the application. **Warning:** Not suitable for data-handling objects due to concurrency issues.

### `ActionResult` vs. `HttpResponse`
- **`ActionResult<T>`**: High-level abstraction for endpoint results (Status codes + Data).
- **`HttpResponse`**: Low-level object representing the actual response stream (Headers, Cookies, Body).
