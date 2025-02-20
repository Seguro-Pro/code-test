import React, { useState, useEffect } from "react";

// Buggy Component for Debugging
function Greeting({ name }: { name: string | null }) {
    return <h1>Hello, {name.toUpperCase()}</h1>; // Bug: Crashes if name is null
}

// Feature Implementation: Add a search bar to filter users
interface User {
    id: number;
    name: string;
}

function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        fetch("/users") // Candidate should handle errors here
            .then(res => res.json())
            .then((data: User[]) => setUsers(data)); // Missing error handling
    }, []);

    return (
        <div>
            {/* Candidate needs to add a search bar */}
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

// Buggy API Call - Needs fixing
function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            const response = await fetch("/login", {
                method: "POST",
                body: JSON.stringify({ username, password }) // Missing headers
            });
            
            const data = await response.json(); // No error handling
            console.log("Logged in!", data);
        } catch (err: any) {
            console.error("Login failed"); // Needs proper error handling
        }
    };

    return (
        <div>
            <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            {error && <p>{error}</p>}
        </div>
    );
}

// Performance Issue: Finding duplicates (O(n^2))
function FindDuplicates({ numbers }: { numbers: number[] }) {
    const findDuplicates = (): number[] => {
        const duplicates: number[] = [];
        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                if (numbers[i] === numbers[j] && !duplicates.includes(numbers[i])) {
                    duplicates.push(numbers[i]);
                }
            }
        }
        return duplicates;
    };
    return <p>Duplicates: {findDuplicates().join(", ")}</p>; // Candidate should optimize this
}

// Async Challenge: Identify missing async waits
function FetchData() {
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            let usersData;
            let postsData;
            
            fetch("/users").then(res => res.json()).then(data => usersData = data); // Missing await
            fetch("/posts").then(res => res.json()).then(data => postsData = data); // Missing await
            
            setUsers(usersData);
            setPosts(postsData);
        }
        fetchData();
    }, []);
    
    return <p>Users: {users.length}, Posts: {posts.length}</p>;
}

export default function App() {
    return (
        <div>
            <h2>React Interview Test</h2>
            <Greeting name={null} /> {/* Debugging test */}
            <UserList /> {/* Feature extension test */}
            <Login /> {/* HTTP API error handling test */}
            <FindDuplicates numbers={[1, 2, 3, 2, 4, 5, 1]} /> {/* Performance test */}
            <FetchData /> {/* Async / promises test */}
        </div>
    );
}
