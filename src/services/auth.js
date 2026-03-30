// Servicio de autenticación simple (Mock)

const AUTH_KEY = 'pmo_auth_user_v1';
const USERS_KEY = 'pmo_users_v1';

const MOCK_USERS = [
    {
        email: 'admin@pmo.com',
        password: 'admin',
        name: 'PMO Admin',
        role: 'Administrador'
    },
    {
        email: 'visualizar@pmo.com',
        password: 'admin',
        name: 'Visualizador',
        role: 'Visualizador'
    },
    {
        email: 'user@pmo.com',
        password: 'user',
        name: 'Analista PMO',
        role: 'Analista'
    }
];

export const AuthService = {
    init: () => {
        let existingUsers = [];
        try {
            existingUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch(e) { /* ignore */ }
        
        // Add new mock users if they don't exist
        MOCK_USERS.forEach(mock => {
            if (!existingUsers.some(u => u.email === mock.email)) {
                existingUsers.push(mock);
            } else {
                // Update properties just in case
                const index = existingUsers.findIndex(u => u.email === mock.email);
                existingUsers[index] = mock;
            }
        });
        
        localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
    },

    login: (email, password) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Guardamos todo menos la contraseña
            const { password: _, ...userWithoutPass } = user;
            localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPass));
            return userWithoutPass;
        }
        throw new Error('Credenciales incorrectas');
    },

    logout: () => {
        localStorage.removeItem(AUTH_KEY);
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem(AUTH_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    recoverPassword: (email) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const exists = users.some(u => u.email === email);
        
        if (exists) {
            // Simulación de envío de correo
            return Promise.resolve(true);
        }
        return Promise.reject(new Error('El correo ingresado no está registrado'));
    }
};
