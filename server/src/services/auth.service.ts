import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

export class AuthService {
    static async init() {
        const dataDir = path.dirname(USERS_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        if (!fs.existsSync(USERS_FILE) || this.getUsers().length === 0) {
            console.log('[AuthService] Semeando usuário admin padrão...');
            const hashedPassword = await bcrypt.hash('123456', 10);
            const adminUser = {
                id: 'admin-id',
                email: 'admin@bibleapp.com',
                password: hashedPassword,
                name: 'Administrador',
                createdAt: new Date()
            };
            this.saveUsers([adminUser]);
        }
    }

    private static getUsers() {
        if (!fs.existsSync(USERS_FILE)) return [];
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data || '[]');
    }

    private static saveUsers(users: any[]) {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }

    static async register(userData: any) {
        const users = this.getUsers();
        if (users.find((u: any) => u.email === userData.email)) {
            throw new Error('E-mail já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(newUser);
        this.saveUsers(users);

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    static async login(credentials: any) {
        const users = this.getUsers();
        const user = users.find((u: any) => u.email === credentials.email);

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            throw new Error('Credenciais inválidas');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '30d' }
        );

        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
