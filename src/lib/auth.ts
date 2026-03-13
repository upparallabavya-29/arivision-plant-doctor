export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Added password for local auth
    avatar: string;
    role: "admin" | "user";
    lastLogin: string;
}

const CURRENT_USER_KEY = "arivision_current_user";
const ALL_USERS_KEY = "arivision_all_users";

export function getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
}

// Replaced loginUser with one that checks credentials
export function loginUser(email: string, password?: string): User {
    const allUsers = getAllUsers();
    const user = allUsers.find(u => u.email === email && (!u.password || u.password === password));

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const fullUser: User = { ...user, lastLogin: new Date().toISOString() };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(fullUser));

    // Update last login in all users
    const existingIndex = allUsers.findIndex((u) => u.email === fullUser.email);
    allUsers[existingIndex] = fullUser;
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));

    return fullUser;
}

// Added registerUser
export function registerUser(user: Omit<User, "id" | "lastLogin" | "role" | "avatar">): User {
    const allUsers = getAllUsers();

    if (allUsers.some(u => u.email === user.email)) {
        throw new Error("User with this email already exists");
    }

    const newUser: User = {
        ...user,
        id: Math.random().toString(36).substring(2, 9),
        role: "user",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=random`,
        lastLogin: new Date().toISOString()
    };

    allUsers.push(newUser);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return newUser;
}

export function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function getAllUsers(): User[] {
    const data = localStorage.getItem(ALL_USERS_KEY);
    return data ? JSON.parse(data) : [];
}

export function clearAuthData() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(ALL_USERS_KEY);
}
